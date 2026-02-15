# KISAN-DRISHTI Backend - Complete Implementation Guide

This document contains the remaining code implementations for the production-grade backend system.

## Table of Contents
1. Server Entry Point
2. Middleware Implementation
3. Controllers
4. Services
5. Repositories
6. Routes
7. WebSocket Server
8. Utilities
9. Database Seeder
10. Docker Configuration
11. PM2 Configuration

---

## 1. SERVER ENTRY POINT (src/server.ts)

```typescript
import http from 'http';
import app from './app';
import config from './config/env';
import logger from './utils/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getRedisClient, disconnectRedis } from './config/redis';
import { initializeWebSocket } from './websocket/socket.server';

const PORT = config.PORT || 3000;
const server = http.createServer(app);

// Initialize WebSocket if enabled
if (config.ENABLE_WEBSOCKET) {
  initializeWebSocket(server);
  logger.info('✅ WebSocket server initialized');
}

// Graceful shutdown handler
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  // Close server (stop accepting new requests)
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      // Disconnect from databases
      await Promise.all([
        disconnectDatabase(),
        disconnectRedis(),
      ]);
      
      logger.info('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to databases
    await connectDatabase();
    const redis = getRedisClient();
    await redis.ping();
    logger.info('✅ Redis connected successfully');
    
    // Start listening
    server.listen(PORT, () => {
      logger.info('🚀 KISAN-DRISHTI API Server Started');
      logger.info(`📍 Environment: ${config.NODE_ENV}`);
      logger.info(`🌐 Server running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`📖 API docs: http://localhost:${PORT}/api/${config.API_VERSION}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

---

## 2. KEY MIDDLEWARE (src/middleware/)

### auth.middleware.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { sendUnauthorized } from '../utils/response';
import { UserService } from '../services/user.service';

const userService = new UserService();

export interface AuthRequest extends Request {
  user?: any;
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return sendUnauthorized(res, 'Authentication required');
    }
    
    // JWT for admins (starts with 'admin_' or is a valid JWT)
    if (token.includes('.')) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as any;
        const user = await userService.findById(decoded.userId);
        
        if (!user || !user.isActive) {
          return sendUnauthorized(res, 'Invalid or inactive account');
        }
        
        req.user = user;
        req.userId = user.id;
        return next();
      } catch (jwtError) {
        return sendUnauthorized(res, 'Invalid token');
      }
    }
    
    // Device token for farmers (UUID format)
    const session = await userService.findSessionByToken(token);
    
    if (!session || new Date() > session.expiresAt) {
      return sendUnauthorized(res, 'Session expired');
    }
    
    if (!session.user.isActive) {
      return sendUnauthorized(res, 'Account inactive');
    }
    
    req.user = session.user;
    req.userId = session.userId;
    next();
  } catch (error) {
    return sendUnauthorized(res, 'Authentication failed');
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return next();
  }
  
  try {
    await authenticate(req, res, next);
  } catch (error) {
    // Continue without auth
    next();
  }
};
```

### role.middleware.ts
```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { sendForbidden } from '../utils/response';

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendForbidden(res, 'Authentication required');
    }
    
    if (!roles.includes(req.user.role)) {
      return sendForbidden(res, 'Insufficient permissions');
    }
    
    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireFarmer = requireRole('farmer');
```

### validation.middleware.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendValidationError } from '../utils/response';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendValidationError(res, error.errors);
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendValidationError(res, error.errors);
      }
      next(error);
    }
  };
};
```

### error.middleware.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';
import { sendServerError, sendError } from '../utils/response';
import config from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error Handler:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  
  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return sendError(res, 'Resource already exists', 409);
      case 'P2025':
        return sendError(res, 'Resource not found', 404);
      case 'P2003':
        return sendError(res, 'Invalid reference', 400);
      default:
        return sendServerError(res, 'Database error');
    }
  }
  
  if (err instanceof Prisma.PrismaClientValidationError) {
    return sendError(res, 'Invalid data provided', 400);
  }
  
  // CORS error
  if (err.message === 'CORS policy violation') {
    return sendError(res, 'CORS policy violation', 403);
  }
  
  // Default error
  const message = config.NODE_ENV === 'production' 
    ? 'Internal server error'
    : err.message;
  
  sendServerError(res, message);
};
```

### notfound.middleware.ts
```typescript
import { Request, Response } from 'express';
import { sendNotFound } from '../utils/response';

export const notFoundHandler = (req: Request, res: Response) => {
  sendNotFound(res, `Route ${req.method} ${req.url} not found`);
};
```

### ratelimit.middleware.ts
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getRedisClient } from '../config/redis';
import config from '../config/env';

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: getRedisClient(),
    prefix: 'rl:api:',
  }),
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminLimiter = rateLimit({
  store: new RedisStore({
    client: getRedisClient(),
    prefix: 'rl:admin:',
  }),
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_ADMIN_MAX,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
});

export const strictLimiter = rateLimit({
  store: new RedisStore({
    client: getRedisClient(),
    prefix: 'rl:strict:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    error: 'Rate limit exceeded for sensitive operation',
  },
});
```

---

For the complete implementation with all controllers, services, repositories, routes, WebSocket handlers, and database seeders, please refer to the generated files in the project structure. Each file follows the architecture outlined in BACKEND_ARCHITECTURE.md.

Key implementation files include:
- Controllers: Handle HTTP requests and delegate to services
- Services: Contain business logic and orchestrate operations
- Repositories: Direct database access using Prisma
- Routes: Define API endpoints and apply middleware
- WebSocket: Real-time price broadcast handlers
- Seeders: Initialize database with crops, mandis, and admin users

All files follow TypeScript best practices with strict typing, error handling, logging, and comprehensive comments.


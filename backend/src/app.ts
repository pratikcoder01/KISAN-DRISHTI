// src/app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import config from './config/env';
import { requestLogStream } from './utils/logger';

// Import routes
import v1Routes from './routes/v1';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notfound.middleware';

/**
 * Create and configure Express application
 */
export const createApp = (): Application => {
  const app = express();

  // ================================
  // SECURITY MIDDLEWARE
  // ================================
  
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (config.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    },
    credentials: config.CORS_CREDENTIALS,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // ================================
  // REQUEST PARSING
  // ================================
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ================================
  // RESPONSE COMPRESSION
  // ================================
  
  app.use(compression());

  // ================================
  // LOGGING
  // ================================
  
  if (config.ENABLE_REQUEST_LOGGING) {
    const morganFormat = config.NODE_ENV === 'production'
      ? 'combined'
      : 'dev';
    
    app.use(morgan(morganFormat, { stream: requestLogStream }));
  }

  // ================================
  // HEALTH CHECK (Before auth)
  // ================================
  
  if (config.HEALTH_CHECK_ENABLED) {
    app.get('/health', async (_req: Request, res: Response): Promise<Response | void> => {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
        version: config.API_VERSION,
        services: {
          database: 'unknown',
          redis: 'unknown',
        },
      };

      try {
        // Try to check database health
        try {
          const { checkDatabaseHealth } = await import('./config/database');
          const dbHealthy = await checkDatabaseHealth();
          health.services.database = dbHealthy ? 'healthy' : 'unhealthy';
        } catch (_e) {
          health.services.database = 'unavailable';
        }

        // Try to check redis health
        try {
          const { checkRedisHealth } = await import('./config/redis');
          const redisHealthy = await checkRedisHealth();
          health.services.redis = redisHealthy ? 'healthy' : 'unhealthy';
        } catch (_e) {
          health.services.redis = 'unavailable';
        }

        return res.status(200).json(health);
      } catch (_error) {
        health.status = 'error';
        return res.status(503).json(health);
      }
    });
  }

  // ================================
  // API ROUTES
  // ================================
  
  app.use(`/api/${config.API_VERSION}`, v1Routes);

  // Root endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'KISAN-DRISHTI API',
      version: config.API_VERSION,
      description: 'Smart Agricultural Market Intelligence Platform',
      status: 'running',
      documentation: `/api/${config.API_VERSION}/docs`,
    });
  });

  // ================================
  // ERROR HANDLING
  // ================================
  
  // 404 handler
  app.use(notFoundHandler);
  
  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};

export default createApp();

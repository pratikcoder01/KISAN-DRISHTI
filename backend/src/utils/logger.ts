// src/utils/logger.ts
import winston from 'winston';
import path from 'path';
import config from '../config/env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format for pretty console output
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Create logger instance
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  defaultMeta: { 
    service: config.APP_NAME || 'kisan-drishti-api',
    env: config.NODE_ENV 
  },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(config.LOG_FILE_PATH, 'error.log'),
      level: 'error',
      format: json(),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 14, // Keep 14 days
    }),
    
    // Combined logs
    new winston.transports.File({
      filename: path.join(config.LOG_FILE_PATH, 'combined.log'),
      format: json(),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 14,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(config.LOG_FILE_PATH, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(config.LOG_FILE_PATH, 'rejections.log'),
    }),
  ],
});

// Console transport for development
if (config.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: config.PRETTY_LOGS
        ? combine(colorize(), consoleFormat)
        : combine(colorize(), json()),
    })
  );
}

// Request logger for Morgan
export const requestLogStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper methods for structured logging
export const loggers = {
  database: (action: string, metadata?: any) => {
    logger.info(`Database ${action}`, { category: 'database', ...metadata });
  },
  
  api: (method: string, path: string, statusCode: number, duration: number, metadata?: any) => {
    logger.info('API Request', {
      category: 'api',
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...metadata,
    });
  },
  
  auth: (action: string, userId?: string, metadata?: any) => {
    logger.info(`Auth ${action}`, {
      category: 'auth',
      userId,
      ...metadata,
    });
  },
  
  websocket: (event: string, metadata?: any) => {
    logger.info(`WebSocket ${event}`, {
      category: 'websocket',
      ...metadata,
    });
  },
  
  cache: (action: string, key: string, metadata?: any) => {
    logger.debug(`Cache ${action}`, {
      category: 'cache',
      key,
      ...metadata,
    });
  },
  
  business: (action: string, metadata?: any) => {
    logger.info(`Business Logic: ${action}`, {
      category: 'business',
      ...metadata,
    });
  },
};

export default logger;

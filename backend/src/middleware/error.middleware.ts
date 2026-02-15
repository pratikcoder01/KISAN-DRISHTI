// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
  _err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error:', _err);
  
  const statusCode = _err.statusCode || 500;
  const message = _err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: _err }),
  });
};

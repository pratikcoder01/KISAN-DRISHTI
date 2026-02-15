// src/routes/v1/index.ts
import { Router, Request, Response } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'KISAN-DRISHTI Backend API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1',
  });
});

// Basic status endpoint
router.get('/status', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is operational',
    uptime: process.uptime(),
  });
});

export default router;

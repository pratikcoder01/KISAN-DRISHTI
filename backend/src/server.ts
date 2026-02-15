// src/server.ts
import { createApp } from './app';
import config from './config/env';
import logger from './utils/logger';

const PORT = config.PORT || 3000;

const startServer = async () => {
  try {
    const app = createApp();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📊 Environment: ${config.NODE_ENV}`);
      logger.info(`🔌 API Version: ${config.API_VERSION}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

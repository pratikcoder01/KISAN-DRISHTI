// src/config/database.ts
import { PrismaClient } from '@prisma/client';
import config from './env';
import logger from '../utils/logger';

// Prisma client singleton
let prisma: PrismaClient;

const createPrismaClient = (): PrismaClient => {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: config.DATABASE_URL,
      },
    },
    log: config.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  });

  // Connection event handlers
  client.$on('query' as never, (e: any) => {
    if (config.NODE_ENV === 'development') {
      logger.debug('Database Query', {
        query: e.query,
        params: e.params,
        duration: `${e.duration}ms`,
      });
    }
  });

  return client;
};

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = createPrismaClient();
  }
  return prisma;
};

// Initialize database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    const client = getPrismaClient();
    await client.$connect();
    logger.info('✅ Database connected successfully');
    
    // Test connection with a simple query
    await client.$queryRaw`SELECT 1`;
    logger.info('✅ Database health check passed');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (prisma) {
      await prisma.$disconnect();
      logger.info('✅ Database disconnected successfully');
    }
  } catch (error) {
    logger.error('❌ Error disconnecting database:', error);
    throw error;
  }
};

// Health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

export default getPrismaClient();

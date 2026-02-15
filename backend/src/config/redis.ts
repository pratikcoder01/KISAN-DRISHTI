// src/config/redis.ts
import Redis from 'ioredis';
import config from './env';
import logger from '../utils/logger';

// Redis client singleton
let redisClient: Redis;

export const createRedisClient = (): Redis => {
  const client = new Redis(config.REDIS_URL, {
    password: config.REDIS_PASSWORD || undefined,
    db: config.REDIS_DB,
    keyPrefix: config.REDIS_PREFIX,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError: (err) => {
      logger.error('Redis reconnect on error:', err.message);
      return true;
    },
  });

  // Connection events
  client.on('connect', () => {
    logger.info('✅ Redis connected');
  });

  client.on('ready', () => {
    logger.info('✅ Redis ready');
  });

  client.on('error', (err) => {
    logger.error('❌ Redis error:', err);
  });

  client.on('close', () => {
    logger.warn('⚠️  Redis connection closed');
  });

  client.on('reconnecting', () => {
    logger.warn('🔄 Redis reconnecting...');
  });

  return client;
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = createRedisClient();
  }
  return redisClient;
};

// Graceful shutdown
export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('✅ Redis disconnected successfully');
    }
  } catch (error) {
    logger.error('❌ Error disconnecting Redis:', error);
    throw error;
  }
};

// Health check
export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    const client = getRedisClient();
    const pong = await client.ping();
    return pong === 'PONG';
  } catch (error) {
    logger.error('Redis health check failed:', error);
    return false;
  }
};

// Cache helper functions
export class CacheHelper {
  private client: Redis;
  
  constructor() {
    this.client = getRedisClient();
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }
  
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }
  
  async delete(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }
  
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.client.del(...keys);
    } catch (error) {
      logger.error(`Cache delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }
  
  async increment(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      logger.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }
  
  async setWithExpiry(key: string, value: any, seconds: number): Promise<boolean> {
    return this.set(key, value, seconds);
  }
  
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }
  
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }
}

export const cache = new CacheHelper();

export default getRedisClient();

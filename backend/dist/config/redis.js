"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.CacheHelper = exports.checkRedisHealth = exports.disconnectRedis = exports.getRedisClient = exports.createRedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("../utils/logger"));
let redisClient;
const createRedisClient = () => {
    const client = new ioredis_1.default(env_1.default.REDIS_URL, {
        password: env_1.default.REDIS_PASSWORD || undefined,
        db: env_1.default.REDIS_DB,
        keyPrefix: env_1.default.REDIS_PREFIX,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
        reconnectOnError: (err) => {
            logger_1.default.error('Redis reconnect on error:', err.message);
            return true;
        },
    });
    client.on('connect', () => {
        logger_1.default.info('✅ Redis connected');
    });
    client.on('ready', () => {
        logger_1.default.info('✅ Redis ready');
    });
    client.on('error', (err) => {
        logger_1.default.error('❌ Redis error:', err);
    });
    client.on('close', () => {
        logger_1.default.warn('⚠️  Redis connection closed');
    });
    client.on('reconnecting', () => {
        logger_1.default.warn('🔄 Redis reconnecting...');
    });
    return client;
};
exports.createRedisClient = createRedisClient;
const getRedisClient = () => {
    if (!redisClient) {
        redisClient = (0, exports.createRedisClient)();
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
const disconnectRedis = async () => {
    try {
        if (redisClient) {
            await redisClient.quit();
            logger_1.default.info('✅ Redis disconnected successfully');
        }
    }
    catch (error) {
        logger_1.default.error('❌ Error disconnecting Redis:', error);
        throw error;
    }
};
exports.disconnectRedis = disconnectRedis;
const checkRedisHealth = async () => {
    try {
        const client = (0, exports.getRedisClient)();
        const pong = await client.ping();
        return pong === 'PONG';
    }
    catch (error) {
        logger_1.default.error('Redis health check failed:', error);
        return false;
    }
};
exports.checkRedisHealth = checkRedisHealth;
class CacheHelper {
    client;
    constructor() {
        this.client = (0, exports.getRedisClient)();
    }
    async get(key) {
        try {
            const value = await this.client.get(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            logger_1.default.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            const serialized = JSON.stringify(value);
            if (ttl) {
                await this.client.setex(key, ttl, serialized);
            }
            else {
                await this.client.set(key, serialized);
            }
            return true;
        }
        catch (error) {
            logger_1.default.error(`Cache set error for key ${key}:`, error);
            return false;
        }
    }
    async delete(key) {
        try {
            await this.client.del(key);
            return true;
        }
        catch (error) {
            logger_1.default.error(`Cache delete error for key ${key}:`, error);
            return false;
        }
    }
    async deletePattern(pattern) {
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length === 0)
                return 0;
            return await this.client.del(...keys);
        }
        catch (error) {
            logger_1.default.error(`Cache delete pattern error for ${pattern}:`, error);
            return 0;
        }
    }
    async increment(key) {
        try {
            return await this.client.incr(key);
        }
        catch (error) {
            logger_1.default.error(`Cache increment error for key ${key}:`, error);
            return 0;
        }
    }
    async setWithExpiry(key, value, seconds) {
        return this.set(key, value, seconds);
    }
    async exists(key) {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            logger_1.default.error(`Cache exists error for key ${key}:`, error);
            return false;
        }
    }
    async ttl(key) {
        try {
            return await this.client.ttl(key);
        }
        catch (error) {
            logger_1.default.error(`Cache TTL error for key ${key}:`, error);
            return -1;
        }
    }
}
exports.CacheHelper = CacheHelper;
exports.cache = new CacheHelper();
exports.default = (0, exports.getRedisClient)();
//# sourceMappingURL=redis.js.map
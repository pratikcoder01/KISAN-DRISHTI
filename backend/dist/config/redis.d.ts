import Redis from 'ioredis';
export declare const createRedisClient: () => Redis;
export declare const getRedisClient: () => Redis;
export declare const disconnectRedis: () => Promise<void>;
export declare const checkRedisHealth: () => Promise<boolean>;
export declare class CacheHelper {
    private client;
    constructor();
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    deletePattern(pattern: string): Promise<number>;
    increment(key: string): Promise<number>;
    setWithExpiry(key: string, value: any, seconds: number): Promise<boolean>;
    exists(key: string): Promise<boolean>;
    ttl(key: string): Promise<number>;
}
export declare const cache: CacheHelper;
declare const _default: Redis;
export default _default;
//# sourceMappingURL=redis.d.ts.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isProduction = exports.isDevelopment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive()).default('3000'),
    API_VERSION: zod_1.z.string().default('v1'),
    APP_NAME: zod_1.z.string().default('KISAN-DRISHTI'),
    DATABASE_URL: zod_1.z.string().url(),
    DB_POOL_SIZE: zod_1.z.string().transform(Number).pipe(zod_1.z.number().positive()).default('20'),
    REDIS_URL: zod_1.z.string().url(),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    REDIS_DB: zod_1.z.string().transform(Number).pipe(zod_1.z.number()).default('0'),
    REDIS_PREFIX: zod_1.z.string().default('kd:'),
    CACHE_TTL_PRICES: zod_1.z.string().transform(Number).default('300'),
    CACHE_TTL_MANDIS: zod_1.z.string().transform(Number).default('3600'),
    CACHE_TTL_USERS: zod_1.z.string().transform(Number).default('1800'),
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRY: zod_1.z.string().default('24h'),
    REFRESH_TOKEN_EXPIRY: zod_1.z.string().default('7d'),
    BCRYPT_ROUNDS: zod_1.z.string().transform(Number).pipe(zod_1.z.number()).default('10'),
    SESSION_SECRET: zod_1.z.string().min(16),
    SESSION_EXPIRY_HOURS: zod_1.z.string().transform(Number).default('720'),
    ALLOWED_ORIGINS: zod_1.z.string().transform(s => s.split(',')),
    CORS_CREDENTIALS: zod_1.z.string().transform(s => s === 'true').default('true'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX: zod_1.z.string().transform(Number).default('100'),
    RATE_LIMIT_ADMIN_MAX: zod_1.z.string().transform(Number).default('500'),
    ENABLE_WEBSOCKET: zod_1.z.string().transform(s => s === 'true').default('true'),
    WEBSOCKET_PING_INTERVAL: zod_1.z.string().transform(Number).default('25000'),
    WEBSOCKET_PING_TIMEOUT: zod_1.z.string().transform(Number).default('5000'),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    LOG_FILE_PATH: zod_1.z.string().default('logs/'),
    ENABLE_VOICE: zod_1.z.string().transform(s => s === 'true').default('true'),
    ENABLE_SMS_VERIFICATION: zod_1.z.string().transform(s => s === 'true').default('false'),
    ENABLE_ANALYTICS: zod_1.z.string().transform(s => s === 'true').default('true'),
    ENABLE_AUDIT_LOGS: zod_1.z.string().transform(s => s === 'true').default('true'),
    SMS_PROVIDER: zod_1.z.string().optional(),
    SMS_ACCOUNT_SID: zod_1.z.string().optional(),
    SMS_AUTH_TOKEN: zod_1.z.string().optional(),
    WEATHER_API_KEY: zod_1.z.string().optional(),
    MAPS_API_KEY: zod_1.z.string().optional(),
    SENTRY_DSN: zod_1.z.string().optional(),
    HEALTH_CHECK_ENABLED: zod_1.z.string().transform(s => s === 'true').default('true'),
    DEFAULT_ADMIN_EMAIL: zod_1.z.string().email().default('admin@kisan-drishti.gov.in'),
    DEFAULT_ADMIN_PASSWORD: zod_1.z.string().min(8).default('ChangeMeInProduction!123'),
    DEFAULT_ADMIN_NAME: zod_1.z.string().default('System Administrator'),
    SYNC_SNAPSHOT_TTL: zod_1.z.string().transform(Number).default('3600'),
    OFFLINE_DATA_DAYS: zod_1.z.string().transform(Number).default('7'),
    SEED_DATA_ON_START: zod_1.z.string().transform(s => s === 'true').default('false'),
    ENABLE_REQUEST_LOGGING: zod_1.z.string().transform(s => s === 'true').default('true'),
    PRETTY_LOGS: zod_1.z.string().transform(s => s === 'true').default('true'),
});
let config;
try {
    config = envSchema.parse(process.env);
}
catch (error) {
    console.error('❌ Invalid environment configuration:');
    if (error instanceof zod_1.z.ZodError) {
        error.errors.forEach(err => {
            console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
    }
    process.exit(1);
}
exports.default = config;
exports.isDevelopment = config.NODE_ENV === 'development';
exports.isProduction = config.NODE_ENV === 'production';
exports.isTest = config.NODE_ENV === 'test';
//# sourceMappingURL=env.js.map
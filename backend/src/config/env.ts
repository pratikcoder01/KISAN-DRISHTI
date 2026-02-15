// src/config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default('3000'),
  API_VERSION: z.string().default('v1'),
  APP_NAME: z.string().default('KISAN-DRISHTI'),
  
  // Database
  DATABASE_URL: z.string().url(),
  DB_POOL_SIZE: z.string().transform(Number).pipe(z.number().positive()).default('20'),
  
  // Redis
  REDIS_URL: z.string().url(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().transform(Number).pipe(z.number()).default('0'),
  REDIS_PREFIX: z.string().default('kd:'),
  
  // Cache TTL
  CACHE_TTL_PRICES: z.string().transform(Number).default('300'),
  CACHE_TTL_MANDIS: z.string().transform(Number).default('3600'),
  CACHE_TTL_USERS: z.string().transform(Number).default('1800'),
  
  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('24h'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
  BCRYPT_ROUNDS: z.string().transform(Number).pipe(z.number()).default('10'),
  SESSION_SECRET: z.string().min(16),
  SESSION_EXPIRY_HOURS: z.string().transform(Number).default('720'),
  
  // CORS
  ALLOWED_ORIGINS: z.string().transform(s => s.split(',')),
  CORS_CREDENTIALS: z.string().transform(s => s === 'true').default('true'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_ADMIN_MAX: z.string().transform(Number).default('500'),
  
  // WebSocket
  ENABLE_WEBSOCKET: z.string().transform(s => s === 'true').default('true'),
  WEBSOCKET_PING_INTERVAL: z.string().transform(Number).default('25000'),
  WEBSOCKET_PING_TIMEOUT: z.string().transform(Number).default('5000'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_PATH: z.string().default('logs/'),
  
  // Features
  ENABLE_VOICE: z.string().transform(s => s === 'true').default('true'),
  ENABLE_SMS_VERIFICATION: z.string().transform(s => s === 'true').default('false'),
  ENABLE_ANALYTICS: z.string().transform(s => s === 'true').default('true'),
  ENABLE_AUDIT_LOGS: z.string().transform(s => s === 'true').default('true'),
  
  // External Services (optional)
  SMS_PROVIDER: z.string().optional(),
  SMS_ACCOUNT_SID: z.string().optional(),
  SMS_AUTH_TOKEN: z.string().optional(),
  WEATHER_API_KEY: z.string().optional(),
  MAPS_API_KEY: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().optional(),
  HEALTH_CHECK_ENABLED: z.string().transform(s => s === 'true').default('true'),
  
  // Admin defaults
  DEFAULT_ADMIN_EMAIL: z.string().email().default('admin@kisan-drishti.gov.in'),
  DEFAULT_ADMIN_PASSWORD: z.string().min(8).default('ChangeMeInProduction!123'),
  DEFAULT_ADMIN_NAME: z.string().default('System Administrator'),
  
  // Sync
  SYNC_SNAPSHOT_TTL: z.string().transform(Number).default('3600'),
  OFFLINE_DATA_DAYS: z.string().transform(Number).default('7'),
  
  // Development
  SEED_DATA_ON_START: z.string().transform(s => s === 'true').default('false'),
  ENABLE_REQUEST_LOGGING: z.string().transform(s => s === 'true').default('true'),
  PRETTY_LOGS: z.string().transform(s => s === 'true').default('true'),
});

// Validate and export configuration
let config: z.infer<typeof envSchema>;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment configuration:');
  if (error instanceof z.ZodError) {
    error.errors.forEach(err => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  }
  process.exit(1);
}

export default config;

// Type-safe environment access
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';

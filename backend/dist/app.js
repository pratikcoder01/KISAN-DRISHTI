"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = __importDefault(require("./config/env"));
const logger_1 = require("./utils/logger");
const v1_1 = __importDefault(require("./routes/v1"));
const error_middleware_1 = require("./middleware/error.middleware");
const notfound_middleware_1 = require("./middleware/notfound.middleware");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }));
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (env_1.default.ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('CORS policy violation'));
            }
        },
        credentials: env_1.default.CORS_CREDENTIALS,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use((0, compression_1.default)());
    if (env_1.default.ENABLE_REQUEST_LOGGING) {
        const morganFormat = env_1.default.NODE_ENV === 'production'
            ? 'combined'
            : 'dev';
        app.use((0, morgan_1.default)(morganFormat, { stream: logger_1.requestLogStream }));
    }
    if (env_1.default.HEALTH_CHECK_ENABLED) {
        app.get('/health', async (_req, res) => {
            const health = {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: env_1.default.NODE_ENV,
                version: env_1.default.API_VERSION,
                services: {
                    database: 'unknown',
                    redis: 'unknown',
                },
            };
            try {
                try {
                    const { checkDatabaseHealth } = await Promise.resolve().then(() => __importStar(require('./config/database')));
                    const dbHealthy = await checkDatabaseHealth();
                    health.services.database = dbHealthy ? 'healthy' : 'unhealthy';
                }
                catch (_e) {
                    health.services.database = 'unavailable';
                }
                try {
                    const { checkRedisHealth } = await Promise.resolve().then(() => __importStar(require('./config/redis')));
                    const redisHealthy = await checkRedisHealth();
                    health.services.redis = redisHealthy ? 'healthy' : 'unhealthy';
                }
                catch (_e) {
                    health.services.redis = 'unavailable';
                }
                return res.status(200).json(health);
            }
            catch (_error) {
                health.status = 'error';
                return res.status(503).json(health);
            }
        });
    }
    app.use(`/api/${env_1.default.API_VERSION}`, v1_1.default);
    app.get('/', (_req, res) => {
        res.json({
            name: 'KISAN-DRISHTI API',
            version: env_1.default.API_VERSION,
            description: 'Smart Agricultural Market Intelligence Platform',
            status: 'running',
            documentation: `/api/${env_1.default.API_VERSION}/docs`,
        });
    });
    app.use(notfound_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
exports.default = (0, exports.createApp)();
//# sourceMappingURL=app.js.map
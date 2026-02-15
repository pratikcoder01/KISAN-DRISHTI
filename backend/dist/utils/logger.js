"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggers = exports.requestLogStream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("../config/env"));
const { combine, timestamp, printf, colorize, errors, json } = winston_1.default.format;
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
});
const logger = winston_1.default.createLogger({
    level: env_1.default.LOG_LEVEL,
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
    defaultMeta: {
        service: env_1.default.APP_NAME || 'kisan-drishti-api',
        env: env_1.default.NODE_ENV
    },
    transports: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(env_1.default.LOG_FILE_PATH, 'error.log'),
            level: 'error',
            format: json(),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 14,
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(env_1.default.LOG_FILE_PATH, 'combined.log'),
            format: json(),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 14,
        }),
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(env_1.default.LOG_FILE_PATH, 'exceptions.log'),
        }),
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(env_1.default.LOG_FILE_PATH, 'rejections.log'),
        }),
    ],
});
if (env_1.default.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: env_1.default.PRETTY_LOGS
            ? combine(colorize(), consoleFormat)
            : combine(colorize(), json()),
    }));
}
exports.requestLogStream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
exports.loggers = {
    database: (action, metadata) => {
        logger.info(`Database ${action}`, { category: 'database', ...metadata });
    },
    api: (method, path, statusCode, duration, metadata) => {
        logger.info('API Request', {
            category: 'api',
            method,
            path,
            statusCode,
            duration: `${duration}ms`,
            ...metadata,
        });
    },
    auth: (action, userId, metadata) => {
        logger.info(`Auth ${action}`, {
            category: 'auth',
            userId,
            ...metadata,
        });
    },
    websocket: (event, metadata) => {
        logger.info(`WebSocket ${event}`, {
            category: 'websocket',
            ...metadata,
        });
    },
    cache: (action, key, metadata) => {
        logger.debug(`Cache ${action}`, {
            category: 'cache',
            key,
            ...metadata,
        });
    },
    business: (action, metadata) => {
        logger.info(`Business Logic: ${action}`, {
            category: 'business',
            ...metadata,
        });
    },
};
exports.default = logger;
//# sourceMappingURL=logger.js.map
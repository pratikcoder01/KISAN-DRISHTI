"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = exports.disconnectDatabase = exports.connectDatabase = exports.getPrismaClient = void 0;
const client_1 = require("@prisma/client");
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("../utils/logger"));
let prisma;
const createPrismaClient = () => {
    const client = new client_1.PrismaClient({
        datasources: {
            db: {
                url: env_1.default.DATABASE_URL,
            },
        },
        log: env_1.default.NODE_ENV === 'development'
            ? ['query', 'info', 'warn', 'error']
            : ['error'],
    });
    client.$on('query', (e) => {
        if (env_1.default.NODE_ENV === 'development') {
            logger_1.default.debug('Database Query', {
                query: e.query,
                params: e.params,
                duration: `${e.duration}ms`,
            });
        }
    });
    return client;
};
const getPrismaClient = () => {
    if (!prisma) {
        prisma = createPrismaClient();
    }
    return prisma;
};
exports.getPrismaClient = getPrismaClient;
const connectDatabase = async () => {
    try {
        const client = (0, exports.getPrismaClient)();
        await client.$connect();
        logger_1.default.info('✅ Database connected successfully');
        await client.$queryRaw `SELECT 1`;
        logger_1.default.info('✅ Database health check passed');
    }
    catch (error) {
        logger_1.default.error('❌ Database connection failed:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        if (prisma) {
            await prisma.$disconnect();
            logger_1.default.info('✅ Database disconnected successfully');
        }
    }
    catch (error) {
        logger_1.default.error('❌ Error disconnecting database:', error);
        throw error;
    }
};
exports.disconnectDatabase = disconnectDatabase;
const checkDatabaseHealth = async () => {
    try {
        const client = (0, exports.getPrismaClient)();
        await client.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        logger_1.default.error('Database health check failed:', error);
        return false;
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.default = (0, exports.getPrismaClient)();
//# sourceMappingURL=database.js.map
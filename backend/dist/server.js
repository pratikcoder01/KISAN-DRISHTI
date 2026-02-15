"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = env_1.default.PORT || 3000;
const startServer = async () => {
    try {
        const app = (0, app_1.createApp)();
        app.listen(PORT, () => {
            logger_1.default.info(`🚀 Server running on http://localhost:${PORT}`);
            logger_1.default.info(`📊 Environment: ${env_1.default.NODE_ENV}`);
            logger_1.default.info(`🔌 API Version: ${env_1.default.API_VERSION}`);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map
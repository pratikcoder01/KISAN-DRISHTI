"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (_err, _req, res, _next) => {
    logger_1.default.error('Error:', _err);
    const statusCode = _err.statusCode || 500;
    const message = _err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { error: _err }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'KISAN-DRISHTI Backend API is running',
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || 'v1',
    });
});
router.get('/status', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is operational',
        uptime: process.uptime(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map
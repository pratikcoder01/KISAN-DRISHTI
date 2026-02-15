"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notfound.middleware.js.map
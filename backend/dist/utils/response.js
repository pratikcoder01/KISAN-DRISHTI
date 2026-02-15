"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = exports.parsePagination = exports.sendPaginated = exports.sendServerError = exports.sendConflict = exports.sendValidationError = exports.sendForbidden = exports.sendUnauthorized = exports.sendNotFound = exports.sendNoContent = exports.sendCreated = exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message, statusCode = 200, meta) => {
    const response = {
        success: true,
        data,
        timestamp: new Date().toISOString(),
    };
    if (message)
        response.message = message;
    if (meta)
        response.meta = meta;
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, error, statusCode = 400, details) => {
    const response = {
        success: false,
        error,
        timestamp: new Date().toISOString(),
    };
    if (details)
        response.data = details;
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
const sendCreated = (res, data, message = 'Resource created successfully') => {
    return (0, exports.sendSuccess)(res, data, message, 201);
};
exports.sendCreated = sendCreated;
const sendNoContent = (res) => {
    return res.status(204).send();
};
exports.sendNoContent = sendNoContent;
const sendNotFound = (res, resource = 'Resource') => {
    return (0, exports.sendError)(res, `${resource} not found`, 404);
};
exports.sendNotFound = sendNotFound;
const sendUnauthorized = (res, message = 'Authentication required') => {
    return (0, exports.sendError)(res, message, 401);
};
exports.sendUnauthorized = sendUnauthorized;
const sendForbidden = (res, message = 'Insufficient permissions') => {
    return (0, exports.sendError)(res, message, 403);
};
exports.sendForbidden = sendForbidden;
const sendValidationError = (res, errors) => {
    return (0, exports.sendError)(res, 'Validation failed', 400, errors);
};
exports.sendValidationError = sendValidationError;
const sendConflict = (res, message = 'Resource already exists') => {
    return (0, exports.sendError)(res, message, 409);
};
exports.sendConflict = sendConflict;
const sendServerError = (res, message = 'Internal server error') => {
    return (0, exports.sendError)(res, message, 500);
};
exports.sendServerError = sendServerError;
const sendPaginated = (res, data, page, limit, total, message) => {
    return (0, exports.sendSuccess)(res, data, message, 200, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
    });
};
exports.sendPaginated = sendPaginated;
const parsePagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.parsePagination = parsePagination;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatus[HttpStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
//# sourceMappingURL=response.js.map
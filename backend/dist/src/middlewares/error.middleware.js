"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_js_1 = require("../utils/ApiError.js");
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err instanceof ApiError_js_1.ApiError ? err.statusCode : 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err instanceof ApiError_js_1.ApiError ? err.errors : [],
    });
};
exports.errorHandler = errorHandler;

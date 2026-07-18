"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../config/logger");
const stackParser_1 = require("../utils/stackParser");
const errorHandler = (error, req, res, _next) => {
    const stack = (0, stackParser_1.parseStackTrace)(error.stack);
    const statusCode = error instanceof ApiError_1.ApiError ? error.statusCode : 500;
    logger_1.logger.error(`
==================================================
❌ ERROR
==================================================

Message   : ${error.message}

Status    : ${statusCode}

Method    : ${req.method}

Route     : ${req.originalUrl}

File      : ${stack?.file ?? "Unknown"}

Function  : ${stack?.function ?? "Unknown"}

Line      : ${stack?.line ?? "Unknown"}

Column    : ${stack?.column ?? "Unknown"}

Params    : ${JSON.stringify(req.params)}

Query     : ${JSON.stringify(req.query)}

Body      : ${JSON.stringify(req.body)}

==================================================
Stack
==================================================

${error.stack}

==================================================
`);
    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? statusCode === 500
                ? "Internal Server Error"
                : error.message
            : error.message,
    });
};
exports.errorHandler = errorHandler;

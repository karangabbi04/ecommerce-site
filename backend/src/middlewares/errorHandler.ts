import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";
import { logger } from "../config/logger";
import { parseStackTrace } from "../utils/stackParser";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const stack = parseStackTrace(error.stack);

  const statusCode =
    error instanceof ApiError ? error.statusCode : 500;

  logger.error(`
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
    message:
      process.env.NODE_ENV === "production"
        ? statusCode === 500
          ? "Internal Server Error"
          : error.message
        : error.message,
  });
};
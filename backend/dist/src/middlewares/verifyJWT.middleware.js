"use strict";
// src/middlewares/auth.middleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../lib/prisma.js");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.verifyJWT = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    console.log(req.cookies);
    if (!token) {
        throw new ApiError_1.ApiError(401, "Unauthorized request");
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await prisma_js_1.prisma.user.findUnique({
        where: {
            id: decodedToken.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new ApiError_1.ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
});
exports.optionalAuth = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    console.log(req.cookies);
    if (!token) {
        return next();
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await prisma_js_1.prisma.user.findUnique({
        where: {
            id: decodedToken.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new ApiError_1.ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const secret = process.env.JWT_ACCESS_SECRET;
const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
function generateAccessToken(payload) {
    const options = {
        expiresIn: env_1.env.jwtAccessExpiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtAccessSecret, options);
}
function generateRefreshToken(payload) {
    const options = {
        expiresIn: env_1.env.jwtRefreshExpiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtRefreshSecret, options);
}
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.env.jwtAccessSecret);
    }
    catch (err) {
        throw new Error("Invalid access token");
    }
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.env.jwtRefreshSecret);
    }
    catch (err) {
        throw new Error("Invalid refresh token");
    }
}

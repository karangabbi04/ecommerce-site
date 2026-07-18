"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.getCache = void 0;
const redis_js_1 = require("../lib/redis.js");
const getCache = async (key) => {
    const value = await redis_js_1.redisClient.get(key);
    if (!value) {
        return null;
    }
    return JSON.parse(value);
};
exports.getCache = getCache;
const setCache = async (key, value, ttlSeconds = 86400) => {
    await redis_js_1.redisClient.set(key, JSON.stringify(value), {
        EX: ttlSeconds,
    });
};
exports.setCache = setCache;

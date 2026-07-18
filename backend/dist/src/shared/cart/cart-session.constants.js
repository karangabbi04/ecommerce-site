"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUEST_ID_REGEX = exports.GUEST_CART_MAX_AGE = exports.GUEST_CART_COOKIE_NAME = void 0;
exports.GUEST_CART_COOKIE_NAME = "guest_cart_id";
exports.GUEST_CART_MAX_AGE = 1000 * 60 * 60 * 24 * 30;
exports.GUEST_ID_REGEX = /^guest_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

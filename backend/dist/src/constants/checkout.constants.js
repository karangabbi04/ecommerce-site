"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECKOUT_EXPIRY_MINUTES = exports.FREE_SHIPPING_THRESHOLD = exports.SHIPPING_CHARGE = exports.GST_RATE = void 0;
exports.GST_RATE = Number(process.env.GST_RATE ?? 18);
exports.SHIPPING_CHARGE = Number(process.env.SHIPPING_CHARGE ?? 100);
exports.FREE_SHIPPING_THRESHOLD = Number(process.env.FREE_SHIPPING_THRESHOLD ?? 1000);
exports.CHECKOUT_EXPIRY_MINUTES = Number(process.env.CHECKOUT_EXPIRY_MINUTES ?? 25);

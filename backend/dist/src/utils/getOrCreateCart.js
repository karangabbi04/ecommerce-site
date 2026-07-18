"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCart = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
const GUEST_CART_COOKIE_NAME = "guest_cart_id";
const GUEST_CART_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days
const guestCartCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: GUEST_CART_MAX_AGE,
};
const GUEST_ID_REGEX = /^guest_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const createGuestId = () => `guest_${crypto_1.default.randomUUID()}`;
const isValidGuestId = (guestId) => {
    return Boolean(guestId && GUEST_ID_REGEX.test(guestId));
};
const getOrCreateCart = async ({ userId, guestId, res, }) => {
    if (userId) {
        return prisma_1.prisma.cart.upsert({
            where: {
                userId,
            },
            update: {},
            create: {
                userId,
            },
        });
    }
    let finalGuestId = guestId;
    if (!isValidGuestId(finalGuestId)) {
        finalGuestId = createGuestId();
        res.cookie(GUEST_CART_COOKIE_NAME, finalGuestId, guestCartCookieOptions);
    }
    return prisma_1.prisma.cart.upsert({
        where: {
            guestId: finalGuestId,
        },
        update: {},
        create: {
            guestId: finalGuestId,
        },
    });
};
exports.getOrCreateCart = getOrCreateCart;

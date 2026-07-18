"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachAddressToCheckout = exports.fetchCheckoutSession = exports.createCheckoutSession = void 0;
const ApiError_1 = require("../utils/ApiError");
const prisma_1 = require("../lib/prisma");
const checkout_repository_1 = require("../repositories/checkout.repository");
const addressRepository = __importStar(require("../repositories/address.repository"));
const checkout_constants_1 = require("../constants/checkout.constants");
const checkout_utils_1 = require("../utils/checkout.utils");
const createCheckoutSession = async (input) => {
    // Validate Input
    if (!input.userId && !input.guestId) {
        throw new ApiError_1.ApiError(400, "User or Guest id is required.");
    }
    // Reuse existing active checkout
    const existingCheckout = await checkout_repository_1.checkoutRepository.findPendingCheckout(input.userId, input.guestId);
    if (existingCheckout) {
        return existingCheckout;
    }
    // Find Cart
    const cart = await checkout_repository_1.checkoutRepository.findCart(input.userId, input.guestId);
    if (!cart || cart.items.length === 0) {
        throw new ApiError_1.ApiError(400, "Cart is empty.");
    }
    let subtotal = 0;
    const checkoutItems = cart.items.map((item) => {
        const { product } = item;
        if (product.stock <= 0) {
            throw new ApiError_1.ApiError(400, `${product.name} is currently out of stock.`);
        }
        if (item.quantity > product.stock) {
            throw new ApiError_1.ApiError(400, `${product.name} has only ${product.stock} items available.`);
        }
        const itemTotal = Number(product.price) * item.quantity;
        subtotal += itemTotal;
        return {
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: product.price,
        };
    });
    const shipping = (0, checkout_utils_1.calculateShipping)(subtotal);
    const tax = (0, checkout_utils_1.calculateTax)(subtotal, checkout_constants_1.GST_RATE);
    const total = (0, checkout_utils_1.calculateTotal)(subtotal, shipping, tax);
    const session = await prisma_1.prisma.$transaction(async (tx) => {
        const checkoutSession = await checkout_repository_1.checkoutRepository.createCheckoutSession(tx, {
            userId: input.userId,
            guestId: input.guestId,
            subtotal,
            shipping,
            tax,
            total,
            expiresAt: new Date(Date.now() + checkout_constants_1.CHECKOUT_EXPIRY_MINUTES * 60 * 1000)
        });
        console.log(checkoutSession);
        await checkout_repository_1.checkoutRepository.createCheckoutItems(tx, checkoutItems.map((item) => ({
            checkoutSessionId: checkoutSession.id,
            ...item,
        })));
        const completeSession = await checkout_repository_1.checkoutRepository.findCheckoutById(tx, checkoutSession.id);
        console.log(completeSession);
        if (!completeSession) {
            throw new ApiError_1.ApiError(500, "Failed to create checkout session.");
        }
        return completeSession;
    });
    return session;
};
exports.createCheckoutSession = createCheckoutSession;
const fetchCheckoutSession = async (checkoutId) => {
    if (!checkoutId) {
        throw new ApiError_1.ApiError(400, "Checkout session id is required.");
    }
    const checkout = await checkout_repository_1.checkoutRepository.findCheckoutById(prisma_1.prisma, checkoutId);
    if (!checkout) {
        throw new ApiError_1.ApiError(404, "Checkout session not found.");
    }
    if (checkout.status === "ACTIVE" &&
        checkout.expiresAt < new Date()) {
        await prisma_1.prisma.checkoutSession.update({
            where: {
                id: checkout.id,
            },
            data: {
                status: "EXPIRED",
            },
        });
        throw new ApiError_1.ApiError(410, "Checkout session has expired.");
    }
    return checkout;
};
exports.fetchCheckoutSession = fetchCheckoutSession;
const attachAddressToCheckout = async (checkoutId, addressId, userId, guestId) => {
    const checkout = await checkout_repository_1.checkoutRepository.findCheckoutById(prisma_1.prisma, checkoutId);
    if (!checkout) {
        throw new Error("Checkout not found");
    }
    const address = await addressRepository.findById(addressId);
    if (!address) {
        throw new Error("Address not found");
    }
    console.log(address.guestId, address.userId);
    const isOwner = (userId && address.userId === userId) ||
        (guestId && address.guestId === guestId);
    console.log(isOwner, "kjalkfjakfajkj afa");
    if (!isOwner) {
        throw new Error("You are not allowed to use this address.");
    }
    return checkout_repository_1.checkoutRepository.updateAddress(checkoutId, addressId);
};
exports.attachAddressToCheckout = attachAddressToCheckout;

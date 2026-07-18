"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItemQuantity = exports.deleteCartItem = exports.getCart = exports.addToCart = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const apiResponse_1 = require("../utils/apiResponse");
const cart_validation_1 = require("../validations/cart.validation");
const cart_service_1 = require("../services/cart.service");
const cart_constants_1 = require("../constants/cart.constants");
exports.addToCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const parsedBody = cart_validation_1.addToCartSchema.safeParse(req.body);
    if (!parsedBody.success) {
        throw new ApiError_1.ApiError(400, parsedBody.error.issues[0]?.message || "Invalid cart data");
    }
    const cart = await cart_service_1.cartService.addToCart({
        dto: parsedBody.data,
        userId: req.user?.id,
        guestId: req.cookies?.guest_cart_id,
        res,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, cart, cart_constants_1.CART_MESSAGES.ITEM_ADDED));
});
exports.getCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cart = await cart_service_1.cartService.getCart({
        userId: req.user?.id,
        guestId: req.cookies?.guest_cart_id,
        res,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, cart, cart_constants_1.CART_MESSAGES.CART_FETCHED));
});
exports.deleteCartItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log(req.params);
    const itemId = Array.isArray(req.params.itemId)
        ? req.params.itemId[0]
        : req.params.itemId;
    if (!itemId) {
        throw new ApiError_1.ApiError(400, "itemId ID is required");
    }
    const cart = await cart_service_1.cartService.removeCartItem({
        itemId,
        userId: req.user?.id,
        guestId: req.cookies?.guest_cart_id,
        res,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, cart, cart_constants_1.CART_MESSAGES.ITEM_REMOVED));
});
exports.updateCartItemQuantity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const parsedBody = cart_validation_1.updateCartItemSchema.safeParse(req.body);
    if (!parsedBody.success) {
        throw new ApiError_1.ApiError(400, parsedBody.error.issues[0]?.message ||
            "Invalid request");
    }
    const productId = Array.isArray(req.params.productId)
        ? req.params.productId[0]
        : req.params.productId;
    if (!productId) {
        throw new ApiError_1.ApiError(400, "Product ID is required");
    }
    const cart = await cart_service_1.cartService.updateCartItemQuantity({
        productId,
        quantity: parsedBody.data.quantity,
        userId: req.user?.id,
        guestId: req.cookies?.guest_cart_id,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, cart, cart_constants_1.CART_MESSAGES.ITEM_UPDATED));
});

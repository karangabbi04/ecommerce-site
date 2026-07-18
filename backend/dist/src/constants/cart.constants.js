"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CART_LIMITS = exports.CART_MESSAGES = exports.CART_ERRORS = void 0;
exports.CART_ERRORS = {
    CART_NOT_FOUND: "Cart not found",
    CART_ITEM_NOT_FOUND: "Cart item not found",
    UNAUTHORIZED_CART_ITEM: "You cannot modify this cart item",
    PRODUCT_NOT_FOUND: "Product not found",
    PRODUCT_UNAVAILABLE: "Product is not available",
    INVALID_QUANTITY: "Invalid quantity",
    OUT_OF_STOCK: "Product is out of stock",
    STOCK_EXCEEDED: "Requested quantity exceeds available stock",
    CART_EMPTY: "Cart is empty",
};
exports.CART_MESSAGES = {
    ITEM_ADDED: "Product added to cart",
    CART_FETCHED: "Cart fetched successfully",
    ITEM_UPDATED: "Cart updated successfully",
    ITEM_REMOVED: "Item removed from cart",
    CART_CLEARED: "Cart cleared successfully",
};
exports.CART_LIMITS = {
    MAX_ITEM_QUANTITY: 10,
};

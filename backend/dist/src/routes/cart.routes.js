"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyJWT_middleware_1 = require("../middlewares/verifyJWT.middleware");
const cart_controller_1 = require("../controllers/cart.controller");
const router = (0, express_1.default)();
router.post("/items", verifyJWT_middleware_1.optionalAuth, cart_controller_1.addToCart);
router.get("/get-cart", verifyJWT_middleware_1.optionalAuth, cart_controller_1.getCart);
router.patch("/items/:productId", verifyJWT_middleware_1.optionalAuth, cart_controller_1.updateCartItemQuantity);
router.delete("/items/:itemId", verifyJWT_middleware_1.optionalAuth, cart_controller_1.deleteCartItem);
exports.default = router;

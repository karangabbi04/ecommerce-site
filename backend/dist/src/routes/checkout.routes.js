"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyJWT_middleware_1 = require("../middlewares/verifyJWT.middleware");
const checkout_controller_1 = require("../controllers/checkout.controller");
const router = (0, express_1.default)();
router.post("/create-session", verifyJWT_middleware_1.optionalAuth, checkout_controller_1.checkoutController);
router.get("/:checoutId", checkout_controller_1.fetchCheckoutsession);
exports.default = router;

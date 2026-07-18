"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCheckoutsession = exports.checkoutController = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const ApiError_1 = require("../utils/ApiError");
const checkout_service_1 = require("../services/checkout.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.checkoutController = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const guestId = req.cookies.guest_cart_id;
    if (!userId && !guestId) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    const session = await (0, checkout_service_1.createCheckoutSession)({ userId, guestId });
    res.status(200).json(new apiResponse_1.ApiResponse(200, session, "Checkout session created"));
});
exports.fetchCheckoutsession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const checkoutId = req.params.checoutId;
    console.log(checkoutId);
    if (typeof checkoutId !== "string") {
        throw new ApiError_1.ApiError(400, "checkoutID not provided ");
    }
    if (!checkoutId) {
        throw new ApiError_1.ApiError(400, "checkoutID not provided ");
    }
    const result = await (0, checkout_service_1.fetchCheckoutSession)(checkoutId);
    res.status(200).json(new apiResponse_1.ApiResponse(200, result, "Checkout session created"));
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const order_service_1 = require("../services/order.service");
exports.createOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    const checkoutSessionId = req.params.id;
    const userId = req.body?.userId;
    const guestId = req.body?.guestId;
    if (!checkoutSessionId ||
        Array.isArray(checkoutSessionId)) {
        throw new ApiError_1.ApiError(400, "Invalid checkout session id");
    }
    const dto = {
        checkoutSessionId,
        userId,
        guestId,
    };
    const order = await (0, order_service_1.createOrderService)(dto);
    res.status(200).json(new apiResponse_1.ApiResponse(200, order, "order  created"));
});

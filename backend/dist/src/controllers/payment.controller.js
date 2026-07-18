"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const payment_service_1 = require("../services/payment.service");
exports.verifyPayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, payment_service_1.paymentService)(req.body);
    res.status(201).json(new apiResponse_1.ApiResponse(201, result, "Address created successfully"));
});

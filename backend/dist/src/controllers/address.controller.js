"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getcurrentLocation = exports.getAddressSuggestions = exports.attachAddress = exports.getAddress = exports.createAddress = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const address_service_1 = require("../services/address.service");
const address_validation_1 = require("../validations/address.validation");
const ApiError_js_1 = require("../utils/ApiError.js");
const photon_provider_1 = require("../provider/photon.provider");
const zod_1 = __importDefault(require("zod"));
const nomination_provider_1 = require("../provider/nomination.provider");
const checkout_service_1 = require("../services/checkout.service");
exports.createAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const parsed = address_validation_1.createAddressSchema.parse(req.body);
    const userId = req.user?.id;
    const guestId = req.cookies.guest_cart_id;
    console.log(parsed);
    if (!userId && !guestId) {
        throw new ApiError_js_1.ApiError(400, "User with this email already exists");
    }
    const address = await (0, address_service_1.createAddressService)({
        userId,
        guestId,
        data: parsed,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, address, "Address created successfully"));
});
exports.getAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const parsed = address_validation_1.createAddressSchema.parse(req.body);
    const userId = req.user?.id;
    const guestId = req.cookies.guest_cart_id;
    if (!userId && !guestId) {
        throw new ApiError_js_1.ApiError(400, "User with this email already exists");
    }
    const addresses = await (0, address_service_1.getAddresses)(userId, guestId);
    res.status(201).json(new apiResponse_1.ApiResponse(201, addresses, "Address created successfully"));
});
exports.attachAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const guestId = req.cookies.guest_cart_id;
    const checkoutId = req.params.checkoutId;
    const { addressId } = req.body;
    const checkout = await (0, checkout_service_1.attachAddressToCheckout)(checkoutId, addressId, userId, guestId);
    console.log(checkout);
    res.status(201).json(new apiResponse_1.ApiResponse(201, checkout, "Address created successfully"));
});
const searchAddressSchema = zod_1.default.object({
    q: zod_1.default
        .string()
        .trim()
        .min(2, "minimum 2 characters required")
        .max(100, "query too long"),
});
exports.getAddressSuggestions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validation = searchAddressSchema.safeParse(req.query);
    if (!validation.success) {
        throw new ApiError_js_1.ApiError(400, validation.error.message);
    }
    const { q } = validation.data;
    if (q.trim().length < 3) {
        res.status(200).json(new apiResponse_1.ApiResponse(200, "enter more letters"));
    }
    const suggestions = await (0, photon_provider_1.searchAddress)(q);
    if (!suggestions) {
        throw new ApiError_js_1.ApiError(400, "some issue in suggestion");
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, suggestions, "suggestion successful"));
});
exports.getcurrentLocation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lon);
    if (!latitude && !longitude) {
        throw new ApiError_js_1.ApiError(400, "please enter lat or lon");
    }
    const result = await (0, nomination_provider_1.getLocationwithNomination)(latitude, longitude);
    if (!result) {
        throw new ApiError_js_1.ApiError(400, "some issue in suggestion");
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, result, " convert  successful"));
});

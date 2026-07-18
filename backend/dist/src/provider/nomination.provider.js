"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationwithNomination = void 0;
const axios_1 = __importDefault(require("axios"));
const getLocationwithNomination = async (latitude, longitude) => {
    const response = await axios_1.default.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
            lat: latitude,
            lon: longitude,
            format: "json",
            addressdetails: 1,
        },
        headers: {
            "User-Agent": "my-ecommerce-app",
        },
    });
    const address = response.data;
    const result = {
        displayName: address.display_name || "",
        road: address.address.road || "",
        area: address.address.suburb ||
            address.address.neighbourhood ||
            address.address.village ||
            "",
        city: address.address.city ||
            address.address.town ||
            address.address.county ||
            "",
        state: address.address.state || "",
        country: address.address.country || "",
        pincode: address.address.postcode || "",
    };
    return {
        success: true,
        data: result,
    };
};
exports.getLocationwithNomination = getLocationwithNomination;

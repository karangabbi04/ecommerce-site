"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.hashOTP = hashOTP;
exports.verifyOTP = verifyOTP;
exports.getOTPExpiryTime = getOTPExpiryTime;
const crypto_1 = __importDefault(require("crypto"));
const OTP_SECRET = process.env.OTP_SECRET || "";
if (!OTP_SECRET) {
    throw new Error("OTP_SECRET is not defined in environment variables");
}
function generateOTP(length = 6) {
    return crypto_1.default.randomInt(100000, 1000000).toString();
}
function hashOTP(otp) {
    const hash = crypto_1.default
        .createHmac("sha256", OTP_SECRET)
        .update(otp)
        .digest("hex");
    return hash;
}
function verifyOTP(otp, hashedOTP) {
    const hash = hashOTP(otp);
    return hash === hashedOTP;
}
function getOTPExpiryTime() {
    const expiresIn = process.env.OTP_EXPIRES_IN || "300"; // default to 5 minutes
    return Date.now() + parseInt(expiresIn) * 1000;
}

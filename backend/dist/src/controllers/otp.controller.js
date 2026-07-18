"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSignupOTP = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const zod_1 = require("zod");
const otp_service_1 = require("../services/otp.service");
const client_1 = require("@prisma/client");
const requestSignupOTPSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
const verifySignupOTPSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
});
exports.requestSignupOTP = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = requestSignupOTPSchema.parse(req.body);
    await otp_service_1.otpService.sendOTP({
        email: data.email,
        purpose: client_1.OtpPurpose.SIGNUP
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, "OTP sent successfully."));
});
// export const verifySignupOTP = asyncHandler(async (req: Request, res: Response) => {
//         const data = verifySignupOTPSchema.parse(req.body);
// await otpService.verifyOTP({
//     email: data.email,
//     otp: data.otp,
//     purpose: OtpPurpose.SIGNUP,
// });
//  res.status(200).json(
//     new ApiResponse(
//         200,
//         null,
//         "OTP verified successfully."
//     )
// );
// })

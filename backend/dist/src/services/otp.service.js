"use strict";
// src/modules/otp/otp.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = void 0;
const otp_repository_1 = require("../repositories/otp.repository");
const email_1 = require("../lib/email");
const otp_1 = require("../utils/otp");
const otp_constants_1 = require("../constants/otp.constants");
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
class OTPService {
    async sendOTP({ email, purpose }) {
        const normalizedEmail = email.trim().toLowerCase();
        // 1. Rate Limit
        const recentOTP = await otp_repository_1.otpRepository.findRecentOTP(prisma_1.prisma, normalizedEmail, purpose, new Date(Date.now() - otp_constants_1.OTP_REQUEST_INTERVAL));
        if (recentOTP) {
            throw new ApiError_1.ApiError(429, "OTP already sent. Please wait before requesting a new one.");
        }
        // 2. Generate OTP
        const otp = (0, otp_1.generateOTP)();
        const otpHash = (0, otp_1.hashOTP)(otp);
        const expiresMinutes = Number(process.env.OTP_EXPIRES_IN ?? 10);
        const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
        // 3. Delete old OTP + Create new OTP
        await prisma_1.prisma.$transaction(async (tx) => {
            await otp_repository_1.otpRepository.deleteOTPByEmail(tx, normalizedEmail, purpose);
            await otp_repository_1.otpRepository.createOTP(tx, {
                email: normalizedEmail,
                otpHash,
                purpose,
                expiresAt,
            });
        });
        // 4. Send Email
        try {
            await (0, email_1.sendOTPEmail)({
                to: normalizedEmail,
                otp,
                purpose,
            });
        }
        catch (error) {
            await otp_repository_1.otpRepository.deleteOTPByEmail(prisma_1.prisma, normalizedEmail, purpose);
            throw new ApiError_1.ApiError(500, "Failed to send OTP. Please try again.");
        }
        return;
    }
    async verifyOTP({ email, otp, purpose }) {
        const normalizedEmail = email.trim().toLowerCase();
        const existingOTP = await otp_repository_1.otpRepository.findLatestOTP(prisma_1.prisma, normalizedEmail, purpose);
        if (!existingOTP) {
            throw new ApiError_1.ApiError(400, "Invalid or expired OTP.");
        }
        if (existingOTP.expiresAt < new Date()) {
            await otp_repository_1.otpRepository.deleteOTPById(prisma_1.prisma, existingOTP.id);
            throw new ApiError_1.ApiError(400, "OTP has expired.");
        }
        if (existingOTP.attempts >=
            existingOTP.maxAttempts) {
            await otp_repository_1.otpRepository.deleteOTPById(prisma_1.prisma, existingOTP.id);
            throw new ApiError_1.ApiError(400, "Maximum OTP attempts exceeded.");
        }
        // const isValid = verifyOTP(
        //       otp,
        //       existingOTP.otpHash
        //   );
        //         if (!isValid) {
        //           await otpRepository.incrementAttempts(
        //               existingOTP.id
        //           );
        //           throw new ApiError(
        //               400,
        //               "Invalid OTP."
        //           );
        //       }
        //     await otpRepository.deleteOTPById(
        //       prisma,
        //       existingOTP.id
        //   );
        return existingOTP;
    }
}
exports.otpService = new OTPService();

// src/modules/otp/otp.service.ts

import { otpRepository } from "../repositories/otp.repository.js";
import { SendOTPInput, VerifyOTPInput } from "../types/otp.types.js";
import { sendOTPEmail } from "../lib/email.js";
import { generateOTP, hashOTP, verifyOTP } from "../utils/otp.js";
import { OTP_REQUEST_INTERVAL } from "../constants/otp.constants.js";
import { prisma } from "../lib/prisma.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";


class OTPService {

async sendOTP({ email, purpose }: SendOTPInput) {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Rate Limit
  const recentOTP = await otpRepository.findRecentOTP(
    prisma,
    normalizedEmail,
    purpose,
    new Date(Date.now() - OTP_REQUEST_INTERVAL)
  );

  if (recentOTP) {
    throw new ApiError(
      429,
      "OTP already sent. Please wait before requesting a new one."
    );
  }

  // 2. Generate OTP
  const otp = generateOTP();
  const otpHash = hashOTP(otp);

  const expiresMinutes = Number(process.env.OTP_EXPIRES_IN ?? 10);

  const expiresAt = new Date(
    Date.now() + expiresMinutes * 60 * 1000
  );

  // 3. Delete old OTP + Create new OTP
  await prisma.$transaction(async (tx) => {

    await otpRepository.deleteOTPByEmail(
      tx,
      normalizedEmail,
      purpose
    );

    await otpRepository.createOTP(
      tx,
      {
        email: normalizedEmail,
        otpHash,
        purpose,
        expiresAt,
      }
    );

  });

  // 4. Send Email
  try {

    await sendOTPEmail({
      to: normalizedEmail,
      otp,
      purpose,
    });

  } catch (error) {

    await otpRepository.deleteOTPByEmail(
      prisma,
      normalizedEmail,
      purpose
    );

    throw new ApiError(
      500,
      "Failed to send OTP. Please try again."
    );

  }

  return;
}

  async verifyOTP({email,otp,purpose}:VerifyOTPInput) {

    const normalizedEmail = email.trim().toLowerCase();

    const existingOTP = await otpRepository.findLatestOTP(
        prisma,
        normalizedEmail,
        purpose
    );  
      if (!existingOTP) {
    throw new ApiError(
        400,
        "Invalid or expired OTP."
    );
      }

        if (existingOTP.expiresAt < new Date()) {

    await otpRepository.deleteOTPById(
        prisma,
        existingOTP.id
    );

    throw new ApiError(
        400,
        "OTP has expired."
    );
    }

        if (
            existingOTP.attempts >=
            existingOTP.maxAttempts
        ) {

            await otpRepository.deleteOTPById(
                prisma,
                existingOTP.id
            );

            throw new ApiError(
                400,
                "Maximum OTP attempts exceeded."
            );

        }

        const isValid = verifyOTP(
              otp,
              existingOTP.otpHash
          );

                if (!isValid) {

                  await otpRepository.incrementAttempts(
                      existingOTP.id
                  );

                  throw new ApiError(
                      400,
                      "Invalid OTP."
                  );

              }

            await otpRepository.deleteOTPById(
              prisma,
              existingOTP.id
          );

      return  existingOTP;

        
  }
}

export const otpService = new OTPService();
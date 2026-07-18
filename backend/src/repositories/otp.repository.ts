// src/modules/otp/otp.repository.ts

import { Prisma, PrismaClient } from "@prisma/client";
import { OtpPurpose } from "../constants/otp.constants.js";
import { prisma } from "../lib/prisma.js";


class OTPRepository {
  async findLatestOTP( db:PrismaClient | Prisma.TransactionClient,email: string, purpose: OtpPurpose) {
    return db.emailOTP.findFirst({
      where: {
        email,
        purpose,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findRecentOTP(db:PrismaClient | Prisma.TransactionClient,
    email: string,
    purpose: OtpPurpose,
    after: Date
  ) {
    return db.emailOTP.findFirst({
      where: {
        email,
        purpose,
        createdAt: {
          gt: after,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createOTP(db:PrismaClient | Prisma.TransactionClient,data: {
    email: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }) {
    return db.emailOTP.create({
      data,
    });
  }

  async deleteOTPById(db:PrismaClient | Prisma.TransactionClient,id: string) {
    return db.emailOTP.delete({
      where: {
        id,
      },
    });
  }

  async deleteOTPByEmail(db:PrismaClient | Prisma.TransactionClient ,
    email: string,
    purpose: OtpPurpose
  ) {
    return db.emailOTP.deleteMany({
      where: {
        email,
        purpose,
      },
    });
  }

  async incrementAttempts(id: string) {
    return prisma.emailOTP.update({
      where: {
        id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  async markVerified(id: string) {
    return prisma.emailOTP.update({
      where: {
        id,
      },
      data: {
        verified: true,
        varifiedAt: new Date(),
      },
    });
  }
}

export const otpRepository = new OTPRepository();
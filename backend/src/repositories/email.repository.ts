import { prisma } from "../lib/prisma.js";

class EmailOTPRepository {
  async findVerifiedSignupOTP(email: string) {
    return prisma.emailOTP.findFirst({
      where: {
        email,
        purpose: "SIGNUP",
        verified: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deleteSignupOTPs(email: string) {
    return prisma.emailOTP.deleteMany({
      where: {
        email,
        purpose: "SIGNUP",
      },
    });
  }
}

export const emailOTPRepository = new EmailOTPRepository();
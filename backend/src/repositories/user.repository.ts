import { prisma } from "../lib/prisma.js";
import { Prisma, PrismaClient } from "@prisma/client";

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

class UserRepository {
  async findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: userSelect,
    });
  }

  async findRefreshTokenByUserId(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        refreshToken: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create( db:PrismaClient | Prisma.TransactionClient,data: {
    name: string;
    email: string;
    password: string;
  }) {
    return db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        emailVerified: true,
        refreshToken: "",
      },
      select: userSelect,
    });
  }

  async updateRefreshToken(
    db: PrismaClient | Prisma.TransactionClient,
    userId: string,
    refreshToken: string
  ) {
    return db.user.update({
      where: { id: userId },
      data: { refreshToken },
      select: userSelect,
    });
  }

  async clearRefreshToken(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: "" },
      select: userSelect,
    });
  }

  async createDuringCheckout(data: {
    name: string;
    email: string;
    phone: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        emailVerified: false,
        refreshToken: "",
      },
      select: userSelect,
    });
  }

  async deleteSignupOtp(db:PrismaClient | Prisma.TransactionClient,email: string) {
    return db.emailOTP.deleteMany({
      where: {
        email,
        purpose: "SIGNUP",
      },
    });
  }
}

export const userRepository = new UserRepository();
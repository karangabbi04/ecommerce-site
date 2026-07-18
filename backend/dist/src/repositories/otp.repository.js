"use strict";
// src/modules/otp/otp.repository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRepository = void 0;
const prisma_1 = require("../lib/prisma");
class OTPRepository {
    async findLatestOTP(db, email, purpose) {
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
    async findRecentOTP(db, email, purpose, after) {
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
    async createOTP(db, data) {
        return db.emailOTP.create({
            data,
        });
    }
    async deleteOTPById(db, id) {
        return db.emailOTP.delete({
            where: {
                id,
            },
        });
    }
    async deleteOTPByEmail(db, email, purpose) {
        return db.emailOTP.deleteMany({
            where: {
                email,
                purpose,
            },
        });
    }
    async incrementAttempts(id) {
        return prisma_1.prisma.emailOTP.update({
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
    async markVerified(id) {
        return prisma_1.prisma.emailOTP.update({
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
exports.otpRepository = new OTPRepository();

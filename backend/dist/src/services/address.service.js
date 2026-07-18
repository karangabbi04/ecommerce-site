"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddressService = createAddressService;
exports.getAddresses = getAddresses;
const client_1 = require("@prisma/client");
const addressRepository = __importStar(require("../repositories/address.repository"));
const otp_service_1 = require("./otp.service");
const prisma_1 = require("../lib/prisma");
const otp_repository_1 = require("../repositories/otp.repository");
const DEFAULT_COUNTRY = "India";
function getOwner(userId, guestId) {
    if (userId) {
        return {
            userId,
            guestId: null,
        };
    }
    if (guestId) {
        return {
            userId: null,
            guestId,
        };
    }
    throw new Error("Unauthorized");
}
async function createAddressService(params) {
    const { userId, guestId, data } = params;
    const owner = getOwner(userId, guestId);
    console.log(owner);
    const otpRecord = await otp_service_1.otpService.verifyOTP({
        email: data.email,
        otp: data.otp,
        purpose: client_1.OtpPurpose.SIGNUP,
    });
    console.log(otpRecord, "otep recodfldjaj lklkdsjflk sj kljfklsd ");
    console.log(otpRecord.id, "otep recodfldjaj lklkdsjflk sj kljfklsd ");
    return prisma_1.prisma.$transaction(async (tx) => {
        const address = await addressRepository.create(tx, {
            fullName: data.fullName,
            guestId: guestId,
            user: userId ? { connect: { id: userId } } : undefined,
            phone: data.phone,
            email: data.email,
            addressLine1: data.addressLine1,
            landmark: data.landmark,
            city: data.city,
            state: data.state,
            country: DEFAULT_COUNTRY,
            postalCode: data.pincode,
            latitude: data.latitude,
            longitude: data.longitude,
        });
        await otp_repository_1.otpRepository.deleteOTPById(tx, otpRecord?.id);
        return address;
    });
}
async function getAddresses(userId, guestId) {
    if (userId) {
        return addressRepository.findManyByUserId(userId);
    }
    if (guestId) {
        return addressRepository.findManyByGuestId(guestId);
    }
    throw new Error("Unauthorized");
}

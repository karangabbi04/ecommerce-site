"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddressSchema = void 0;
const zod_1 = require("zod");
exports.createAddressSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(2)
        .max(100),
    phone: zod_1.z
        .string()
        .regex(/^[0-9]{10}$/),
    addressLine1: zod_1.z
        .string()
        .min(5),
    landmark: zod_1.z
        .string()
        .optional(),
    city: zod_1.z
        .string()
        .min(2),
    state: zod_1.z
        .string()
        .min(2),
    pincode: zod_1.z
        .string()
        .regex(/^[0-9]{6}$/),
    latitude: zod_1.z
        .number()
        .optional(),
    longitude: zod_1.z
        .number()
        .optional(),
    email: zod_1.z
        .email("please enter a valid email address"),
    otp: zod_1.z
        .string()
        .max(6)
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const password_1 = require("../utils/password");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const token_1 = require("../utils/token");
const prisma_js_1 = require("../lib/prisma.js");
const zod_1 = __importDefault(require("zod"));
const signUpSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    email: zod_1.default.string().email("Invalid email address"),
    password: zod_1.default.string().min(8, "Password must be at least 8 characters long"),
});
const registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = signUpSchema.parse(req.body);
    const { name, email, password } = validatedData;
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma_js_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
        throw new ApiError_1.ApiError(400, "User with this email already exists");
    }
    //// check otp is verified or not
    const verifiedOTP = await prisma_js_1.prisma.emailOTP.findFirst({
        where: {
            email: normalizedEmail,
            purpose: "SIGNUP",
            verified: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!verifiedOTP) {
        throw new ApiError_1.ApiError(400, "Email not verified. Please verify your email before registering");
    }
    const hashedPassword = await (0, password_1.hashPassword)(password);
    const newUser = await prisma_js_1.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            emailVerified: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            createdAt: true,
        },
    });
    await prisma_js_1.prisma.emailOTP.deleteMany({
        where: {
            email: normalizedEmail,
            purpose: "SIGNUP",
        },
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, newUser, "User registered successfully"));
});
exports.registerUser = registerUser;
const loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_js_1.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
        throw new ApiError_1.ApiError(400, "Invalid email or password");
    }
    const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(400, "Invalid   password");
    }
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
    };
    const accessToken = (0, token_1.generateAccessToken)({ userId: user.id, email: user.email });
    const refreshToken = (0, token_1.generateRefreshToken)({ userId: user.id, email: user.email });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.status(200).
        json(new apiResponse_1.ApiResponse(200, { user: userData }, "User logged in successfully"));
});
exports.loginUser = loginUser;
const getCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        throw new ApiError_1.ApiError(401, "unauthorized request");
    }
    const user = await prisma_js_1.prisma.user.findUnique({
        where: {
            id: req.user?.id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    if (!user) {
        throw new ApiError_1.ApiError(404, "user not found");
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, { user }, "currunt user fetched succesulf"));
});
exports.getCurrentUser = getCurrentUser;
const registerDuringCheckoutSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    email: zod_1.default.string().email("Invalid email address"),
    phone: zod_1.default.string().min(10, "plese ender a valid phone number"),
});
const registerDuringCheckout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validateData = registerDuringCheckoutSchema.safeParse(req.body);
    if (!validateData.success) {
        const errors = validateData.error.issues.map((err) => err.message);
        throw new ApiError_1.ApiError(400, "validation error", errors);
    }
    const { name, email, phone } = req.body;
    const existingUser = await prisma_js_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new ApiError_1.ApiError(400, "User with this email already exists");
    }
    const newUser = await prisma_js_1.prisma.user.create({
        data: {
            name,
            email,
            phone,
            emailVerified: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            emailVerified: true,
            createdAt: true,
        },
    });
    console.log("New user created during checkout:", newUser);
    res.status(201).json(new apiResponse_1.ApiResponse(201, newUser, "User registered successfully during checkout"));
});

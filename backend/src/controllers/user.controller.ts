
import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { hashPassword, comparePassword } from "../utils/password";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { prisma } from "../lib/prisma.js";
import z from "zod";
import { ImportFileOperation } from "@google/genai";
import tr from "zod/v4/locales/tr.js";


    const signUpSchema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters long"),
    });


const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique(
    { where: { email } });

    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
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
    console.log("New user created:", newUser);
    return res.status(201).json(new ApiResponse(201, newUser, "User registered successfully")); 



});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid   password");
  }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

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


  return res.status(200).
  json(new ApiResponse(200, { user: userData }, "User logged in successfully"));


});

export { registerUser, loginUser };
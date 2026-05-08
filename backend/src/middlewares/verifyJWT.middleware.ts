// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction, response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

type JwtPayload = {
  userId: string;
  email?: string;
};

export const verifyJWT = asyncHandler(
  
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

      console.log(req.cookies)

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET 
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  }
);


 export const optionalAuth = asyncHandler (async (req: Request, res: Response, next: NextFunction)=>{

  const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

      console.log(req.cookies)

    if (!token) {
      return next();
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET 
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();



});

import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken"; // TokenExpiredError import karein
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

type JwtPayload = {
  userId: string;
  email?: string;
  role?: string;
};

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    try {
      // 🔥 YEH TRY-CATCH BLOCK ADD KIYA HAI 🔥
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
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
        throw new ApiError(401, "Invalid access token: User not found");
      }

      req.user = user;
      next();
      
    } catch (error: any) {
      // Agar token expire ho gaya hai, toh 500 ki jagah 401 bhejo
      if (error.name === "TokenExpiredError" || error instanceof TokenExpiredError) {
        throw new ApiError(401, "Unauthorized: Token has expired");
      }
      
      // Baaki koi bhi jwt error (jaise invalid signature)
      throw new ApiError(401, "Unauthorized: Invalid access token");
    }
  }
);

export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(); // Token nahi hai, guest ki tarah aage badhao
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      if (user) {
        req.user = user; // Agar user mil gaya toh attach kar do
      }
      
      next(); // Token valid ho ya user na mile, chup chap aage badhao
      
    } catch (error: any) {
      // 🔥 IMPORTANT: Optional auth mein expired/invalid token par ERROR THROW NAHI KARNA 🔥
      // Bas console mein log kar do aur next() kar do taaki user guest ki tarah use kar sake
      console.log("Optional Auth: Invalid or Expired Token, proceeding as guest");
      next();
    }
  }
);
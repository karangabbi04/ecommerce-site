
import { Request, Response, urlencoded } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { prisma } from "../lib/prisma.js";
import z from "zod";



    const signUpSchema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters long"),
    });


const registerUser = asyncHandler(async (req: Request, res: Response) => {
  
  const validatedData = signUpSchema.parse(req.body);

const { name, email, password } = validatedData;


const normalizedEmail = email.toLowerCase().trim();


  const existingUser = await prisma.user.findUnique(
    { where: { email:normalizedEmail } });

    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }


//// check otp is verified or not

const verifiedOTP =
 await prisma.emailOTP.findFirst({
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
  throw new ApiError(400, "Email not verified. Please verify your email before registering");
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

    await prisma.emailOTP.deleteMany({
   where: {
      email: normalizedEmail,
      purpose: "SIGNUP",
   },
});

     res.status(201).json(new ApiResponse(201, newUser, "User registered successfully")); 



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


   res.status(200).
  json(new ApiResponse(200, { user: userData }, "User logged in successfully"));


});

const  getCurrentUser  = asyncHandler( async (req: Request, res: Response) => {

   if(!req.user?.id){
    throw new ApiError(401,"unauthorized request")
   }

   const user = await prisma.user.findUnique({
    where:{
      id:req.user?.id,
    },
    select:{
      id:true,
      name:true,
      email:true,
      role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
    }
   })
   if(!user){
    throw new ApiError(404,"user not found");
   }

    res.status(200).json(
    new ApiResponse(200,{user},"currunt user fetched succesulf")
   )

});


  const registerDuringCheckoutSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "plese ender a valid phone number"),
  });

const registerDuringCheckout = asyncHandler(async (req: Request, res: Response) => {

  const validateData = registerDuringCheckoutSchema.safeParse(req.body);
  
  if(!validateData.success){
    const errors = validateData.error.issues.map((err: any) => err.message);
    throw new ApiError(400,"validation error",errors);
  }

  const { name, email, phone } = req.body;

  const existingUser = await prisma.user.findUnique(
    { where: { email } });

    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    const newUser = await prisma.user.create({
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
     res.status(201).json(new ApiResponse(201, newUser, "User registered successfully during checkout"));

 



});

export { registerUser, loginUser ,getCurrentUser };
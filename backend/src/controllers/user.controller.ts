
import { Request, Response,  } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { prisma } from "../lib/prisma.js";
import z from "zod";
import { loginService, registerStart, verifyLogin, verifyRegistrationOTP } from "../services/user.service.js";
import { registerUserSchema, userOtpValidSchema } from "../validations/user.validation.js";





const registerUser = asyncHandler(async (req: Request, res: Response) => {

  const parsed = registerUserSchema.parse(req.body)


     const responce = await registerStart(parsed)

      res.status(201).json(
      new ApiResponse(201, responce, "user  created successfully in redis")
    );



});

export const verifyUserUsingOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = userOtpValidSchema.parse(req.body);

  const {user,refreshToken,accessToken} = await verifyRegistrationOTP(email, otp);

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

  res.status(200).json(new ApiResponse(200, user, "OTP verified successfully"));

   

});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

    const user = await loginService(email,password)

   res.status(200).
  json(new ApiResponse(200, {user}, "User logged in successfully"));


});



export const loginotpverify = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = userOtpValidSchema.parse(req.body);

  const {user,refreshToken,accessToken} = await verifyLogin(email, otp);

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

  res.status(200).json(new ApiResponse(200, user, "OTP verified successfully"));

   

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
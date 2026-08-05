import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { paymentService ,handlePaymentWebhook} from "../services/payment.service.js";
import { verifyRazorpayWebhook } from "../utils/payment.webhook.js";




export const verifyPayment = asyncHandler( async (req:Request, res:Response)=>{


     const result =
            await paymentService(
            req.body
            );

             res.status(201).json(
      new ApiResponse(201, result, "Address created successfully")
    );

})

export const webhook = asyncHandler(async (req: Request, res: Response) => {


  try {


       console.log(
"🔥 WEBHOOK HIT"
);


console.log(
"HEADERS",
req.headers
);


console.log(
"BODY",
req.body.toString()
);
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      throw new ApiError(400, "Missing signature header");
    }

    const isValid = verifyRazorpayWebhook(req.body, signature);

    if (!isValid) {
     throw new ApiError(400, "Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    await handlePaymentWebhook(event);

    console.log("Webhook processed successfully");
     res.status(201).json(
      new ApiResponse(201, "webhook verify  successfully"))
  } catch (error) {
    console.error("Webhook Error", error);
   throw new ApiError(400, "Webhook verification failed");
  }
});


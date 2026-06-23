import { Request,Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrderService , CreateOrderDto } from "../services/order.service";



export const createOrder = asyncHandler(async (req: Request, res: Response) => {

  console.log(req.params)
  console.log(req.body)
  console.log(req.query)

  const  checkoutSessionId = req.params.id;

  const  userId = req.body?.userId
  const  guestId = req.body?.guestId





if (
  !checkoutSessionId ||
  Array.isArray(checkoutSessionId)
) {
  throw new ApiError(400,"Invalid checkout session id");
}

  const dto: CreateOrderDto ={

    checkoutSessionId,
    userId,
    guestId,
  }

    

    const order = await createOrderService(dto);

   return  res.status(200).json(new ApiResponse( 200,order,"order  created"));
});
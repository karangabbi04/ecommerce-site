import { Request,Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrderService , CreateOrderDto,getOrderDetailsByRazorpayId, updateOrderStatus,getFilteredOrders } from "../services/order.service.js";
import { UpdateOrderStatusRequest } from "../types/order.types.js";



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


     res.status(200).json(new ApiResponse( 200,order,"order  created"));
});



export const updateStatus = asyncHandler(async (req: Request, res: Response) => {

  const id = req.params.id ?? req.body?.orderId ?? req.body?.id;

  if (typeof id !== "string" || !id.trim()) {
    throw new ApiError(400, "Invalid order id");
  }

  const payload: UpdateOrderStatusRequest = req.body;

  if (!payload?.status) {
    throw new ApiError(400, "Status is required");
  }

  const order = await updateOrderStatus(id.trim(), payload);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});



export const orderQuery = asyncHandler(async (req: Request, res: Response) => {

     const { status, dateType, startDate, endDate,} = req.query;

      const pageStr = req.query.page as string | undefined;
        const limitStr = req.query.limit as string | undefined;

        // 2. Ab unhe safely number me convert karo
        const page = pageStr ? parseInt(pageStr, 10) : 1;
        const limit = limitStr ? parseInt(limitStr, 10) : 10;

        const result = await getFilteredOrders({
            status,
            dateType,
            startDate,
            endDate,
            page,
            limit
        });

        if (!result) {
            throw new ApiError(404, "No orders found");
        }

        res.status(200).json(new ApiResponse(200, result, "Orders fetched successfully"));


})



export const getOrderByRazorpayOrderId = asyncHandler(async (req: Request, res: Response) => {

  console.log(req.params)


  const RazorId = req.params.RazorId;
  console.log("RazorId", RazorId);

  if (!RazorId || Array.isArray(RazorId)) {
    throw new ApiError(400, "Invalid Razorpay order id");
  }

  const order = await getOrderDetailsByRazorpayId(RazorId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
})
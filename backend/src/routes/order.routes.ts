import { Router } from "express";
import { createOrder, updateStatus,orderQuery,getOrderByRazorpayOrderId,getMyOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();


router.post("/updateOrderStatus",updateStatus)
router.get("/my-orders",verifyJWT,getMyOrders)
router.post("/:id",createOrder)
router.get("/:RazorId",getOrderByRazorpayOrderId)


export default router;

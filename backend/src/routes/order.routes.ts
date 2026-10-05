import { Router } from "express";
import { createOrder, updateStatus,orderQuery,getOrderByRazorpayOrderId } from "../controllers/order.controller.js";

const router = Router();


router.post("/updateOrderStatus",updateStatus)
router.post("/:id",createOrder)
router.get("/:RazorId",getOrderByRazorpayOrderId)


export default router;

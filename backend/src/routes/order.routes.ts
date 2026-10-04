import { Router } from "express";
import { createOrder, updateStatus,orderQuery } from "../controllers/order.controller.js";

const router = Router();


router.post("/updateOrderStatus",updateStatus)
router.post("/:id",createOrder)


export default router;

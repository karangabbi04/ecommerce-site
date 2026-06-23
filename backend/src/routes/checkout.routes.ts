import Router from "express";
import { optionalAuth } from "../middlewares/verifyJWT.middleware";
import { checkoutController } from "../controllers/checkout.controller";
import { razorpay } from "../config/razorpay";
import { createOrder } from "../controllers/order.controller";


const router = Router();

router.post("/create-session",optionalAuth,checkoutController)

router.post("/:id",createOrder)



export default router;

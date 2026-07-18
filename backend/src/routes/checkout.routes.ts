import Router from "express";
import { optionalAuth } from "../middlewares/verifyJWT.middleware.js";
import { checkoutController, fetchCheckoutsession } from "../controllers/checkout.controller.js";
import { razorpay } from "../config/razorpay.js";



const router = Router();

router.post("/create-session",optionalAuth,checkoutController)



router.get("/:checoutId",fetchCheckoutsession)





export default router;

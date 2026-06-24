import Router from "express";
import { optionalAuth } from "../middlewares/verifyJWT.middleware";
import { checkoutController, fetchCheckoutsession } from "../controllers/checkout.controller";
import { razorpay } from "../config/razorpay";



const router = Router();

router.post("/create-session",optionalAuth,checkoutController)



router.get("/:checoutId",fetchCheckoutsession)





export default router;

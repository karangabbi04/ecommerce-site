import Router from "express";
import { optionalAuth } from "../middlewares/verifyJWT.middleware";
import { checkoutController } from "../controllers/checkout.controller";



const router = Router();

router.post("/create-session",optionalAuth,checkoutController)

export default router;

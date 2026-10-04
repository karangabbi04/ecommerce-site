import { Router } from "express";
import { createcoupon, applyCoupon, removeCoupon } from "../controllers/coupon.controller";

const router = Router()

router.post("/create",createcoupon)
router.post("/:checkoutId/coupon",applyCoupon)
router.delete("/:checkoutId/coupon",removeCoupon)

export default router
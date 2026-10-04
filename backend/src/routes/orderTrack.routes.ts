import { Router } from "express";
import { orderTrack } from "../controllers/OrderTracking.controller";


const router = Router()

router.post("/track-order",orderTrack)


export default router;

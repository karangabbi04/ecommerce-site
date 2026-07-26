import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { verifyJWT } from "../middlewares/verifyJWT.middleware";
const router =Router()

router.post("/login",adminController.adminLogin)

router.post("/verify",adminController.adminVerify)
router.get("/orders",verifyJWT,adminController.orderInfo)


export default router
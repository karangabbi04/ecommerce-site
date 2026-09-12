import { Router } from "express";
import { adminController } from "../controllers/Analytics.controller";
import { verifyJWT } from "../middlewares/verifyJWT.middleware";
import { createCategory,deleteCategory } from "../controllers/category.controller";
const router =Router()

router.post("/login",adminController.adminLogin)

router.post("/verify",adminController.adminVerify)
router.get("/orders",adminController.orderInfo)
router.get("/revenue",adminController.revenueDetail)

router.post("/add-category",createCategory)
router.delete("/categories/:id",deleteCategory);



export default router
import { Router } from "express";
import { adminController } from "../controllers/Analytics.controller";
import { verifyJWT } from "../middlewares/verifyJWT.middleware";
import { createCategory,deleteCategory } from "../controllers/category.controller";
import {getallproductsforadmin} from "../controllers/product.controller";
import { orderQuery } from "../controllers/order.controller";
const router =Router()

router.post("/login",adminController.adminLogin)

router.post("/verify",adminController.adminVerify)
router.get("/orders-count",adminController.orderInfo) // for order count via status and total
router.get("/orders/all",adminController.allOrders)
router.get("/revenue",adminController.revenueDetail)

router.post("/add-category",createCategory)
router.delete("/categories/:id",deleteCategory);
router.get("/products",getallproductsforadmin);

router.get("/order-query",orderQuery)




export default router
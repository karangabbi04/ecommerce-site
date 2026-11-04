import { Router } from "express";
import { adminController } from "../controllers/Analytics.controller";
import { verifyJWT } from "../middlewares/verifyJWT.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { createCategory, deleteCategory, getAdminCategories, updateCategory } from "../controllers/category.controller";
import {getallproductsforadmin, updateProductStatus,updateProductPrice,getProductPriceHistory} from "../controllers/product.controller";
import { orderQuery } from "../controllers/order.controller";
const router =Router()

router.post("/login",adminController.adminLogin)

router.post("/verify",adminController.adminVerify)
router.get("/orders-count",verifyJWT,authorize("ADMIN"),adminController.orderInfo) // for order count via status and total
router.get("/orders/all",verifyJWT,authorize("ADMIN"),adminController.allOrders)
router.get("/revenue",verifyJWT,authorize("ADMIN"),adminController.revenueDetail)

router.post("/add-category",verifyJWT,authorize("ADMIN"),createCategory)
router.get("/categories",getAdminCategories);
router.patch("/categories/:id",verifyJWT,authorize("ADMIN"),updateCategory);
router.delete("/categories/:id",verifyJWT,authorize("ADMIN"),deleteCategory);
router.get("/products",verifyJWT,authorize("ADMIN"),getallproductsforadmin);
router.patch("/products/:id/status",verifyJWT,authorize("ADMIN"), updateProductStatus);
router.patch("/products/:id/price",verifyJWT,authorize("ADMIN"), updateProductPrice);
router.get("/products/:id/history",verifyJWT,authorize("ADMIN"), getProductPriceHistory);

router.get("/order-query",verifyJWT,authorize("ADMIN"),orderQuery)




export default router
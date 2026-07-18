import { Router } from "express";
import { createProduct, getProductById, deleteProduct, getAllProducts, getProductBySlug } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/add-product", upload.array("images", 5), createProduct);
    
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProduct);
router.get("/products", getAllProducts);
router.get("/products/slug/:slug", getProductBySlug);
export default router;
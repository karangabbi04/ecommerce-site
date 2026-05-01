import { Router } from "express";
import { createProduct, getProductById, deleteProduct, getallProducts, getProductBySlug } from "../controllers/product.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post("/add-product", upload.array("images", 5), createProduct);
    
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProduct);
router.get("/products", getallProducts);
router.get("/products/slug/:slug", getProductBySlug);
export default router;
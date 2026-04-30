import { Router } from "express";
import { createProduct, getProductById, deleteProduct, getallProducts } from "../controllers/product.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post("/add-product", upload.array("images", 5), createProduct);
    
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProduct);
router.get("/products", getallProducts);
export default router;
import { Router } from "express";
import { createProduct, getProductById, deleteProduct, getallProducts } from "../controllers/product.controller";

const router = Router();
router.post("/add-product", createProduct);
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProduct);
router.get("/products", getallProducts);
export default router;
import { Router } from "express";
import { createProduct } from "../controllers/product.controller";

const router = Router();
router.post("/products", createProduct);

export default router;
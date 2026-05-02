import { Router } from "express";
import { generateProductDescription } from "../controllers/ai.controller.js";

const router = Router();

router.post("/generate-product-description", generateProductDescription);

export default router;
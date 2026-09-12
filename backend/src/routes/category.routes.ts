import { Router } from "express";
import {getAllCategories,deleteCategory } from "../controllers/category.controller.js";

const router = Router();

router.get("/categories", getAllCategories);
router.delete("/:id",deleteCategory);

export default router;

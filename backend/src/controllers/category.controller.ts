import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../lib/prisma.js";


const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const categoryName = String(name ?? "").trim();

    if (!categoryName) {
        throw new ApiError(400, "Category name is required");
    }

    const category = await prisma.category.create({
        data: {
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
        },
    });

    res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

    const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
        const categories = await prisma.category.findMany();

        res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
    });

    const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;

        if (!id) {
            throw new ApiError(400, "Category id is required");
        }

        const category = await prisma.category.delete({
            where: {
                id,
            },
        });

        res.status(200).json(new ApiResponse(200, category, "Category deleted successfully"));
    });

export  {
    createCategory,
    getAllCategories,
    deleteCategory,
};
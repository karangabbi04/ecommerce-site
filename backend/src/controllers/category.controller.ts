import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../lib/prisma.js";
import {
    createCategory as createCategoryService,
    deleteCategory as deleteCategoryService,
    getAdminCategories as getAdminCategoriesService,
    updateCategory as updateCategoryService,
} from "../services/category.service.js";


const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const adminData = req.user; 
    const categoryName = String(name ?? "").trim();
    if (!categoryName) {
        throw new ApiError(400, "Category name is required");
    }

    if (!adminData) {
        throw new ApiError(401, "Unauthorized request");
    }

    const category = await createCategoryService(
        {
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
        },
        adminData,
        {
            ipAddress: req.ip ?? "",
            userAgent: req.get("user-agent") ?? "",
        },
    );

    res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

    const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
        const categories = await prisma.category.findMany();

        res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
    });

    const getAdminCategories = asyncHandler(async (_req: Request, res: Response) => {
        const categories = await getAdminCategoriesService();

        res.status(200).json(new ApiResponse(200, categories, "Admin categories fetched successfully"));
    });

        const updateCategory = asyncHandler(async (req: Request, res: Response) => {
            const rawId = req.params.id;
            const id = Array.isArray(rawId) ? rawId[0] : rawId;
            const adminData = req.user;
            const categoryName = String(req.body.name ?? "").trim();

            if (!id) {
                throw new ApiError(400, "Category id is required");
            }
            if (!categoryName) {
                throw new ApiError(400, "Category name is required");
            }
            if (!adminData) {
                throw new ApiError(401, "Unauthorized request");
            }

            const category = await updateCategoryService(
                id,
                {
                    name: categoryName,
                    slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
                },
                adminData,
                {
                    ipAddress: req.ip ?? "",
                    userAgent: req.get("user-agent") ?? "",
                },
            );

            res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
        });

    const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
            const adminData = req.user;

        if (!id) {
            throw new ApiError(400, "Category id is required");
        }
            if (!adminData) {
                throw new ApiError(401, "Unauthorized request");
            }

            const category = await deleteCategoryService(id, adminData, {
                ipAddress: req.ip ?? "",
                userAgent: req.get("user-agent") ?? "",
            });

            res.status(200).json(new ApiResponse(200, category, "Category deleted successfully"));
        });

    export  {
        createCategory,
        getAllCategories,
        getAdminCategories,
        updateCategory,
        deleteCategory,
    };
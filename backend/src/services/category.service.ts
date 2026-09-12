import { prisma } from "../lib/prisma.js";

import { ApiError } from "../utils/apiError.js";
import {categoryRepository} from "../repositories/category.repository.js";
import { string } from "zod";
import { Prisma } from "@prisma/client";


export const createCategory = async (data: Prisma.categoryCreateInput) => {

    const category = await categoryRepository.createCategory(data);
    if (!category) {
        throw new ApiError(500,"Failed to create category");
    }

    return category;
}

export const getAllCategories = async () => {
    const categories = await categoryRepository.findAllCategories();
    if (!categories) {
        throw new ApiError(404,"No categories found");
    }

    return categories;
} 

export const deleteCategory = async (id: string) => {
    const category = await categoryRepository.deleteCategory(id);
    if (!category) {
        throw new ApiError(404,"Category not found");
    }

    return category;
}
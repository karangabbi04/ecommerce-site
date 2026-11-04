import { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma.js";

class CategoryRepository {

    /** create a new category */
    async createCategory(data: Prisma.categoryCreateInput) {
        return prisma.category.create({
            data,
        });
    }

    /** find all categories */
    async findAllCategories() {
        return prisma.category.findMany();
    }

    /** find categories with their product counts for admin views */
    async findAllCategoriesWithProductCount() {
        return prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true,
                _count: {
                    select: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    /** find category by id */
    async findCategoryById(id: string) {
        return prisma.category.findUnique({
            where: {
                id,
            },
        });
    }

    async updateCategory(id: string, data: Prisma.categoryUpdateInput) {
        return prisma.category.update({
            where: { id },
            data,
        });
    }

    async deleteCategory(id: string) {
        return prisma.category.delete({
            where: {
                id,
            },
        });
    }

}

export const categoryRepository = new CategoryRepository();

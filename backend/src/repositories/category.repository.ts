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

    /** find category by id */
    async findCategoryById(id: string) {
        return prisma.category.findUnique({
            where: {
                id,
            },
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

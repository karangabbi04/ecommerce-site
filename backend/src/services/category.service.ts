import { ApiError } from "../utils/apiError.js";
import {categoryRepository} from "../repositories/category.repository.js";
import { AuditAction, AuditEntityType, Prisma } from "@prisma/client";
import { logAudit } from "../utils/auditLogger.js";

interface AdminData {
    id: string;
    email: string;
    role: string;
}

interface RequestMetadata {
    ipAddress: string;
    userAgent: string;
}

export const createCategory = async (
    data: Prisma.categoryCreateInput,
    admin: AdminData,
    requestMetadata: RequestMetadata,
) => {
    const category = await categoryRepository.createCategory(data);
    if (!category) {
        throw new ApiError(500,"Failed to create category");
    }

    await logAudit({
        adminId: admin.id,
        adminEmail: admin.email,
        action: AuditAction.CREATE,
        entityType: AuditEntityType.CATEGORY,
        entityId: category.id,
        entityName: category.name,
        newValue: {
            id: category.id,
            name: category.name,
            slug: category.slug,
        },
        ipAddress: requestMetadata.ipAddress,
        userAgent: requestMetadata.userAgent,
        metadata: { adminRole: admin.role },
    });

    return category;
}

export const updateCategory = async (
    id: string,
    data: Prisma.categoryUpdateInput,
    admin: AdminData,
    requestMetadata: RequestMetadata,
) => {
    const oldCategory = await categoryRepository.findCategoryById(id);
    if (!oldCategory) {
        throw new ApiError(404, "Category not found");
    }

    const category = await categoryRepository.updateCategory(id, data);

    await logAudit({
        adminId: admin.id,
        adminEmail: admin.email,
        action: AuditAction.UPDATE,
        entityType: AuditEntityType.CATEGORY,
        entityId: category.id,
        entityName: category.name,
        oldValue: { name: oldCategory.name, slug: oldCategory.slug },
        newValue: { name: category.name, slug: category.slug },
        ipAddress: requestMetadata.ipAddress,
        userAgent: requestMetadata.userAgent,
        metadata: { adminRole: admin.role },
    });

    return category;
}

export const getAllCategories = async () => {
    const categories = await categoryRepository.findAllCategories();
    if (!categories) {
        throw new ApiError(404,"No categories found");
    }

    return categories;
} 

export const getAdminCategories = async () => {
    const categories = await categoryRepository.findAllCategoriesWithProductCount();

    return categories.map(({ _count, ...category }) => ({
        ...category,
        productCount: _count.product,
    }));
};

export const deleteCategory = async (
    id: string,
    admin: AdminData,
    requestMetadata: RequestMetadata,
) => {
    const oldCategory = await categoryRepository.findCategoryById(id);
    if (!oldCategory) {
        throw new ApiError(404,"Category not found");
    }

    const category = await categoryRepository.deleteCategory(id);

    await logAudit({
        adminId: admin.id,
        adminEmail: admin.email,
        action: AuditAction.DELETE,
        entityType: AuditEntityType.CATEGORY,
        entityId: oldCategory.id,
        entityName: oldCategory.name,
        oldValue: { name: oldCategory.name, slug: oldCategory.slug },
        ipAddress: requestMetadata.ipAddress,
        userAgent: requestMetadata.userAgent,
        metadata: { adminRole: admin.role },
    });

    return category;
}
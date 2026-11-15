import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getAllCategories,
  updateCategory,
} from "../../services/category.service.js";
import type { ToolResult, User } from "../interface.js";

const auditRequestMetadata = {
  ipAddress: "not-provided",
  userAgent: "AI_TOOL",
};

export const categoryExecutor: Record<
  string,
  (args: Record<string, unknown>, user: User) => Promise<ToolResult>
> = {
  create_category: async (args, user) => {
    const name = typeof args.name === "string" ? args.name.trim() : "";
    if (!name) throw new Error("Category name is required");

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const category = await createCategory(
      { name, slug },
      user,
      auditRequestMetadata,
    );

    return {
      success: true,
      message: `Category '${category.name}' created successfully`,
      data: category,
    };
  },

  update_category: async (args, user) => {
    const id = typeof args.id === "string" ? args.id : "";
    const name = typeof args.name === "string" ? args.name.trim() : "";
    if (!id || !name) throw new Error("Category ID and new name are required");

    const category = await updateCategory(
      id,
      { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      user,
      auditRequestMetadata,
    );

    return {
      success: true,
      message: `Category renamed to '${category.name}'`,
      data: category,
    };
  },

  get_all_categories: async () => ({
    success: true,
    data: await getAllCategories(),
  }),

  get_admin_categories: async () => ({
    success: true,
    data: await getAdminCategories(),
  }),

  delete_category: async (args, user) => {
    const id = typeof args.id === "string" ? args.id : "";
    if (!id) throw new Error("Category ID is required");
    if (args.confirmed !== true) {
      throw new Error("Explicit confirmation is required to delete a category");
    }

    const category = await deleteCategory(id, user, auditRequestMetadata);
    return {
      success: true,
      message: `Category '${category.name}' deleted successfully`,
      data: category,
    };
  },
};

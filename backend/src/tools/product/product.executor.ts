import { z } from "zod";

import { productService } from "../../services/product.service.js";
import {
  adminProductQuerySchema,
  createProductFromAIToolSchema,
  productIdParamsSchema,
  productQuerySchema,
  productStatusUpdateSchema,
} from "../../validations/product-validation.js";
import type { ToolResult, User } from "../interface.js";

const priceUpdateSchema = z.object({
  id: z.string().uuid(),
  price: z.number().positive().finite(),
  reason: z.string().trim().min(1).max(500),
});

const bulkPriceUpdateSchema = z.object({
  priceBelow: z.number().positive().finite(),
  newPrice: z.number().positive().finite(),
  reason: z.string().trim().min(1).max(500),
  categoryId: z.string().uuid().optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
});

const parse = <T>(schema: z.ZodType<T>, args: Record<string, unknown>): T =>
  schema.parse(args);

export const productExecutor: Record<
  string,
  (args: Record<string, unknown>, user: User) => Promise<ToolResult>
> = {
  create_product: async (args) => {
    const input = parse(createProductFromAIToolSchema, args);
    const product = await productService.createProductFromAITool(input);

    return {
      success: true,
      message: `Product '${product.name}' created successfully`,
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        stock: product.stock,
        status: product.status,
        categoryId: product.categoryId,
        images: product.images.map((image) => image.url),
      },
    };
  },

  get_product_details: async (args) => {
    const { id } = parse(productIdParamsSchema, args);
    const product = await productService.getProductById(id);
    return { success: true, data: product };
  },

  get_all_products: async (args) => {
    const query = parse(productQuerySchema, args);
    return { success: true, data: await productService.getAllProducts(query) };
  },

  get_admin_products: async (args) => {
    const query = parse(adminProductQuerySchema, args);
    return { success: true, data: await productService.getallproductsforadmin(query) };
  },

  update_product_status: async (args) => {
    const { id } = parse(productIdParamsSchema, args);
    const { status } = parse(productStatusUpdateSchema, args);
    const product = await productService.updateProductStatus(id, status);
    return {
      success: true,
      message: `Product status updated to ${product.status}`,
      data: product,
    };
  },

  update_product_price: async (args) => {
    const { id, price, reason } = parse(priceUpdateSchema, args);
    const product = await productService.updateProductPrice(id, price, reason);
    return {
      success: true,
      message: `Product price updated to ${price}`,
      data: product,
    };
  },

  bulk_update_product_prices: async (args, user) => {
    const input = parse(bulkPriceUpdateSchema, args);
    const result = await productService.bulkUpdateProductPrices({
      ...input,
      changedBy: user.id,
    });

    return {
      success: true,
      message: `Updated ${result.updatedCount} product prices below ${input.priceBelow}`,
      data: result,
    };
  },

  get_product_price_history: async (args) => {
    const { id } = parse(productIdParamsSchema, args);
    const history = await productService.priceHistory(id);
    return { success: true, data: history };
  },
};

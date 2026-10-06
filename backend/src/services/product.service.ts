import { ProductQueryDto } from "../DTO/product-query-dto.js";
import { ApiError } from "../utils/apiError.js";
import {prisma} from "../lib/prisma.js";
import { getPagination, createPagination } from "../utils/pagination.js";
import slugify from "slugify";
import { uploadToCloudinary } from "../utils/CloudinaryUpload.js";
import {buildProductInclude,buildProductOrderBy,buildProductWhere,} from "../helper/product-query.helper.js";

import { transformProduct, transformProducts,} from "../helper/product-transform.helper.js";

import { productRepository } from "../repositories/product.repository.js";
import {CreateProductInput} from "../validations/product-validation.js"
import { analyticsRepository } from "../repositories/Analytics.repository.js";
import type { AdminProductQueryDto } from "../validations/product-validation.js";
import { Prisma } from "@prisma/client";

interface CreateProductParams {
  productData: CreateProductInput;
  files: Express.Multer.File[];
}

const include = buildProductInclude();


const createProducts = async ({productData,
  files,
}: CreateProductParams) => {

const baseSlug = slugify(productData.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const existingProduct = await productRepository.findbyslug(baseSlug);
  

  const slug = existingProduct ? `${baseSlug}-${Date.now()}` : baseSlug;

  const uploadedImages = await Promise.all(
    files.map((file) => uploadToCloudinary(file.path, "ecocraft/products"))
  );

  if (uploadedImages.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }
   if(!uploadedImages){
        throw new ApiError(500, "some error occured while uploading images");
   }

  const product = await productRepository.create(
  prisma,
  {
    name: productData.name,
    slug,
    description: productData.description,
    tag: productData.tag ?? "",
    price: Number(productData.price),
    stock: Number(productData.stock),
    status: productData.status,
    categoryId: {
      connect: {
        id: productData.category,
      },
    },
    images: uploadedImages.map((image) => ({
      url: image.url,
      publicId: image.publicId,
    })),
  }
);

if (!product) {
    throw new ApiError(500, "Failed to create product");
  }

  return product;


};

const getAllProducts = async (
  query: ProductQueryDto
) => {

  const { skip, take } = getPagination(query);

  const where = buildProductWhere(query);

  const orderBy = buildProductOrderBy(query.sort);


  const [products, totalProducts] =
    await Promise.all([
      productRepository.findMany({
        where,
        orderBy,
        include,
        skip,
        take,
      }),

      productRepository.count(where),
    ]);

  return {

    products: transformProducts(products as any),

    pagination: createPagination({
      page: query.page,
      limit: query.limit,
      total: totalProducts,
    }),

  };

};

const getProductById = async (id: string) => {

  const product = await productRepository.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const getallproductsforadmin = async (query: AdminProductQueryDto) => {
  const where: Prisma.ProductWhereInput = {};
  const { skip, take } = getPagination(query);

  if (query.status && query.status !== "ALL") {
    where.status = query.status;
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.search) {
    where.name = { contains: query.search, mode: "insensitive" };
  }

  if (query.stockStatus === "LOW_STOCK") {
    where.stock = { gt: 0, lt: query.lowStockThreshold };
  } else if (query.stockStatus === "OUT_OF_STOCK") {
    where.stock = 0;
  } else if (query.stockStatus === "IN_STOCK") {
    where.stock = { gte: query.lowStockThreshold };
  }

  const [products, totalProducts, orderItemsCount] = await Promise.all([
    productRepository.findall(where, skip, take),
    productRepository.countAll(where),
    analyticsRepository.orderStats(),
  ]);

  return {
    products: products.map((product) => {
    const orderItem = orderItemsCount.find(
      (item) => item.productId === product.id
    );
    const stockStatus = product.stock === 0
      ? "OUT_OF_STOCK"
      : product.stock < query.lowStockThreshold
        ? "LOW_STOCK"
        : "IN_STOCK";

    return {
      ...product,
      orderCount: orderItem?._count.productId ?? 0,
      stockStatus,
    };
    }),
    pagination: createPagination({
      page: query.page,
      limit: query.limit,
      total: totalProducts,
    }),
  };
};


export const productService = {

  getAllProducts,
  getProductById,
  createProducts,
  getallproductsforadmin,

};
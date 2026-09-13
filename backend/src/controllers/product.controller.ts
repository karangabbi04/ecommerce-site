import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary } from "../utils/CloudinaryUpload.js";

import { productQuerySchema,productIdParamsSchema,createProductSchema } from "../validations/product-validation.js";

import { productService } from "../services/product.service.js";

// Create a new product
const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = createProductSchema.safeParse(req.body);

  if (!result.success) {
    // throw an error instead of returning a response to satisfy asyncHandler typing
    throw new ApiError(400, JSON.stringify(result.error.flatten()));
  }

  const productData = result.data;
  const { name, description, tag, price, stock, status, category } = productData;

  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  // const uploadedImages = await Promise.all(
  //   files.map((file) => uploadToCloudinary(file.path, "ecocraft/products"))
  // );


  const product = await productService.createProducts({
    productData,
    files,

  });



  console.log("product created successfully:", product);

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
  
});

// delete a product by ID
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new ApiError(400, "Product id is required");
  }

  // 2. Check product exist karta hai ya nahi
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // 3. Delete product
  await prisma.product.delete({
    where: { id },
  });

  res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});





// get single product by ID
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.params);

  const { id } = productIdParamsSchema.parse(req.params);

  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  const product = await productService.getProductById(id);

  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});






//get products by slug
const getProductBySlug = asyncHandler<{ slug: string }>(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Product slug is required");
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

//get all products with pagination, filtering, sorting
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);

  const result = await productService.getAllProducts(query);

  res.status(200).json(new ApiResponse(200, result, "Products fetched successfully"));
});

export { createProduct, deleteProduct, getProductById, getProductBySlug };

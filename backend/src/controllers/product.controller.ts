import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../lib/prisma.js";

// Create a new product
 const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    imageUrl,
    isFeatured,
  } = req.body;

  if (!name || price === undefined) {
    throw new ApiError(400, "Product name and price are required");
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      isFeatured,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));

});
// delete a product by ID
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 1. Check id diya hai ya nahi
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

  // 4. Response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});
// get single product by ID
const  getProductById = asyncHandler<{ id: string }>(
  async (req, res) => {
    const { id } = req.params;

    // 1. Basic validation
    if (!id) {
      throw new ApiError(400, "Product id is required");
    }

    // 2. Find product
    const product = await prisma.product.findUnique({
      where: { id },
    });

    // 3. Not found
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // 4. Success
    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  }
);
//get all products with pagination, filtering, sorting
const getallProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
});


export { createProduct, deleteProduct, getProductById, getallProducts


 };

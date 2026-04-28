import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../lib/prisma.js";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
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


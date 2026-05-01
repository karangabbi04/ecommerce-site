import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary } from "../utils/CloudinaryUpload.js";
import slugify from "slugify";

// Create a new product


 const createProduct = asyncHandler (async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    stock,
    isFeatured,
  } = req.body;

  const files = req.files as Express.Multer.File[];

   if (!name || !description || price === undefined || stock === undefined) {
      throw new ApiError(400, "Name, description, price and stock are required");
    }

  if (!files || files.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  //generate slug
  const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // 2. check karo same slug pehle se exist to nahi karta
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: baseSlug,
      },
    });

    // 3. agar same slug exist karta hai to unique slug banao
    const slug = existingProduct
      ? `${baseSlug}-${Date.now()}`
      : baseSlug;




  const uploadedImages = await Promise.all(
    files.map((file) =>
      uploadToCloudinary(file.path, "ecocraft/products")
    )
  );

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      stock: Number(stock),
      isFeatured: isFeatured === "true",
      images: {
        create: uploadedImages.map((image) => ({
          url: image.url,
          publicId: image.publicId,
        })),
      },
    },
    include: {
      images: true,
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
       include: {
      images: true,
    },
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
//get products by slug
const getProductBySlug = asyncHandler<{ slug: string }>(
  async (req, res) => {
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

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  }
);
//get all products with pagination, filtering, sorting
const getallProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
       where: {
      isFeatured: true,
    },
    include: {
      images: true,   // 👈 ye line important hai
    },
    orderBy: {
      createdAt: "desc",
    },
  
    });
    return res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
});


export { createProduct, deleteProduct, getProductById, getProductBySlug, getallProducts


 };

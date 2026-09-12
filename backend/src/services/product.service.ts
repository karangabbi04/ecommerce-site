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

  const product = await productRepository.findById({
    where: {
      id,
    },
    include

  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};



export const productService = {

  getAllProducts,
  getProductById,
  createProducts,

};
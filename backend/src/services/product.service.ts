import { ProductQueryDto } from "../DTO/product-query-dto.js";
import { ApiError } from "../utils/apiError.js";

import { getPagination, createPagination } from "../utils/pagination.js";

import {
  buildProductInclude,
  buildProductOrderBy,
  buildProductWhere,
} from "../helper/product-query.helper.js";

import {
  transformProduct,
  transformProducts,
} from "../helper/product-transform.helper.js";

import { productRepository } from "../repositories/product.repository.js";

  const include = buildProductInclude();


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

    products: transformProducts(products),

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

};
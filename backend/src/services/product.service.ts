import { ProductQueryDto } from "../DTO/product-query-dto";

import { getPagination, createPagination } from "../utils/pagination";

import {
  buildProductInclude,
  buildProductOrderBy,
  buildProductWhere,
} from "../helper/product-query.helper";

import {
  transformProduct,
  transformProducts,
} from "../helper/product-transform.helper";

import { productRepository } from "../repositories/product.repository";

const getAllProducts = async (
  query: ProductQueryDto
) => {

  const { skip, take } = getPagination(query);

  const where = buildProductWhere(query);

  const orderBy = buildProductOrderBy(query.sort);

  const include = buildProductInclude();

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

export const productService = {

  getAllProducts,

};
import { Prisma } from "@prisma/client";

import { ProductQueryDto } from "../DTO/product-query-dto.js";
import { PRODUCT_SORT } from "../constants/product.constants.js";

export const buildProductWhere = (
  query: ProductQueryDto
): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};


  if (query.category) {
    where.category = query.category;
  }

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        tag: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
};

export const buildProductOrderBy = (
  sort?: ProductQueryDto["sort"]
): Prisma.ProductOrderByWithRelationInput => {
  switch (sort) {
    case PRODUCT_SORT.PRICE_ASC:
      return {
        price: "asc",
      };

    case PRODUCT_SORT.PRICE_DESC:
      return {
        price: "desc",
      };

    case PRODUCT_SORT.OLDEST:
      return {
        createdAt: "asc",
      };

    case PRODUCT_SORT.NEWEST:
    default:
      return {
        createdAt: "desc",
      };
  }
};

export const buildProductInclude =
  (): Prisma.ProductInclude => ({
    images: true,
  });
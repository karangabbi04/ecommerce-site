import { Prisma } from "@prisma/client";

import {prisma} from "../lib/prisma";



/**
 * Find Many
 */
const findMany = <
  T extends Prisma.ProductFindManyArgs
>(
  args: Prisma.SelectSubset<
    T,
    Prisma.ProductFindManyArgs
  >
) => {
  return prisma.product.findMany(args);
};

/**
 * Count
 */
const count = (
  where?: Prisma.ProductWhereInput
) => {
  return prisma.product.count({
    where,
  });
};

/**
 * Find By Id
 */
const findById = <
  T extends Prisma.ProductFindUniqueArgs
>(
  args: Prisma.SelectSubset<
    T,
    Prisma.ProductFindUniqueArgs
  >
) => {
  return prisma.product.findUnique(args);
};

/**
 * Find By Slug
 */
const findBySlug = <
  T extends Prisma.ProductFindFirstArgs
>(
  args: Prisma.SelectSubset<
    T,
    Prisma.ProductFindFirstArgs
  >
) => {
  return prisma.product.findFirst(args);
};

/**
 * Create
 */
const create = <
  T extends Prisma.ProductCreateArgs
>(
  args: Prisma.SelectSubset<
    T,
    Prisma.ProductCreateArgs
  >
) => {
  return prisma.product.create(args);
};

/**
 * Update
 */
const update = <
  T extends Prisma.ProductUpdateArgs
>(
  args: Prisma.SelectSubset<
    T,
    Prisma.ProductUpdateArgs
  >
) => {
  return prisma.product.update(args);
};

/**
 * Delete
 */
const remove = <
  T extends Prisma.ProductDeleteArgs
>(
  args: Prisma.SelectSubset<
    T,
    Prisma.ProductDeleteArgs
  >
) => {
  return prisma.product.delete(args);
};

export const productRepository = {
  findMany,
  count,
  findById,
  findBySlug,
  create,
  update,
  remove,
};
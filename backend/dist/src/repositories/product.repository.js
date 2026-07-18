"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepository = void 0;
const prisma_1 = require("../lib/prisma");
/**
 * Find Many
 */
const findMany = (args) => {
    return prisma_1.prisma.product.findMany(args);
};
/**
 * Count
 */
const count = (where) => {
    return prisma_1.prisma.product.count({
        where,
    });
};
/**
 * Find By Id
 */
const findById = (args) => {
    return prisma_1.prisma.product.findUnique(args);
};
/**
 * Find By Slug
 */
const findBySlug = (args) => {
    return prisma_1.prisma.product.findFirst(args);
};
/**
 * Create
 */
const create = (args) => {
    return prisma_1.prisma.product.create(args);
};
/**
 * Update
 */
const update = (args) => {
    return prisma_1.prisma.product.update(args);
};
/**
 * Delete
 */
const remove = (args) => {
    return prisma_1.prisma.product.delete(args);
};
exports.productRepository = {
    findMany,
    count,
    findById,
    findBySlug,
    create,
    update,
    remove,
};

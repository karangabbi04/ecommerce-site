"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
const product_query_helper_1 = require("../helper/product-query.helper");
const product_transform_helper_1 = require("../helper/product-transform.helper");
const product_repository_1 = require("../repositories/product.repository");
const include = (0, product_query_helper_1.buildProductInclude)();
const getAllProducts = async (query) => {
    const { skip, take } = (0, pagination_1.getPagination)(query);
    const where = (0, product_query_helper_1.buildProductWhere)(query);
    const orderBy = (0, product_query_helper_1.buildProductOrderBy)(query.sort);
    const [products, totalProducts] = await Promise.all([
        product_repository_1.productRepository.findMany({
            where,
            orderBy,
            include,
            skip,
            take,
        }),
        product_repository_1.productRepository.count(where),
    ]);
    return {
        products: (0, product_transform_helper_1.transformProducts)(products),
        pagination: (0, pagination_1.createPagination)({
            page: query.page,
            limit: query.limit,
            total: totalProducts,
        }),
    };
};
const getProductById = async (id) => {
    const product = await product_repository_1.productRepository.findById({
        where: {
            id,
        },
        include
    });
    if (!product) {
        throw new ApiError_1.ApiError(404, "Product not found");
    }
    return product;
};
exports.productService = {
    getAllProducts,
    getProductById,
};

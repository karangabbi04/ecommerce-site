"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProductInclude = exports.buildProductOrderBy = exports.buildProductWhere = void 0;
const product_constants_1 = require("../constants/product.constants");
const buildProductWhere = (query) => {
    const where = {};
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
exports.buildProductWhere = buildProductWhere;
const buildProductOrderBy = (sort) => {
    switch (sort) {
        case product_constants_1.PRODUCT_SORT.PRICE_ASC:
            return {
                price: "asc",
            };
        case product_constants_1.PRODUCT_SORT.PRICE_DESC:
            return {
                price: "desc",
            };
        case product_constants_1.PRODUCT_SORT.OLDEST:
            return {
                createdAt: "asc",
            };
        case product_constants_1.PRODUCT_SORT.NEWEST:
        default:
            return {
                createdAt: "desc",
            };
    }
};
exports.buildProductOrderBy = buildProductOrderBy;
const buildProductInclude = () => ({
    images: true,
});
exports.buildProductInclude = buildProductInclude;

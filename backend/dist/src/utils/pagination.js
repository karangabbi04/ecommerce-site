"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = getPagination;
exports.createPagination = createPagination;
function getPagination({ page, limit, }) {
    const skip = (page - 1) * limit;
    return {
        skip,
        take: limit,
    };
}
function createPagination({ page, limit, total, }) {
    const totalPages = Math.ceil(total / limit);
    return {
        currentPage: page,
        limit,
        totalProducts: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
}

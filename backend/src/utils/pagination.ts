interface PaginationOptions {

    page: number;

    limit: number;

}

export function getPagination({

    page,

    limit,

}: PaginationOptions) {

    const skip = (page - 1) * limit;

    return {

        skip,

        take: limit,

    };

}

export function createPagination({

    page,

    limit,

    total,

}: {

    page: number;

    limit: number;

    total: number;

}) {

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
export const DEFAULT_PAGE = 1;

export const DEFAULT_LIMIT = 12;

export const MAX_LIMIT = 50;

export const PRODUCT_SORT = {
    NEWEST: "newest",
    OLDEST: "oldest",
    PRICE_ASC: "price_asc",
    PRICE_DESC: "price_desc",
} as const;

export const PRODUCT_SORT_VALUES = Object.values(PRODUCT_SORT);
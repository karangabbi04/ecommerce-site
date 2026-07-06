import { PRODUCT_SORT } from "../constants/product.constants";

export type ProductSort =
    (typeof PRODUCT_SORT)[keyof typeof PRODUCT_SORT];

export interface ProductQuery {
    page: number;
    limit: number;

    search?: string;

    category?: string;

    featured?: boolean;

    sort?: ProductSort;
}
import { syncBuiltinESMExports } from "node:module";
import { PRODUCT_SORT } from "../constants/product.constants.js";

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

export interface productId{
    id:string,
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    featured: boolean;
    slug: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}
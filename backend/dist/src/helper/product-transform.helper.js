"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformProducts = exports.transformProduct = void 0;
const transformProduct = (product) => ({
    ...product,
    price: Number(product.price),
    oldPrice: product.oldPrice
        ? Number(product.oldPrice)
        : null,
});
exports.transformProduct = transformProduct;
const transformProducts = (products) => products.map(exports.transformProduct);
exports.transformProducts = transformProducts;

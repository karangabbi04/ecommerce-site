"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToClientCartResponse = exports.mapCart = void 0;
const mapCart = (cart) => {
    let subtotal = 0;
    let totalItems = 0;
    const items = cart.items.map((item) => {
        const price = Number(item.product.price);
        const oldPrice = item.product.oldPrice
            ? Number(item.product.oldPrice)
            : null;
        const total = Number(item.product.price) * item.quantity;
        subtotal += total;
        totalItems += item.quantity;
        return {
            id: item.id,
            productId: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price,
            oldPrice,
            quantity: item.quantity,
            total,
            stock: item.product.stock,
            image: item.product.images.length > 0
                ? item.product.images[0].url
                : null,
        };
    });
    return {
        id: cart.id,
        userId: cart.userId ?? null,
        guestId: cart.guestId ?? null,
        totalItems,
        subtotal,
        items,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
    };
};
exports.mapCart = mapCart;
const mapToClientCartResponse = (cart) => {
    const mapped = (0, exports.mapCart)(cart);
    return {
        cart: {
            id: mapped.id,
            userId: mapped.userId,
            guestId: mapped.guestId,
        },
        items: mapped.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: {
                id: item.productId,
                name: item.name,
                slug: item.slug,
                price: item.price,
                stock: item.stock,
                images: item.image
                    ? [{ id: item.productId, url: item.image }]
                    : [],
            },
        })),
        subtotal: mapped.subtotal,
        totalItems: mapped.totalItems,
    };
};
exports.mapToClientCartResponse = mapToClientCartResponse;

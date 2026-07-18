"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSelect = void 0;
exports.cartSelect = {
    id: true,
    guestId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    items: {
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            quantity: true,
            createdAt: true,
            updatedAt: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    oldPrice: true,
                    stock: true,
                    category: true,
                    tag: true,
                    status: true,
                    images: {
                        orderBy: {
                            createdAt: "asc",
                        },
                        select: {
                            id: true,
                            url: true,
                        },
                    },
                },
            },
        },
    },
};

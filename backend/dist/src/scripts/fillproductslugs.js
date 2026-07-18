"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = require("../lib/prisma.js");
const slugify_1 = __importDefault(require("slugify"));
const fillProductSlugs = async () => {
    const products = await prisma_js_1.prisma.product.findMany();
    console.log("Total products found:", products.length);
    for (const product of products) {
        console.log("Checking:", product.name, "current slug:", product.slug);
        if (product.slug !== null && product.slug !== "") {
            console.log("Already has slug, skipped");
            continue;
        }
        const baseSlug = (0, slugify_1.default)(product.name, {
            lower: true,
            strict: true,
            trim: true,
        });
        let slug = baseSlug;
        let count = 1;
        while (await prisma_js_1.prisma.product.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        const updatedProduct = await prisma_js_1.prisma.product.update({
            where: { id: product.id },
            data: { slug },
        });
        console.log("Updated:", updatedProduct.name, "→", updatedProduct.slug);
    }
    console.log("Done");
};
fillProductSlugs()
    .catch((error) => {
    console.error("Script error:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma_js_1.prisma.$disconnect();
});

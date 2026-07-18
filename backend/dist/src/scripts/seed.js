"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_js_1 = require("../generated/client.js");
const adapter_pg_1 = require("@prisma/adapter-pg");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new client_js_1.PrismaClient({
    adapter,
});
async function main() {
    const product = await prisma.product.create({
        data: {
            name: "Bottle Craft",
            description: "Handmade decor item",
            price: 499,
            category: "Decor",
            stock: 10,
            imageUrl: "https://example.com/img.jpg",
            isFeatured: true,
        },
    });
    console.log("Inserted:", product);
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
});

import "dotenv/config";
import { PrismaClient } from "../generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
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
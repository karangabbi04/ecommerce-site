import { prisma } from "../lib/prisma.js";
import slugify from "slugify";

const fillProductSlugs = async () => {
  const products = await prisma.product.findMany();

  console.log("Total products found:", products.length);

  for (const product of products) {
    console.log("Checking:", product.name, "current slug:", product.slug);

    if (product.slug !== null && product.slug !== "") {
      console.log("Already has slug, skipped");
      continue;
    }

    const baseSlug = slugify(product.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const updatedProduct = await prisma.product.update({
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
    await prisma.$disconnect();
  });
import { Product } from "@/types/product";

interface FilterProps {
  products: Product[];

  search: string;

  category: string;
}

export function filterProducts({
  products,
  search,
  category,
}: FilterProps) {
  return products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });
}
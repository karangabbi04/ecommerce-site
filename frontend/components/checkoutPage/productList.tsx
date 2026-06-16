import ProductCard from "./productCard";

interface ProductListProps {
  items: any[];
}

export default function ProductList({
  items,
}: ProductListProps) {
  if (!items?.length) {
    return (
      <div className="rounded-xl border bg-white p-6 text-center">
        No products found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}
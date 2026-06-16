import Image from "next/image";

interface ProductCardProps {
  item: {
    id: string;
    image: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  };
}

export default function ProductCard({
  item,
}: ProductCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
          {item.image && (
            <Image
              src={item.image}
              alt={item.productName}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-1 items-center justify-between">
          <div>
            <h3 className="font-semibold">
              {item.productName}
            </h3>

            <p className="text-sm text-zinc-500">
              Qty: {item.quantity}
            </p>

            <p className="text-sm text-green-600">
              In Stock
            </p>
          </div>

          <p className="font-bold">
            ₹
            {(
              item.unitPrice * item.quantity
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
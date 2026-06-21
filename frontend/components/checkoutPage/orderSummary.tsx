interface OrderSummaryProps {
  itemsCount: number;
  subtotal: number;
  tax: number;
  shipping: string;
  total: number;
}

export default function OrderSummary({
  itemsCount,
  subtotal,
  tax,
  shipping,
  total,
}: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-zinc-600">
            Items
          </span>

          <span>{itemsCount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-600">
            Subtotal
          </span>

          <span>
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-600">
            GST
          </span>

          <span>
            ₹{tax.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-600">
            Shipping
          </span>

          <span className="font-medium text-green-600">
            {shipping}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>
              ₹{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <input
          placeholder="Coupon Code"
          className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <button className="rounded-xl border px-4 font-medium hover:bg-zinc-100">
          Apply
        </button>
      </div>

    

      <div className="mt-6 border-t pt-4 text-sm text-zinc-500">
        <p>✓ Secure Checkout</p>
        <p>✓ Fast Delivery</p>
        <p>✓ 100% Safe Payments</p>
      </div>
    </div>
  );
}
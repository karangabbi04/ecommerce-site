// components/admin/products/quick-price-update.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { TrendingDown, TrendingUp, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateProductPrice } from "@/hooks/queries/use-products";

const priceUpdateSchema = z.object({
  newPrice: z.number().min(0, "Price must be positive"),
  reason: z.string().trim().min(1, "Please provide a reason for the price change"),
});

type PriceUpdateValues = z.infer<typeof priceUpdateSchema>;

interface QuickPriceUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    currentPrice: number | string;
  };
  onSuccess?: () => void;
}

export function QuickPriceUpdate({
  isOpen,
  onClose,
  product,
  onSuccess,
}: QuickPriceUpdateProps) {
  const updateProductPrice = useUpdateProductPrice();
  const loading = updateProductPrice.isPending;
  const numericCurrentPrice = Number(product.currentPrice) || 0;

  const form = useForm<PriceUpdateValues>({
    resolver: zodResolver(priceUpdateSchema),
    defaultValues: {
      newPrice: numericCurrentPrice,
      reason: "",
    },
  });

  const newPrice = form.watch("newPrice");
  const priceDiff = newPrice - numericCurrentPrice;
  const priceChangePercent = numericCurrentPrice > 0 
    ? ((priceDiff / numericCurrentPrice) * 100).toFixed(1)
    : "0";
  const isPriceDrop = priceDiff < 0;
  const isPriceIncrease = priceDiff > 0;

  async function onSubmit(values: PriceUpdateValues) {
    try {
      await updateProductPrice.mutateAsync({
        productId: product.id,
        price: values.newPrice,
        reason: values.reason,
      });

      toast.success(
        isPriceDrop
          ? `Price dropped from ₹${numericCurrentPrice} to ₹${values.newPrice}`
          : `Price updated to ₹${values.newPrice}`
      );

      onSuccess?.();
      onClose();
      form.reset();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(message || "Failed to update price");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-112.5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Update Price
            <Badge variant="outline" className="font-normal">
              Quick Action
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Change the price for{" "}
            <span className="font-semibold text-foreground">{product.name}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Current vs New Price Display */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p className="text-2xl font-bold">₹{numericCurrentPrice}</p>
                </div>
                {newPrice !== numericCurrentPrice && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">New Price</p>
                    <p className="text-2xl font-bold text-primary">₹{newPrice}</p>
                  </div>
                )}
              </div>

              {/* Price Change Indicator */}
              {newPrice !== numericCurrentPrice && (
                <div
                  className={`mt-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isPriceDrop
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  }`}
                >
                  {isPriceDrop ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  <span>
                    {isPriceDrop ? "Price Drop" : "Price Increase"}: ₹
                    {Math.abs(priceDiff)} ({priceChangePercent}%)
                  </span>
                </div>
              )}
            </div>

            {/* New Price Input */}
            <FormField
              control={form.control}
              name="newPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter new price"
                      className="h-11 text-lg font-semibold"
                      autoFocus
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reason (Optional) */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Festival sale, Competitor price match"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || newPrice === numericCurrentPrice}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Price"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
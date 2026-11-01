import { useQuery } from "@tanstack/react-query";
import { getAllOrders, getFilteredOrders,getOdersForAdminWithCount,getOrderByRazorId } from "@/services/order.service";

export function useAllOrders() {
  return useQuery({
    queryKey: ["admin", "orders", "all"],
    queryFn: getAllOrders,
  });
}

export function useFilteredOrders(searchParams: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["orders", "filters", searchParams],
    queryFn: () => getFilteredOrders(searchParams),
  });
}

export function useOrderByRazorPay(RazorId: string) {
  return useQuery({
    queryKey: ["orders", "razorpay", RazorId],
    queryFn: () => getOrderByRazorId(RazorId),
  });
}

export function useOrdersForAdminWithCount() {
  return useQuery({
    queryKey: ["admin", "orders", "count"],
    queryFn: async () => {
      const response = await getOdersForAdminWithCount();
      return response;
    },
  });
}
import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/account.service";

export function useAccountProfile() {
  return useQuery({
    queryKey: ["account", "profile"],
    queryFn: accountService.getProfile,
    retry: false,
  });
}

export function useAccountOrders() {
  return useQuery({
    queryKey: ["account", "orders"],
    queryFn: accountService.getOrders,
    retry: false,
  });
}

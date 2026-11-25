import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/account.service";

export function useAccountProfile() {
  return useQuery({
    queryKey: ["account", "profile"],
    queryFn: accountService.getProfile,
    retry: false,

    staleTime: 0,       // Data ko turant "purana" (stale) maan lo
    gcTime: 0,  
  });
}

export function useAccountOrders() {
  return useQuery({
    queryKey: ["account", "orders"],
    queryFn: accountService.getOrders,
    retry: false,
  });
}

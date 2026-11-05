"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { adminAuthService } from "@/services/admin-auth.service";
import { useAuthStore } from "@/store/auth.store";

export const adminSessionQueryKey = ["admin", "session"] as const;

export function useAdminSession() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const storeUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.logoutUser);

  const profileQuery = useQuery({
    queryKey: adminSessionQueryKey,
    queryFn: adminAuthService.getCurrentAdmin,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (profileQuery.data) {
      setUser({
        id: profileQuery.data.id,
        name: profileQuery.data.name ?? "Admin",
        email: profileQuery.data.email,
        role: profileQuery.data.role,
      });
    }
  }, [profileQuery.data, setUser]);

  const logoutMutation = useMutation({
    mutationFn: adminAuthService.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      router.replace("/auth/admin-login");
      router.refresh();
    },
    onError: () => {
      toast.error("Could not log out. Please try again.");
    },
  });

  return {
    user: profileQuery.data ?? storeUser,
    isLoading: profileQuery.isLoading,
    isLoggingOut: logoutMutation.isPending,
    logout: () => logoutMutation.mutate(),
  };
}

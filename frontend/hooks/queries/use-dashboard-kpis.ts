import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardKpis() {
  return useQuery({
    queryKey: ["admin", "dashboard", "kpis"],
    queryFn: dashboardService.getKpis,
  });
}
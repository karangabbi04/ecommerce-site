import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";
import { analyticService } from "@/services/analytics";


export function useanalytics(period: string) {
  return useQuery({
    queryKey: ["revenue", period],
    queryFn: () => analyticService.revanue(period),
  });
}
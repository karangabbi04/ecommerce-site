import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
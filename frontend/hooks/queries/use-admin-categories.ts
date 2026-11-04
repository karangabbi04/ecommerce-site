import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  productCount: number;
};

export function useAdminCategories() {
  return useQuery<AdminCategory[]>({
    queryKey: ["admin", "categories"],
    queryFn: categoryService.getAdminCategories,
  });
}
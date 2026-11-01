import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

import { queryKeys } from "@/lib/query-key";
import { ProductsParams } from "@/types/product";



export function useProducts(params: ProductsParams) {
  return useQuery({
    queryKey: queryKeys.products(params),
    
    
    queryFn: () => {
      return productService.getAllProducts(params);}
  });
}

export function useProductById(id:string){

  return useQuery(
    {
      queryKey:["product", id],

      queryFn: () => {
      return productService.getProductById(id);}
    }
  )

}

export function useAdminProducts(params: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => productService.getAllProductForAdmin(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.updateProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateProductPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.updateProductPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAllCategory,
  });
}
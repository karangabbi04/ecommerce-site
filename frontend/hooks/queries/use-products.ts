import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/product.service";

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
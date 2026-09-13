import { useMutation } from "@tanstack/react-query";
import  { CreateProductPayload } from "@/types/product";
import { productService } from "@/services/product.service";



export const useCreateProduct = () => {
  return useMutation({
    mutationFn: productService.createProduct,
  });
};

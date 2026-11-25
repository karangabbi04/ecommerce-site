import { useMutation } from "@tanstack/react-query";
import  { CreateProductPayload } from "@/types/product";
import { productService } from "@/services/product.service";
import { aiService,EnhancePayload } from "@/services/ai.service";



export const useCreateProduct = () => {
  return useMutation({
    mutationFn: productService.createProduct,
  });
};

export function  useInhanceDescription(){
    return useMutation({
    mutationFn: aiService.enhanceProductDescription,
  });
}

import { api } from "@/lib/api";
import { Product } from "@/types/product";

 const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    console.log("Fetching products from API...");
    const res = await api.get("/products");
    if(!res){
        console.log("No response from server");
    }
    console.log("Products fetched from API:", res.data.data);

    // agar backend response { success:true, data:[...] } deta hai
    return res.data.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },
};

export { productService };
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import { ProductsResponse } from "@/types/product";

 const productService = {

  getAllProducts: async (page = 1, limit = 10): Promise<ProductsResponse> => {

    const res = await api.get(`/products?page=${page}&limit=${limit}`);
    if(!res){
        console.log("No response from server");
    }
    console.log("Products fetched from API:", res.data.data);

    // agar backend response { success:true, data:[...] } deta hai
    return res.data.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    if(!res){
        console.log(`No response from server for product ID: ${id}`);
    }
    console.log(`Product fetched from API for ID ${id}:`, res.data.data);
    return res.data.data;
  },
  // create product 
  createProduct: async (formData: FormData) => {
     try {
    const res = await api.post("/add-product", formData, {
    });

    console.log("Product created via API:", res.data);

    return res.data;
    } catch (error: any) {
    
    console.error("FULL ERROR:", error);
     if (error.response) {
      
      console.error("BACKEND ERROR DATA:", error.response.data);
      console.error("STATUS:", error.response.status);
      console.error("HEADERS:", error.response.headers);

      
      throw new Error(error.response.data?.message || "Backend Error");
    } else if (error.request) {

      console.error("NO RESPONSE:", error.request);
      throw new Error("No response from server");
    } else {
     
      console.error("UNKNOWN ERROR:", error.message);
      throw new Error(error.message);
    }
  }}
};

export { productService };
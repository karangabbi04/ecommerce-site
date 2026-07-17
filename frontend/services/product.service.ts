
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import { ProductResponse } from "@/types/product";
import { ProductsParams } from "@/types/product";



 const productService = {

  getAllProducts: async (productPayload:ProductsParams): Promise<ProductResponse> => {

     const res = await api.get("/products", {
            params: productPayload,
  });
    if(!res){
        console.log("No response from server");
    }
    console.log("Products fetched from API:", res.data.data);

    // agar backend response { success:true, data:[...] } deta hai
    return res.data.data;
  },

   getProductById: async (id:string) => {
    console.log("api heet sfslfsdfdskjhfkshfksdhfks")

     const res = await api.get(`/products/${id}`);
  console.log(res)
    if(!res){
        console.log("No response from server");
    }
    console.log("Products fetched from API:", res.data.data);

    // agar backend response { success:true, data:[...] } deta hai
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
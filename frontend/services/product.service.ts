
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import { ProductResponse } from "@/types/product";
import { ProductsParams } from "@/types/product";
import { ProductSchemaType } from "@/validations/addProduct.validation";



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
  
    const res = await api.post("/add-product", formData, {
        headers:{
        "Content-Type":
        "multipart/form-data"
        }
        });

    console.log("Product created via API:", res.data);

    return res.data;
   
    

    }
 
};

export { productService };
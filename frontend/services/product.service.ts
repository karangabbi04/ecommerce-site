
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
   
    

    },

    getAllProductForAdmin: async (searchPrams: Record<string, string | number | undefined>) => {

     const res = await api.get("/admin/products", {
            params: searchPrams,
  });
    if(!res){
        console.log("No response from server");
    }
    console.log("Products fetched from API:", res.data.data);

    // agar backend response { success:true, data:[...] } deta hai
    return res.data.data;
  },

  updateProductStatus: async (payload: {
    productId: string;
    status: "ACTIVE" | "ARCHIVED";
  }) => {
    const res = await api.patch(
      `/admin/products/${payload.productId}/status`,
      { status: payload.status }
    );
    return res.data.data;
  },

  updateProductPrice: async (payload: {
    productId: string;
    price: number;
    reason: string;
  }) => {
    const res = await api.patch(
      `/admin/products/${payload.productId}/price`,
      { price: payload.price, reason: payload.reason }
    );
    return res.data.data;
  },
 
};

export { productService };
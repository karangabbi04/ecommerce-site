import { api } from "@/lib/api";
  
 export const categoryService = {

  getAllCategory: async () => {
     try {
    const res = await api.get("/categories", {
    });

    console.log("get categories via API:", res.data.data);

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
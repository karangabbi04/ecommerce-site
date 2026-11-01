import { api } from "@/lib/api";


export const analyticService =  {


    revanue: async(period: string)=>{
        const res = await api.get("/admin/revenue", {
            params: { period },
        });

        if(!res){
         console.log("something error in fetch data ")
        }

        return res.data.data.data as Array<{
                month: string;
                revenue: number;
                orders: number;
            }>;
    }

}
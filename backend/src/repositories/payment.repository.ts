import { PrismaClient,Prisma } from "@prisma/client";


const prisma = new PrismaClient();



export const PaymentRepository = {

    findByRazorpayOrderId: async ( razorpayOrderId:string ) => {
        return prisma.payment.findUnique({
            where:{
                razorpayOrderId
            }
        });
    },



    updatePayment: async(db:PrismaClient | Prisma.TransactionClient,paymentId:string, data:any)=>{
        return db.payment.update({
            where:{
                id:paymentId
            },
            data
        });
    }

};
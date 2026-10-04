import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { string } from "zod";


class trackingRepository {

    async orderTrackById(orderId: string) {
        return prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                timeline: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    select: {
                        id: true,
                        status: true,
                        note: true,
                        createdAt: true,
                    },
                },
            },
            omit: {
                userId: true,
                guestId: true,
                updatedAt: true,
                addressId: true,
            },
        });
    }

    async  orderTrack(orderId:string){

        return prisma.order.findUnique({
            where:{
                orderNumber:orderId
            },
            include:{
                timeline:{
                    orderBy:{
                        createdAt:"asc"
                    },
                    select:{
                        id:true,
                        status:true,
                        note:true,
                        createdAt:true
                    }
                }
            },
            omit:{
                userId:true,
                guestId:true,
                updatedAt:true,
                addressId:true,
                
            }
        }
            
        )
        
    }

    async orderItem(orderId:string){
        return prisma.orderItem.findMany({

            where:{
                orderId:orderId
            }
        }

        )
    }


}

export  const TrackingRepsitory  = new trackingRepository()
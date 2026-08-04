import { z } from "zod";


export const revenueQuerySchema = z.object({

    groupBy:z.enum([
        "day",
        "week",
        "month",
        "year"
    ]),


    startDate:z
    .string()
    .optional(),


    endDate:z
    .string()
    .optional()


});


export type RevenueQuery =
z.infer<typeof revenueQuerySchema>;
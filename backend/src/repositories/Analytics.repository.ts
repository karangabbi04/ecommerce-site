import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { RevenueFilter } from "../types/analytics.types.js";

class AdminRepository {
  async adminLoginbyEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        password: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerEmail: true,
        total: true,
        status: true,
        currentStatus: true,
        paymentStatus: true,
        createdAt: true,
      },
    });
  }

  async findTotalOrder() {
    return prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });
  }

  
}

  

export const adminRepository = new AdminRepository();

export class AnalyticsRepository {
  
  async getRevenue(filter: RevenueFilter) {
    const { groupBy, startDate, endDate } = filter;

    let dateFormat: string;

    switch (groupBy) {
      case "day":
        dateFormat = "day";
        break;
      case "week":
        dateFormat = "week";
        break;
      case "month":
        dateFormat = "month";
        break;
      case "year":
        dateFormat = "year";
        break;
      default:
        dateFormat = "day";
    }

   const result = await prisma.$queryRaw`
  SELECT
    DATE_TRUNC(${dateFormat}, "createdAt") AS period,
    SUM("total")::float AS revenue,
    COUNT(id)::int AS orders
  FROM "Order"
  WHERE status = 'DELIVERED'
    AND "createdAt" BETWEEN ${startDate} AND ${endDate}
  GROUP BY period
  ORDER BY period ASC;
`;

    return result;
  }


  async orderStats() {
    return prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order:{
          status:{
            notIn: ["CANCELLED", "REFUNDED"]
          }
        }
      },
      _sum: {
        quantity: true,
      },
      _count: {
        productId: true,
      },
    });
  }
}


export const analyticsRepository = new AnalyticsRepository();

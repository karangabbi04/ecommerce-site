import { analyticService } from "@/services/analytics";
import { getOdersForAdminWithCount } from "@/services/order.service";
import { productService } from "@/services/product.service";

export interface DashboardKpis {
  monthlyRevenue: number;
  totalOrders: number;
  totalProducts: number;
}

export const dashboardService = {
  getKpis: async (): Promise<DashboardKpis> => {
    const [revenueRows, orderCounts, productResult] = await Promise.all([
      analyticService.revanue("thisMonth"),
      getOdersForAdminWithCount(),
      productService.getAllProductForAdmin({ page: 1, limit: 1, status: "ALL" }),
    ]);

    return {
      monthlyRevenue: revenueRows.reduce((total, row) => total + row.revenue, 0),
      totalOrders: orderCounts.reduce(
        (total: number, order: { count: number }) => total + order.count,
        0,
      ),
      totalProducts: productResult.pagination.totalProducts,
    };
  },
};
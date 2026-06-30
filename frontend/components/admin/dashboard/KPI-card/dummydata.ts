
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

export const dashboardKPI = [
  {
    title: "Revenue",
    value: "₹2,45,680",
    icon: DollarSign,
    trend: 18.4,
    description: "Total revenue generated this month",
    variant: "success" as const,
    badge: "Monthly",
  },
  {
    title: "Orders",
    value: "1,284",
    icon: ShoppingCart,
    trend: 12.8,
    description: "Orders received in the last 30 days",
    variant: "default" as const,
    badge: "Live",
  },
  {
    title: "Customers",
    value: "8,942",
    icon: Users,
    trend: -2.3,
    description: "Active customers this month",
    variant: "warning" as const,
    badge: "Active",
  },
  {
    title: "Products",
    value: "426",
    icon: Package,
    trend: 6.5,
    description: "Products currently in inventory",
    variant: "danger" as const,
    badge: "Stock",
  },
];
import {
  FolderPlus,
  PackagePlus,
  ShoppingCart,
  Tags,
  TicketPercent,
} from "lucide-react";

import type { QuickAction } from "./types";

export const quickActions: QuickAction[] = [
  {
    id: "add-product",
    title: "Add Product",
    description: "Create a new product",
    href: "/admin/products/create",
    icon: PackagePlus,
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    id: "add-category",
    title: "Add Category",
    description: "Organize product categories",
    href: "/admin/categories/create",
    icon: FolderPlus,
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  {
    id: "create-coupon",
    title: "Create Coupon",
    description: "Generate discount offers",
    href: "/admin/coupons/create",
    icon: TicketPercent,
    color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  {
    id: "add-brand",
    title: "Add Brand",
    description: "Manage product brands",
    href: "/admin/brands/create",
    icon: Tags,
    color: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
  },
  {
    id: "view-orders",
    title: "View Orders",
    description: "Manage customer orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    color: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
  },
];
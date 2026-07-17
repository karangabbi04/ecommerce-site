import {
  BadgeDollarSign,
  FolderPen,
  ImagePlus,
  PackagePlus,
  Pencil,
  Ticket,
  Trash2,
  Eye,
  EyeOff,
  type LucideIcon,
} from "lucide-react";

export type ActivityCategory =
  | "product"
  | "category"
  | "coupon"
  | "banner"
  | "settings";

export interface Activity {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  badge: string;
  time: string;
  createdAt: string;
  icon: LucideIcon;
  iconColor: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}

export const activities: Activity[] = [
  {
    id: "1",
    category: "product",
    title: "Product Added",
    description: 'Added new product "Nike Air Max 270"',
    badge: "Added",
    time: "2 min ago",
    createdAt: "2026-07-02T10:20:00",
    icon: PackagePlus,
    iconColor: "bg-green-100 text-green-600",
    badgeVariant: "default",
  },

  {
    id: "2",
    category: "product",
    title: "Product Price Updated",
    description: "Nike Air Max • ₹4,999 → ₹4,499",
    badge: "Price",
    time: "10 min ago",
    createdAt: "2026-07-02T10:10:00",
    icon: BadgeDollarSign,
    iconColor: "bg-blue-100 text-blue-600",
    badgeVariant: "secondary",
  },

  {
    id: "3",
    category: "product",
    title: "Product Published",
    description: "Wireless Mouse is now visible to customers",
    badge: "Published",
    time: "25 min ago",
    createdAt: "2026-07-02T09:55:00",
    icon: Eye,
    iconColor: "bg-emerald-100 text-emerald-600",
    badgeVariant: "outline",
  },

  {
    id: "4",
    category: "coupon",
    title: "Coupon Created",
    description: "SUMMER20 • 20% Discount",
    badge: "Coupon",
    time: "45 min ago",
    createdAt: "2026-07-02T09:30:00",
    icon: Ticket,
    iconColor: "bg-violet-100 text-violet-600",
    badgeVariant: "secondary",
  },

  {
    id: "5",
    category: "product",
    title: "Product Deleted",
    description: 'Deleted "iPhone 13 Case"',
    badge: "Deleted",
    time: "1 hour ago",
    createdAt: "2026-07-02T09:00:00",
    icon: Trash2,
    iconColor: "bg-red-100 text-red-600",
    badgeVariant: "destructive",
  },

  {
    id: "6",
    category: "category",
    title: "Category Updated",
    description: 'Renamed category "Shoes"',
    badge: "Updated",
    time: "Yesterday",
    createdAt: "2026-07-01T17:20:00",
    icon: FolderPen,
    iconColor: "bg-orange-100 text-orange-600",
    badgeVariant: "secondary",
  },

  {
    id: "7",
    category: "banner",
    title: "Banner Updated",
    description: "Summer Sale Banner has been changed",
    badge: "Banner",
    time: "Yesterday",
    createdAt: "2026-07-01T15:40:00",
    icon: ImagePlus,
    iconColor: "bg-pink-100 text-pink-600",
    badgeVariant: "outline",
  },

  {
    id: "8",
    category: "product",
    title: "Product Hidden",
    description: "Gaming Chair hidden from storefront",
    badge: "Hidden",
    time: "Yesterday",
    createdAt: "2026-07-01T13:20:00",
    icon: EyeOff,
    iconColor: "bg-slate-100 text-slate-600",
    badgeVariant: "outline",
  },

  {
    id: "9",
    category: "settings",
    title: "Store Settings Updated",
    description: "Shipping charges updated",
    badge: "Settings",
    time: "2 days ago",
    createdAt: "2026-06-30T18:15:00",
    icon: Pencil,
    iconColor: "bg-cyan-100 text-cyan-600",
    badgeVariant: "secondary",
  },
];
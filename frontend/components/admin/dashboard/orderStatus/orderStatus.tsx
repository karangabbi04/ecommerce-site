"use client";



type OrderStatus = {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  iconColor: string; // hex color like #facc15
  iconBg: string; // rgba color like rgba(234, 179, 8, 0.15)
  border: string; // Tailwind class
  hover: string; // Tailwind class
  changeColor: string; // hex color like #facc15
};

import {
  Clock3,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const orderData = [
  {
    title: "Pending",
    value: 32,
    change: 5,
    icon: Clock3,
    iconColor: "#facc15",
    iconBg: "rgba(234, 179, 8, 0.15)",
    border: "border-yellow-500/20",
    hover: "hover:border-yellow-400/60 hover:shadow-yellow-500/20",
    changeColor: "#facc15",
  },
  {
    title: "Processing",
    value: 45,
    change: 8,
    icon: Loader2,
    iconColor: "#60a5fa",
    iconBg: "rgba(59, 130, 246, 0.15)",
    border: "border-blue-500/20",
    hover: "hover:border-blue-400/60 hover:shadow-blue-500/20",
    changeColor: "#60a5fa",
  },
  {
    title: "Shipped",
    value: 78,
    change: 12,
    icon: Package,
    iconColor: "#a78bfa",
    iconBg: "rgba(168, 85, 247, 0.15)",
    border: "border-purple-500/20",
    hover: "hover:border-purple-400/60 hover:shadow-purple-500/20",
    changeColor: "#a78bfa",
  },
  {
    title: "Delivered",
    value: 1023,
    change: 20,
    icon: CheckCircle2,
    iconColor: "#4ade80",
    iconBg: "rgba(74, 222, 128, 0.15)",
    border: "border-green-500/20",
    hover: "hover:border-green-400/60 hover:shadow-green-500/20",
    changeColor: "#4ade80",
  },
  {
    title: "Cancelled",
    value: 56,
    change: -3,
    icon: XCircle,
    iconColor: "#f87171",
    iconBg: "rgba(248, 113, 113, 0.15)",
    border: "border-red-500/20",
    hover: "hover:border-red-400/60 hover:shadow-red-500/20",
    changeColor: "#f87171",
  },
];

export default function OrderStatusCard() {
  return (
<div className="rounded-3xl border border-slate-800/80 bg-linear-to-b from-[#121826] to-[#0F172A] p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
     <div className="mb-6 flex items-center justify-between">
  <div>
    <h2 className="text-xl font-bold text-white">
      Order Status
    </h2>
    <p className="text-sm text-slate-400">
      Monitor today's order activity
    </p>
  </div>

        <button className="text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
  >
          View All
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
     {orderData.map((item) => {
  const Icon = item.icon;

  return (
    <div
      key={item.title}
      className={`relative overflow-hidden rounded-2xl border bg-gray-500 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.border} ${item.hover}`}
    >
      <div className="flex  items-center justify-between">
        <div>
          <p className="text-[11px] text-gray-400">{item.title}</p>

          <h2 className="mt-2 text-1xl font-bold text-white">
            {item.value.toLocaleString()}
          </h2>

          <p className="mt-1 text-sm font-semibold" style={{ color: item.changeColor }}>
            {item.change > 0 ? "+" : ""}
            {item.change}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full`}
          style={{ backgroundColor: item.iconBg }}
        >
          <Icon className="h-4 w-5" style={{ color: item.iconColor }} />
        </div>
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
}
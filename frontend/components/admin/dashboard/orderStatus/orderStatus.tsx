"use client";

import {
  CheckCircle2,
  Clock3,
  Package,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";

type OrderStatusCount = {
  status: string;
  count: number;
};

type OrderStatusCardProps = {
  orderStatusData: OrderStatusCount[];
};

const STATUS_STYLES: Record<
  string,
  {
    icon: typeof Clock3;
    iconColor: string;
    iconBg: string;
    border: string;
    hover: string;
  }
> = {
  PENDING: {
    icon: Clock3,
    iconColor: "#facc15",
    iconBg: "rgba(234, 179, 8, 0.15)",
    border: "border-yellow-500/20",
    hover: "hover:border-yellow-400/60 hover:shadow-yellow-500/20",
  },
  CONFIRMED: {
    icon: CheckCircle2,
    iconColor: "#60a5fa",
    iconBg: "rgba(59, 130, 246, 0.15)",
    border: "border-blue-500/20",
    hover: "hover:border-blue-400/60 hover:shadow-blue-500/20",
  },
  PACKED: {
    icon: Package,
    iconColor: "#38bdf8",
    iconBg: "rgba(56, 189, 248, 0.15)",
    border: "border-sky-500/20",
    hover: "hover:border-sky-400/60 hover:shadow-sky-500/20",
  },
  SHIPPED: {
    icon: Truck,
    iconColor: "#a78bfa",
    iconBg: "rgba(168, 85, 247, 0.15)",
    border: "border-purple-500/20",
    hover: "hover:border-purple-400/60 hover:shadow-purple-500/20",
  },
  OUT_FOR_DELIVERY: {
    icon: Truck,
    iconColor: "#fb923c",
    iconBg: "rgba(251, 146, 60, 0.15)",
    border: "border-orange-500/20",
    hover: "hover:border-orange-400/60 hover:shadow-orange-500/20",
  },
  DELIVERED: {
    icon: CheckCircle2,
    iconColor: "#4ade80",
    iconBg: "rgba(74, 222, 128, 0.15)",
    border: "border-green-500/20",
    hover: "hover:border-green-400/60 hover:shadow-green-500/20",
  },
  CANCELLED: {
    icon: XCircle,
    iconColor: "#f87171",
    iconBg: "rgba(248, 113, 113, 0.15)",
    border: "border-red-500/20",
    hover: "hover:border-red-400/60 hover:shadow-red-500/20",
  },
  REFUNDED: {
    icon: RotateCcw,
    iconColor: "#94a3b8",
    iconBg: "rgba(148, 163, 184, 0.15)",
    border: "border-slate-500/20",
    hover: "hover:border-slate-400/60 hover:shadow-slate-500/20",
  },
};

export default function OrderStatusCard({ orderStatusData }: OrderStatusCardProps) {
  return (
    <section className="rounded-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Order Status</h2>
          <p className="text-sm text-slate-400">Monitor order activity</p>
        </div>
      </div>

      {orderStatusData.length === 0 ? (
        <p className="text-sm text-slate-400">No order status data available.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {orderStatusData.map(({ status, count }) => {
            const style = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;
            const Icon = style.icon;
            const title = status.toLowerCase().replaceAll("_", " ");

            return (
              <div
                key={status}
                className={`relative overflow-hidden rounded-2xl border p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.border} ${style.hover}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] capitalize">{title}</p>
                    <p className="mt-2 text-xl font-bold">
                      {count.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="flex size-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: style.iconBg }}
                  >
                    <Icon className="size-5" style={{ color: style.iconColor }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
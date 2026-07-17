"use client";

import { CalendarDays, CircleCheckBig, CreditCard } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface OrderInfoCardProps {
  paymentId: string;
  amount: number;
  estimatedDelivery: string;
}

export default function OrderInfoCard({
  paymentId,
  amount,
  estimatedDelivery,
}: OrderInfoCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="space-y-6 p-6">
        <InfoRow
          icon={
            <CircleCheckBig
              className="h-5 w-5 text-green-600"
              aria-hidden="true"
            />
          }
          label="Payment Status"
          value="Paid"
          valueClassName="text-green-600"
        />

        <InfoRow
          icon={
            <CreditCard
              className="h-5 w-5"
              aria-hidden="true"
            />
          }
          label="Payment ID"
          value={paymentId}
        />

        <InfoRow
          icon={
            <CreditCard
              className="h-5 w-5"
              aria-hidden="true"
            />
          }
          label="Amount Paid"
          value={`₹${amount.toLocaleString("en-IN")}`}
        />

        <InfoRow
          icon={
            <CalendarDays
              className="h-5 w-5"
              aria-hidden="true"
            />
          }
          label="Estimated Delivery"
          value={estimatedDelivery}
        />
      </CardContent>
    </Card>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoRow({
  icon,
  label,
  value,
  valueClassName,
}: InfoRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <p
          className={`mt-1 font-semibold break-all ${valueClassName ?? ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
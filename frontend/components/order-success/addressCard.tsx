"use client";

import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { OrderSuccessAddress } from "@/types/order-success";

interface AddressCardProps {
  address: OrderSuccessAddress;
}

export default function AddressCard({
  address,
}: AddressCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
          Shipping Address
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-1 text-sm leading-6 text-muted-foreground">
        <p className="font-semibold text-foreground">
          {address.fullName}
        </p>

        <p>{address.phone}</p>

        <p>{address.addressLine1}</p>

        {address.addressLine2 && (
          <p>{address.addressLine2}</p>
        )}

        <p>
          {address.city}, {address.state}
        </p>

        <p>{address.postalCode}</p>
      </CardContent>
    </Card>
  );
}
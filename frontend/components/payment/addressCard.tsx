"use client";

import { Address } from "@/types/payment.type";

interface AddressCardProps {
  address: Address;
  title?: string;
  showChangeButton?: boolean;
  onChange?: () => void;
  className?: string;
}

export default function AddressCard({
  address,
  title = "Delivery Address",
  showChangeButton = false,
  onChange,
  className = "",
}: AddressCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl border shadow-sm p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-5">
            📍 {title}
          </h2>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              {address?.fullName}
            </h3>

            <p className="text-sm text-muted-foreground">
              +91 {address?.phone}
            </p>

            <div className="text-sm text-muted-foreground leading-6 mt-3">
              <p>{address?.addressLine1}</p>

              <p>
                {address?.city}, {address?.state}
              </p>

              <p>{address?.postalCode}</p>

              <p>{address?.country}</p>
            </div>
          </div>
        </div>

        {showChangeButton && (
          <button
            type="button"
            onClick={onChange}
            className="text-sm font-medium text-primary hover:underline"
          >
            Change
          </button>
        )}
      </div>
    </div>
  );
}
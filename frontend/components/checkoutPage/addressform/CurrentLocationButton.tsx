"use client";

import { MapPinned } from "lucide-react";
import { toast } from "sonner";
import { UseFormSetValue } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { usecurrentlocation } from "@/hooks/mutations/use-address";
import { CheckoutFormValues } from "../checkout.schema";

import { GEOLOCATION_OPTIONS } from "@/constants/addressForm.constants";
import { applyCurrentLocation } from "@/utils/addressForm.utils";

interface CurrentLocationButtonProps {
  setValue: UseFormSetValue<CheckoutFormValues>;
}

export default function CurrentLocationButton({
  setValue,
}: CurrentLocationButtonProps) {
  const locationMutation = usecurrentlocation();

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const location = await locationMutation.mutateAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          applyCurrentLocation(
            location,
            coords.latitude,
            coords.longitude,
            setValue
          );

          toast.success("Location detected successfully.");
        } catch (error) {
          console.error(error);

          toast.error("Failed to fetch your address.");
        }
      },

      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied.");
            break;

          case error.POSITION_UNAVAILABLE:
            toast.error("Location unavailable.");
            break;

          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;

          default:
            toast.error("Unable to detect your location.");
        }
      },

      GEOLOCATION_OPTIONS
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleUseCurrentLocation}
      disabled={locationMutation.isPending}
    >
      <MapPinned className="mr-2 h-4 w-4" />

      {locationMutation.isPending
        ? "Detecting..."
        : "Use Current Location"}
    </Button>
  );
}
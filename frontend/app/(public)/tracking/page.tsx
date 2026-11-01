// src/app/tracking/page.tsx
"use client";

import { useState } from "react";
import { TrackingSearch } from "@/components/tracking/TrackingSearch";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { useTrackOrder } from "@/hooks/mutations/use-orderTrack";
import { TrackingSkeleton } from "@/components/tracking/TrackingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderDetails } from "@/components/tracking/OderDetails";

export default function TrackingPage() {

  const trackorder = useTrackOrder()

  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<Awaited<ReturnType<typeof trackorder.mutateAsync>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const data = await trackorder.mutateAsync(orderId);
      setTrackingData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(trackingData)





  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. Search Section */}
        <TrackingSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* 2. Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Loading State */}
        {isLoading && <TrackingSkeleton />}

        {/* 4. Success State (Data Render) */}
        <AnimatePresence>
          {trackingData && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Timeline */}
              <div className="bg-card p-6 md:p-8 rounded-xl border shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-center md:text-left">Shipment Progress</h2>
                <TrackingTimeline steps={trackingData?.response?.timeline} />
              </div>

              {/* Order Details */}
              <OrderDetails data={trackingData} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
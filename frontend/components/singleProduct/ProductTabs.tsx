"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type ProductTabsProps = {
  description: string;
  details?: string;
  className?: string;
};

export default function ProductTabs({
  description,
  details,
  className,
}: ProductTabsProps) {
  return (
    <Tabs
      defaultValue="overview"
      className={className}
    >
      {/* Tabs */}
      <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl sm:h-11">
        <TabsTrigger value="overview" className="text-xs sm:text-sm">
          Overview
        </TabsTrigger>

        <TabsTrigger value="details" className="text-xs sm:text-sm">
          Details
        </TabsTrigger>
      </TabsList>

      {/* Overview */}
      <TabsContent
        value="overview"
        className="mt-4 space-y-3 sm:mt-6 sm:space-y-4"
      >
        <div className="rounded-xl border bg-card p-3 sm:rounded-2xl sm:p-5">
          <h3 className="mb-2 text-base font-semibold sm:mb-3 sm:text-lg">
            Product Overview
          </h3>

          <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {description}
          </p>
        </div>
      </TabsContent>

      {/* Details */}
      <TabsContent
        value="details"
        className="mt-4 space-y-3 sm:mt-6 sm:space-y-4"
      >
        <div className="rounded-xl border bg-card p-3 sm:rounded-2xl sm:p-5">
          <h3 className="mb-2 text-base font-semibold sm:mb-3 sm:text-lg">
            Product Details
          </h3>

          {details ? (
            <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {details}
            </p>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Detailed product information will be available soon.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
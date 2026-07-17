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
      <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl">
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>

        <TabsTrigger value="details">
          Details
        </TabsTrigger>
      </TabsList>

      {/* Overview */}
      <TabsContent
        value="overview"
        className="mt-6 space-y-4"
      >
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-3 text-lg font-semibold">
            Product Overview
          </h3>

          <p className="leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
      </TabsContent>

      {/* Details */}
      <TabsContent
        value="details"
        className="mt-6 space-y-4"
      >
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-3 text-lg font-semibold">
            Product Details
          </h3>

          {details ? (
            <p className="leading-7 text-muted-foreground">
              {details}
            </p>
          ) : (
            <p className="leading-7 text-muted-foreground">
              Detailed product information will be available soon.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
import {
  PackageCheck,
  Truck,
  Bell,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STEPS = [
  {
    icon: PackageCheck,
    title: "Order Confirmed",
    description:
      "We've received your order and started processing it.",
  },
  {
    icon: Truck,
    title: "Preparing for Shipment",
    description:
      "Your items will be packed and handed over to the courier.",
  },
  {
    icon: Bell,
    title: "Delivery Updates",
    description:
      "We'll notify you as your order progresses.",
  },
] as const;

export default function NextSteps() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          What happens next?
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {STEPS.map(
          ({
            icon: Icon,
            title,
            description,
          }) => (
            <div
              key={title}
              className="flex items-start gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon
                  aria-hidden="true"
                  className="h-5 w-5 text-primary"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-medium">
                  {title}
                </h3>

                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
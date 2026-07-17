"use client";

import { motion } from "motion/react";
import { ArrowRight, Package } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ACTION_BUTTONS, SUCCESS_MESSAGES } from "@/constants/order-success.constants";

interface SuccessHeroProps {
  orderId: string;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export default function SuccessHero({
  orderId,
  onContinueShopping,
  onViewOrders,
}: SuccessHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="space-y-6 text-center"
    >
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {SUCCESS_MESSAGES.TITLE}
        </h1>

        <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          {SUCCESS_MESSAGES.DESCRIPTION}
        </p>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-4 py-2">
        <Package className="h-4 w-4 text-primary" />

        <span className="text-sm text-muted-foreground">
          Order ID
        </span>

        <span className="font-semibold">
          #{orderId}
        </span>
      </div>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          size="lg"
          onClick={onContinueShopping}
        >
          {ACTION_BUTTONS.CONTINUE_SHOPPING}

          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onViewOrders}
        >
          View Orders
        </Button>
      </div>
    </motion.section>
  );
}
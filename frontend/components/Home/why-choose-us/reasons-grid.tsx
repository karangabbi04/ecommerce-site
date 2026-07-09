"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { fadeUp } from "./motion";
import { ReasonCard } from "./reason-card";
import type { Reason } from "./types";

interface ReasonsGridProps {
  reasons: Reason[];
}

export const ReasonsGrid = memo(function ReasonsGrid({
  reasons,
}: ReasonsGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 p-8 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-10"
    >
      <div
        aria-hidden="true"
        className="absolute right-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl"
      />

      <div className="relative grid gap-6 sm:grid-cols-2">
        {reasons.map((reason, index) => (
          <ReasonCard
            key={reason.id}
            reason={reason}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
});
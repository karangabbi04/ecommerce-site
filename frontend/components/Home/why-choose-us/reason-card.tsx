"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import { fadeUp } from "./motion";
import type { Reason } from "./types";

interface ReasonCardProps {
  reason: Reason;
  index: number;
}

export const ReasonCard = memo(function ReasonCard({
  reason,
  index,
}: ReasonCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      className="rounded-[1.75rem] border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
        {reason.value}
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
        {reason.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-zinc-600">
        {reason.description}
      </p>
    </motion.article>
  );
});
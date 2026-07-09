"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { fadeUp } from "./motion";
import { StatCard } from "./stat-card";

import type { PromiseData } from "./types";

interface PromiseCardProps {
  promise: PromiseData;
}

export const PromiseCard = memo(function PromiseCard({
  promise,
}: PromiseCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{
        once: true,
        amount: 0.35,
      }}
      transition={{
        duration: 0.7,
        delay: 0.1,
      }}
      className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-8 text-white shadow-2xl shadow-zinc-950/20 md:p-10"
    >
      <div
        aria-hidden="true"
        className="absolute left-[-5rem] top-[-5rem] h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-[-5rem] right-[-5rem] h-72 w-72 rounded-full bg-sky-400/20 blur-3xl"
      />

      <div className="relative flex h-full min-h-[28rem] flex-col justify-between">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-xl">
            <Sparkles
              className="h-4 w-4"
              aria-hidden="true"
            />

            {promise.badge}
          </div>

          <h3 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {promise.title}
          </h3>

          <p className="mt-5 text-base leading-7 text-zinc-300">
            {promise.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          {promise.stats.map((stat:any) => (
            <StatCard
              key={stat.id}
              stat={stat}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});
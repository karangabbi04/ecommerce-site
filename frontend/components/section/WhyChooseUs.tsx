"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { reasons } from "@/lib/home-data";

export default function WhyChooseUs() {
  return (
   <section className="relative overflow-hidden py-24 text-zinc-950">
        {/* soft blended background (self-contained) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/80 to-transparent" />
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute bottom-[-12rem] right-[-10rem] h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute top-1/3 left-[-10rem] h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Why Choose Us
            </p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Not factory made. Story made.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              We turn ordinary waste into pieces that feel personal, premium, and kind to the planet.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 p-8 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-10"
            >
              <div className="absolute right-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />

              <div className="relative grid gap-6 sm:grid-cols-2">
                {reasons.map((reason, index) => (
                  <motion.div
                    key={reason.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                    className="rounded-[1.75rem] border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                      {reason.value}
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {reason.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      {reason.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-8 text-white shadow-2xl shadow-zinc-950/20 md:p-10"
            >
              <div className="absolute left-[-5rem] top-[-5rem] h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="absolute bottom-[-5rem] right-[-5rem] h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

              <div className="relative flex h-full min-h-[28rem] flex-col justify-between">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-xl">
                    <Sparkles />
                    Our Promise
                  </div>

                  <h3 className="text-4xl font-semibold tracking-tight md:text-5xl">
                    Beauty with a second life.
                  </h3>
                  <p className="mt-5 text-base leading-7 text-zinc-300">
                    A product should look good, feel good, and do good — without shouting about it.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                    <p className="text-3xl font-semibold">100%</p>
                    <p className="mt-1 text-sm text-zinc-300">recycled glass focus</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                    <p className="text-3xl font-semibold">0</p>
                    <p className="mt-1 text-sm text-zinc-300">two pieces identical</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
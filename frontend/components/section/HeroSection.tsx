"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
   <section className="relative min-h-screen overflow-hidden bg-[#f5f5f7] text-zinc-950">
        <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur-xl"
          >
            <Leaf />
            Sustainable Craft Collection
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-6xl md:text-8xl"
          >
            From Waste
            <span className="block bg-gradient-to-r from-zinc-950 via-zinc-600 to-emerald-500 bg-clip-text text-transparent">
              to Wonder.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 md:text-xl"
          >
            Premium handcrafted glass cups, decor pieces, and lifestyle products made from recycled bottles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
           
              <Link href="/public/products">
               <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3 text-sm font-semibold text-white shadow-xl shadow-zinc-950/15 transition hover:scale-105 hover:bg-zinc-800"
            >
              Explore Collection
              <ArrowRight />
              </button>
              </Link>
            

            <button
              type="button"
              className="rounded-full border border-zinc-300 bg-white/60 px-7 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-xl transition hover:scale-105 hover:bg-white"
            >
              Our Story
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
            className="relative mt-16 w-full max-w-4xl"
          >
            <div className="rounded-[2.5rem] border border-white/80 bg-white/45 p-6 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
                <div className="text-left">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
                    <Sparkles />
                    New Drop
                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Reimagined Glass. Redefined Style.
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-zinc-600 md:text-base">
                    Every product is cut, polished, and finished by hand — giving discarded bottles a second life.
                  </p>
                </div>

                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [0, 1.5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mx-auto flex h-72 w-72 items-center justify-center rounded-[2rem] bg-gradient-to-br from-white via-emerald-50 to-zinc-100 shadow-2xl shadow-emerald-900/10 md:h-96 md:w-96"
                >
                  <div className="absolute inset-8 rounded-[2rem] border border-white/70 bg-white/35 backdrop-blur-xl" />

                  <div className="relative h-56 w-28 rounded-b-[3rem] rounded-t-2xl border border-white/90 bg-gradient-to-br from-emerald-200/50 via-white/50 to-cyan-200/50 shadow-2xl backdrop-blur-md md:h-72 md:w-36">
                    <div className="absolute left-1/2 top-[-3.5rem] h-16 w-14 -translate-x-1/2 rounded-t-xl border border-white/90 bg-emerald-100/60 backdrop-blur-md" />
                    <div className="absolute left-5 top-8 h-32 w-4 rounded-full bg-white/60 blur-sm" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
  );
}
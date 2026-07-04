"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImgCard from "./ImgCard";          
export default function HeroSection() {
  return (
   <section className="relative min-h-screen   text-zinc-950">
        <div className="absolute left-1/2 top-0 w-1/2  h-24 -translate-x-1/2 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute -right-40 top-1/3 w-80 h-64 bg-emerald-100/70 rounded-full blur-3xl" />

        <div
          className="bg-cover bg-center  bg-no-repeat relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 w-full h-fit text-center"

        >
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-[12px] font-medium text-green-700  shadow-sm backdrop-blur-xl md:text-l "
          >
            <Leaf />
            Sustainable Craft Collection
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            // initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-5xl text-2xl font-semibold tracking-tighter text-zinc-950 md:text-6xl "
          >
            From Waste
            <span className="text-black block bg-linear-to-r from-zinc-950 via-zinc-600 to-emerald-500 bg-clip-text ">
              to Wonder.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            // initial={false}

            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-2xl text-l leading-8 text-zinc-600 sm:text-xl"
          >
            Premium handcrafted glass cups, decor pieces, and lifestyle products made from recycled bottles.
          </motion.p>

          <motion.div
            // initial={{ opacity: 0, y: 18 }}
            initial={true}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
           
              <Link href="/products">
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
              className="rounded-full border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-xl transition hover:scale-105 hover:bg-white"
            >
              Our Story
            </button>
          </motion.div>

          <div className=" flex justify-center  w-full bg-gradient-to-b from-[#f5f5f7] via-white to-[#f5f5f7]" />
          <ImgCard/>
        </div>
        
      </section> 
   
  );
}
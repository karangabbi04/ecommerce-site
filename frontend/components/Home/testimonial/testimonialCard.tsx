"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Testimonial } from "./types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  testimonials: Testimonial[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export default function TestimonialCard({
  testimonial,
  testimonials,
  activeIndex,
  onChange,
}: TestimonialCardProps) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={testimonial.name}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.98 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-8 lg:p-12"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-100 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
              ★ {testimonial.rating} / 5.0
            </span>

            <blockquote className="mt-6">
              <p className="text-xl font-semibold leading-relaxed tracking-tight text-zinc-900 sm:text-2xl lg:text-4xl">
                “{testimonial.text}”
              </p>
            </blockquote>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {testimonial.name}
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  {testimonial.role}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {testimonials.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => onChange(index)}
                    aria-label={`Show testimonial by ${item.name}`}
                    aria-current={activeIndex === index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-8 bg-zinc-900"
                        : "w-2 bg-zinc-300 hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
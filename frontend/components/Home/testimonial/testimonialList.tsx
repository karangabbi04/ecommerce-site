"use client";

import type { Testimonial } from "./types";

interface TestimonialListProps {
  testimonials: Testimonial[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export default function TestimonialList({
  testimonials,
  activeIndex,
  onChange,
}: TestimonialListProps) {
  return (
    <>
      {/* Desktop */}

      <div className="hidden space-y-4 lg:block">
        {testimonials.map((item, index) => {
          const active = activeIndex === index;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onChange(index)}
              aria-current={active}
              className={`w-full rounded-3xl border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-zinc-900 bg-white shadow-xl"
                  : "border-zinc-200 bg-white/70 hover:border-zinc-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-zinc-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {item.role}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ★ {item.rating}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile */}

      <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden">
        {testimonials.map((item, index) => {
          const active = activeIndex === index;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onChange(index)}
              aria-current={active}
              className={`flex-shrink-0 rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 ${
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </>
  );
}
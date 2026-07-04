"use client";

import { useState } from "react";

import { testimonials } from "./dummy-data";

import TestimonialCard from "./testimonialCard";
import TestimonialList from "./testimonialList";
import { useAutoPlay } from "./useAutoplay";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { pause, resume, reset } = useAutoPlay({
    activeIndex,
    setActiveIndex,
    length: testimonials.length,
    delay: 3200,
  });

  const handleChange = (index: number) => {
    setActiveIndex(index);
    reset();
  };

  return (
    <section
      aria-labelledby="testimonial-heading"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Background Blur */}

      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-sky-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Testimonials
          </p>

          <h2
            id="testimonial-heading"
            className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-6xl"
          >
            People don't just buy. They remember.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
            Real reactions from people who experienced something different.
          </p>
        </div>

        {/* Content */}

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
          <TestimonialList
            testimonials={testimonials}
            activeIndex={activeIndex}
            onChange={handleChange}
          />

          <div
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <TestimonialCard
              testimonial={testimonials[activeIndex]}
              testimonials={testimonials}
              activeIndex={activeIndex}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
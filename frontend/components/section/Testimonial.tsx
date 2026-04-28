"use client";
import { useState , useEffect} from "react";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/home-data";

interface Props {}

function Testimonial(props: Props) {
      const [activeTestimonial, setActiveTestimonial] = useState(0);

         useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((currentIndex) =>
        currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
      );
    }, 3200);

    return () => window.clearInterval(timer);
  });

  return (
         <section className="relative overflow-hidden py-28">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-8rem] h-80 w-80 rounded-full bg-sky-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Testimonials
            </p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
              People don’t just buy. They remember.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-zinc-600">
              Real reactions from people who experienced something different.
            </p>
          </div>

          <div className="mt-16 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="hidden space-y-4 lg:block">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-full rounded-3xl border p-5 text-left transition ${
                    activeTestimonial === index
                      ? "border-zinc-950 bg-white shadow-xl"
                      : "border-zinc-200 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-zinc-950">{item.name}</p>
                      <p className="text-sm text-zinc-500">{item.role}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      ★ {item.rating}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <motion.div
              key={testimonials[activeTestimonial].name}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/70 p-8 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-12 before:pointer-events-none before:absolute before:inset-y-0 before:left-[-120%] before:z-20 before:w-1/2 before:skew-x-[-18deg] before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent before:transition-all before:duration-700 hover:before:left-[140%]"
            >
              <div className="absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full bg-emerald-100 blur-3xl" />
              <div className="relative">
                <div className="mb-8 inline-flex rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">
                  ★ {testimonials[activeTestimonial].rating} / 5.0
                </div>

                <p className="text-3xl font-semibold leading-tight tracking-tight text-zinc-950 md:text-5xl">
                  “{testimonials[activeTestimonial].text}”
                </p>

                <div className="mt-10 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-zinc-950">
                      {testimonials[activeTestimonial].name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {testimonials.map((item, index) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setActiveTestimonial(index)}
                        className={`h-2 rounded-full transition-all ${
                          activeTestimonial === index
                            ? "w-8 bg-zinc-950"
                            : "w-2 bg-zinc-300"
                        }`}
                        aria-label={`Show testimonial by ${item.name}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
}

export default Testimonial

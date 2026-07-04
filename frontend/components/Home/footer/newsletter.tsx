"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    // TODO:
    // Integrate with:
    // - Resend
    // - Mailchimp
    // - ConvertKit
    // - Supabase
    // - Your Backend API

    console.log("Newsletter Email:", email);

    setEmail("");
  };

  return (
    <div>
      <h4 className="text-lg font-semibold text-white">
        Join our newsletter
      </h4>

      <p className="mt-3 text-sm leading-6 text-zinc-400">
        Get product launches, exclusive offers, and sustainability stories
        delivered straight to your inbox.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6"
      >
        <label
          htmlFor="newsletter-email"
          className="sr-only"
        >
          Email Address
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="newsletter-email"
            type="email"
            value={email}
            required
            autoComplete="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              rounded-full
              border
              border-zinc-700
              bg-white
              px-5
              py-3
              text-sm
              text-zinc-900
              placeholder:text-zinc-500
              outline-none
              transition-all
              duration-300
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-500/20
            "
          />

          <button
            type="submit"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-full
              bg-emerald-500
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-emerald-400
              hover:scale-[1.02]
              active:scale-95
              focus:outline-none
              focus:ring-4
              focus:ring-emerald-500/30
            "
          >
            Subscribe
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Newsletter;
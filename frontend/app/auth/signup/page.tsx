"use client"
import { AuthCard } from "@/components/signup/signup-card";


import { SignupForm } from "@/components/signup/signup-form";

function SparkIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 4 13c0-5 8-9 16-9 0 8-4 16-9 16Z" />
      <path d="M4 13c4 0 7 1 10 4" />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f5f5f7] via-white to-[#f5f5f7] px-6 py-10 text-zinc-950">
      <div className="absolute left-[-12rem] top-20 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute right-[-12rem] bottom-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute left-1/2 top-[-10rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-white blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur-xl">
            <LeafIcon />
            Customer Account
          </div>

          <h1 className="max-w-2xl text-6xl font-semibold tracking-[-0.06em] md:text-7xl">
            Shop pieces with a second life.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            Create your customer account to buy handcrafted recycled-glass products, save your wishlist,
            track orders, and access future offers.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2.25rem] border border-white/80 bg-white/70 p-6 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-8">
         

          <div className="w-full ">
            <AuthCard>

              <SignupForm />

              {/* <AuthFooter /> */}
            </AuthCard>
          </div>
        </div>
      </div>
    </main>
  );
}
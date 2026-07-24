"use client";

import { ReactNode } from "react";
import { Sparkles, ShieldCheck, Truck, MailCheck } from "lucide-react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description: "Your account is protected with email verification.",
  },
  {
    icon: MailCheck,
    title: "OTP Verification",
    description: "Verify your email before creating your account.",
  },
  {
    icon: Truck,
    title: "Track Orders",
    description: "View order history and delivery status anytime.",
  },
];

export function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container mx-auto flex min-h-screen items-center px-4 py-10 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left Section */}
          <section className="hidden flex-col justify-center lg:flex">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" />
              Welcome
            </div>

            <h1 className="text-5xl font-bold tracking-tight">
              {title}
            </h1>

            <p className="mt-5 max-w-lg text-muted-foreground">
              {subtitle}
            </p>

            <div className="mt-10 space-y-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4"
                  >
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="size-5 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {feature.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right Section */}
          <section className="mx-auto flex w-full max-w-md items-center">
            <div className="w-full rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
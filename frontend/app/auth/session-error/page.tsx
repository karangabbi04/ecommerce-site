import Link from "next/link";
import type { Route } from "next";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type SessionErrorPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SessionErrorPage({ searchParams }: SessionErrorPageProps) {
  const { callbackUrl } = await searchParams;
  const retryUrl =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <section className="w-full max-w-md rounded-lg border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold">We couldn&apos;t verify your session</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The authentication service is temporarily unavailable. Your session has not been cleared. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href={retryUrl as Route}>
              <RefreshCw aria-hidden="true" />
              Try again
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/admin-login">Admin login</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

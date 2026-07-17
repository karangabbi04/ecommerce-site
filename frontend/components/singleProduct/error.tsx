"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-xl rounded-3xl shadow-sm">
        <CardContent className="flex flex-col items-center p-10 text-center">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-3xl font-bold tracking-tight">
            Something went wrong
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-md text-muted-foreground">
            We couldn't load this product right now.
            Please try again or return to the previous page.
          </p>

          {/* Actions */}
          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1"
              onClick={reset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Dev Only */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 w-full rounded-xl border bg-muted p-4 text-left">
              <p className="mb-2 text-sm font-semibold">
                Error Message
              </p>

              <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">
                {error.message}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
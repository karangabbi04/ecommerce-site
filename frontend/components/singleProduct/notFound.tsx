"use client";

import Link from "next/link";
import { SearchX, ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-2xl rounded-3xl shadow-sm">
        <CardContent className="flex flex-col items-center p-10 text-center">
          {/* Icon */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <SearchX className="h-12 w-12 text-muted-foreground" />
          </div>

          {/* Error Code */}
          <span className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Error 404
          </span>

          {/* Heading */}
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Product Not Found
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-lg text-muted-foreground">
            The product you're looking for doesn't exist, may have been
            removed, or the link is incorrect.
          </p>

          {/* Actions */}
          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
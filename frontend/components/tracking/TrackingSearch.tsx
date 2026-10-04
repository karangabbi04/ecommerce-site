// src/components/tracking/TrackingSearch.tsx
"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrackingSearchProps {
  onSearch: (orderId: string) => void;
  isLoading: boolean;
}

export function TrackingSearch({ onSearch, isLoading }: TrackingSearchProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-none bg-gradient-to-b from-background to-muted/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
          Track Your Order
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your Order ID to get real-time updates. (Try: <span className="font-mono font-semibold text-primary">ORD-12345</span>)
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g., ORD-12345"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-9 h-11 bg-background"
              disabled={isLoading}
              aria-label="Order ID"
            />
          </div>
          <Button 
            type="submit" 
            className="h-11 px-6 font-semibold" 
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tracking...
              </>
            ) : (
              "Track Order"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";

export default function ProductActions() {
  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
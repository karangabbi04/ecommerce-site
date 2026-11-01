// components/auth/auth-loader.tsx

import { Loader2 } from "lucide-react";

export function AuthLoader() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="size-4 animate-spin" />
      <span>Creating Account...</span>
    </div>
  );
}
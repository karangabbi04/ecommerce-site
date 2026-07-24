// components/auth/password-input.tsx

"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function PasswordInput({
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`pr-12 ${className ?? ""}`}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        tabIndex={-1}
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-1 top-1 h-8 w-8"
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>
    </div>
  );
}
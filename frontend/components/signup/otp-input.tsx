// components/shared/otp/otp-input.tsx

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
};

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
  className,
}: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const values = React.useMemo(() => {
    const chars = value.split("");

    return Array.from({ length }, (_, index) => chars[index] ?? "");
  }, [value, length]);

  React.useEffect(() => {
    if (!autoFocus) return;

    inputRefs.current[0]?.focus();
  }, [autoFocus]);

  function updateValue(index: number, digit: string) {
    const next = [...values];

    next[index] = digit;

    onChange(next.join(""));
  }

  function handleChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const input = e.target.value;

    if (!input) {
      updateValue(index, "");
      return;
    }

    const digit = input.replace(/\D/g, "").slice(-1);

    if (!digit) return;

    updateValue(index, digit);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    switch (e.key) {
      case "Backspace":
        if (values[index]) {
          updateValue(index, "");
          return;
        }

        if (index > 0) {
          inputRefs.current[index - 1]?.focus();

          updateValue(index - 1, "");
        }

        break;

      case "ArrowLeft":
        e.preventDefault();

        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }

        break;

      case "ArrowRight":
        e.preventDefault();

        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }

        break;
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    onChange(pasted);

    const nextFocus = Math.min(pasted.length, length - 1);

    inputRefs.current[nextFocus]?.focus();
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2",
        className
      )}
    >
      {values.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-12 rounded-lg border bg-background text-center text-lg font-semibold outline-none transition",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      ))}
    </div>
  );
}
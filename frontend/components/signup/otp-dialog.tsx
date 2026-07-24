// components/shared/otp/otp-dialog.tsx

"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Loader2, Mail } from "lucide-react";

import { OtpInput } from "./otp-input";

type OtpDialogProps = {
  open: boolean;
  email: string;

  isLoading?: boolean;

  onOpenChange: (open: boolean) => void;

  onVerify: (otp: string) => Promise<void> | void;

  onResend?: () => Promise<void> | void;
};

const RESEND_TIME = 30;

export function OtpDialog({
  open,
  email,
  isLoading = false,
  onOpenChange,
  onVerify,
  onResend,
}: OtpDialogProps) {
  const [otp, setOtp] = React.useState("");
  const [timer, setTimer] = React.useState(RESEND_TIME);

  React.useEffect(() => {
    if (!open) {
      setOtp("");
      setTimer(RESEND_TIME);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  async function handleVerify() {
    if (otp.length !== 6) return;

    await onVerify(otp);
  }

  async function handleResend() {
    if (timer !== 0) return;

    await onResend?.();

    setOtp("");
    setTimer(RESEND_TIME);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="sm:max-w-md h-[440px] p-4 shadow-0"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>

          <DialogTitle className="text-center text-2xl">
            Verify Email
          </DialogTitle>

          <DialogDescription className="space-y-1 text-center">
            <span className="block">
              Enter the 6-digit verification code sent to
            </span>

            <span className="font-medium text-foreground">
              {email}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
          />

          <Button
            className="w-full py-5"
            onClick={handleVerify}
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <div className="text-center text-sm">
            {timer > 0 ? (
              <p className="text-muted-foreground">
                Resend OTP in{" "}
                <span className="font-semibold">
                  {timer}s
                </span>
              </p>
            ) : (
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={handleResend}
              >
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
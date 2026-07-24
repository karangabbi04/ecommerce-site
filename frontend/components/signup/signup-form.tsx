// components/auth/signup-form.tsx

"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { PasswordInput } from "./password-input";
import {  SignupSchema,signupSchema } from "@/validations/signup.validation";


import { useSignup, useverifySignup } from "@/hooks/mutations/use-signup";
import { OtpDialog } from "./otp-dialog";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { ImportIcon } from "lucide-react";
import { VerifyOtpRequest } from "@/types/signup.types";

export function SignupForm() {
    //   const router = useRouter();
  const [otpOpen, setOtpOpen] = React.useState(true);
    const [email, setEmail] = React.useState("");

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
    },

    mode: "onTouched",
    
  });


  const { mutateAsync: signup, isPending: isSendingOtp } = useSignup();

  async function onSubmit(values: SignupSchema) {
    try {
      await signup(values);
      toast.success("Account created successfully.");
      setEmail(values.email);
      setOtpOpen(true)
      form.reset();
    //   router.replace("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const  verifySignup = useverifySignup();

  async function handleVerify(otp: string) {
    // Implement OTP verification logic using stored email
    try {
      await verifySignup.mutateAsync({ otp, email });
      toast.success("Account created successfully.");
    //   router.push("/login")
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleResend() {
    // Implement OTP resend logic
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <PasswordInput
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full py-6"
            disabled={isSendingOtp}
          >
            {isSendingOtp
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </form>
      </Form>

      <OtpDialog
        open={otpOpen}
        email={email}
        // isLoading={isVerifyingOtp}
        onOpenChange={setOtpOpen}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </>
  );
}
"use client";

import { signupService } from "@/services/signup.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { useMutation } from "@tanstack/react-query";

type SignupForm = {
  name: string;
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      className="h-5 w-5 text-emerald-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 4 13c0-5 8-9 16-9 0 8-4 16-9 16Z" />
      <path d="M4 13c4 0 7 1 10 4" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
    </svg>
  );
}

export default function CustomerSignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  };

  const getNormalizedEmail = () => {
    return form.email.toLowerCase().trim();
  };

  const createAccountMutation = useMutation({
    mutationFn: signupService.createAccount,

    onError: (error) => {
      console.error("Account creation error:", error);
      alert(getErrorMessage(error, "Account creation failed. Please try again."));
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: signupService.sendOTP,

    onSuccess: () => {
      setForm((prev) => ({
        ...prev,
        otp: "",
      }));

      setShowOtpModal(true);
      setSuccessMessage("Account created successfully. OTP sent to your email.");
    },

    onError: (error) => {
      console.error("Send OTP error:", error);
      alert(getErrorMessage(error, "Failed to send OTP. Please try again."));
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: signupService.verifyOTP,

    onError: (error) => {
      console.error("OTP verification error:", error);
      setOtpError(getErrorMessage(error, "OTP verification failed. Please try again."));
    },
  });

  const loginMutation = useMutation({
    mutationFn: signupService.LogIn,

    onSuccess: (loginResponse: any) => {
      console.log("Login response:", loginResponse);

      const user =
        loginResponse?.data?.user ||
        loginResponse?.user ||
        loginResponse?.data;

      if (!user) {
        throw new Error("Login successful but user data missing in response");
      }

      setUser(user);

      setShowOtpModal(false);
      setSuccessMessage("Congratulations! Your account has been verified successfully.");

      router.push("/");
    },

    onError: (error) => {
      console.error("Login error:", error);
      setOtpError(getErrorMessage(error, "OTP verified but login failed. Please login manually."));
    },
  });

  const isCreatingAccount = createAccountMutation.isPending;
  const isSendingOtp = sendOtpMutation.isPending;
  const isVerifyingOtp = verifyOtpMutation.isPending || loginMutation.isPending;

  const isMainButtonLoading = isCreatingAccount || isSendingOtp;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateSignupForm = () => {
    if (!form.name.trim()) {
      alert("Name is required");
      return false;
    }

    if (!form.email.trim()) {
      alert("Email is required");
      return false;
    }

    if (form.password.length < 6) {
      alert("Password should be at least 6 characters");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    if (!form.agree) {
      alert("Please accept the terms before creating your account");
      return false;
    }

    return true;
  };

  const sendOtpAndOpenModal = async () => {
    setOtpError("");
    setSuccessMessage("");

    await sendOtpMutation.mutateAsync({
      email: getNormalizedEmail(),
    });
  };

  const handleCreateAccount = async () => {
    setOtpError("");
    setSuccessMessage("");

    await createAccountMutation.mutateAsync({
      name: form.name.trim(),
      email: getNormalizedEmail(),
      password: form.password,
    });

    await sendOtpAndOpenModal();
  };

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateSignupForm()) return;

    try {
      await handleCreateAccount();
    } catch {
        console.log("lfsdsjflksfklsfklds")
    }
  };

  const verifyOtpAndRedirect = async () => {
    if (!form.otp.trim()) {
      setOtpError("Please enter OTP");
      return;
    }

    if (form.otp.trim().length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      setOtpError("");

      const normalizedEmail = getNormalizedEmail();

      const verifyResponse = await verifyOtpMutation.mutateAsync({
        email: normalizedEmail,
        otp: form.otp.trim(),
      });

      console.log("OTP verify response:", verifyResponse);

      await loginMutation.mutateAsync({
        email: normalizedEmail,
        password: form.password,
      });
    } catch {
      // Error already handled inside React Query onError
    }
  };

  const handleGoogleSignup = () => {
    alert("Google signup will be connected later");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f5f5f7] via-white to-[#f5f5f7] px-6 py-10 text-zinc-950">
      <div className="absolute left-[-12rem] top-20 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute right-[-12rem] bottom-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute left-1/2 top-[-10rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-white blur-3xl" />

      <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur-xl">
            <LeafIcon />
            Customer Account
          </div>

          <h1 className="max-w-2xl text-6xl font-semibold tracking-[-0.06em] md:text-7xl">
            Shop pieces with a second life.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            Create your customer account to buy handcrafted recycled-glass products, save your wishlist,
            track orders, and access future offers.
          </p>

          <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-3xl font-semibold">OTP</p>
              <p className="mt-1 text-sm text-zinc-500">email verification after account creation</p>
            </div>

            <div className="rounded-[1.75rem] border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-3xl font-semibold">0</p>
              <p className="mt-1 text-sm text-zinc-500">seller tools here</p>
            </div>
          </div>

          <div className="mt-10 rounded-[2.5rem] border border-white/80 bg-white/45 p-8 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white">
                <SparkIcon />
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Built for buyers.</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Users fill their details first, account gets created, then email verification happens
                  through an OTP popup.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2.25rem] border border-white/80 bg-white/70 p-6 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-8">
          <div className="text-center lg:text-left">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white lg:mx-0">
              <SparkIcon />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Join VetriGlass
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Fill your details. OTP verification opens after your account is created.
            </p>
          </div>

          {successMessage ? (
            <p className="mt-5 rounded-2xl bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isMainButtonLoading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:scale-[1.01] hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              or
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={isMainButtonLoading}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isMainButtonLoading}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                disabled={isMainButtonLoading}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                disabled={isMainButtonLoading}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                disabled={isMainButtonLoading}
                className="mt-1 h-4 w-4 accent-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span>
                I agree to create a customer account for shopping, order tracking, and product updates.
              </span>
            </label>

            <button
              type="submit"
              disabled={isMainButtonLoading}
              className="w-full rounded-full bg-zinc-950 py-4 text-sm font-semibold text-white shadow-xl shadow-zinc-950/15 transition hover:scale-[1.01] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingAccount
                ? "Creating account..."
                : isSendingOtp
                ? "Sending OTP..."
                : "Create customer account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <button
              type="button"
              disabled={isMainButtonLoading}
              // onClick={() => router.push("/login")}
              className="font-semibold text-zinc-950 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign in
            </button>
          </p>
        </div>
      </section>

      {showOtpModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 shadow-2xl md:p-8">
            <div className="absolute right-[-6rem] top-[-6rem] h-64 w-64 rounded-full bg-emerald-200/50 blur-3xl" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                <SparkIcon />
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
                  Verify Email
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                  Enter OTP
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  We sent a 6-digit OTP to{" "}
                  <span className="font-semibold text-zinc-950">{form.email}</span>
                </p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                name="otp"
                maxLength={6}
                value={form.otp}
                onChange={(event) => {
                  setOtpError("");

                  const onlyNumbers = event.target.value.replace(/\D/g, "");

                  setForm((prev) => ({
                    ...prev,
                    otp: onlyNumbers,
                  }));
                }}
                placeholder="000000"
                disabled={isVerifyingOtp}
                className="mt-6 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none transition focus:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {otpError ? (
                <p className="mt-3 text-center text-sm font-medium text-red-500">
                  {otpError}
                </p>
              ) : null}

              <button
                type="button"
                onClick={verifyOtpAndRedirect}
                disabled={isVerifyingOtp}
                className="mt-5 w-full rounded-full bg-zinc-950 py-4 text-sm font-semibold text-white shadow-xl shadow-zinc-950/15 transition hover:scale-[1.01] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
              </button>

              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={sendOtpAndOpenModal}
                  disabled={isSendingOtp || isVerifyingOtp}
                  className="font-semibold text-zinc-950 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingOtp ? "Sending..." : "Resend OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  disabled={isVerifyingOtp}
                  className="text-zinc-500 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Change details
                </button>
              </div>

              <p className="mt-5 rounded-2xl bg-emerald-50 p-3 text-center text-xs text-emerald-700">
                Enter the OTP sent to your email. Do not share this code with anyone.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
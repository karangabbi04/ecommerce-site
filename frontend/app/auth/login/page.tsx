"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/mutations/use-login";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.1-5.9" />
      <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.2 3.1" />
      <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.44 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export default function LoginPage() {
    const loginMutation=useLogin();
    const router = useRouter();

     const setUser = useAuthStore((state) => state.setUser);
     const user = useAuthStore((state)=> state.user)
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.email.trim()) {
      alert("Email is required");
      console.log("email is required")
      return;
    }

    if (!form.password.trim()) {
      alert("Password is required");
      return;
    }

    try {
      setIsSubmitting(true);
            const response = await loginMutation.mutateAsync({
                email: form.email.toLowerCase().trim(),
                 password: form.password,
            }) as any;

            console.log("login response",response)

             const user =
        response?.data?.user ||
        response?.user ||
        response?.data;

      if (!user) {
        throw new Error("Login successful but user data missing");
      }

      setUser(user);

      router.push("/");

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(user?.name)

  

  const handleGoogleLogin = () => {
    alert("Google login demo. Connect this with your auth provider later.");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f7] px-6 py-12 text-zinc-950">
      {/* soft background glow */}
      <div className="absolute left-[-7rem] top-20 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="absolute right-[-9rem] bottom-16 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute left-1/2 top-[-12rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-white blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-white/65 p-7 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl sm:p-8"
      >
        {/* brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-xl font-bold text-white shadow-xl shadow-zinc-950/20">
            V
          </div>

          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            VetriGlass
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Sign in to manage your products, collections, and handcrafted store experience.
          </p>

          <p className="mt-2 text-xs font-medium text-zinc-500">
            Crafted beautifully. Managed effortlessly.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-full border border-white/80 bg-white/80 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:scale-[1.01] hover:bg-white"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs font-medium text-zinc-400">or sign in with email</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-zinc-800">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            className="w-full rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white focus:shadow-lg focus:shadow-zinc-900/5"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-zinc-800">
            Password
          </label>
          <div className="flex items-center rounded-xl border border-white/70 bg-white/80 pr-3 transition focus-within:border-zinc-950 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-zinc-900/5">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-zinc-600">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 accent-zinc-950"
            />
            Remember me
          </label>

          <button
            type="button"
            className="font-semibold text-zinc-900 transition hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-zinc-950 py-3.5 text-sm font-semibold text-white shadow-xl shadow-zinc-950/15 transition hover:scale-[1.01] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}

"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OtpDialog } from "@/components/signup/otp-dialog";

export default function AdminLogin() {
  const router = useRouter();
  
  // States for Login Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // States for OTP Dialog
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus OTP input when dialog opens
  useEffect(() => {
    if (isOtpDialogOpen && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [isOtpDialogOpen]);

  // 1. Handle Email/Password Login
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Basic Validation
    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }

    setIsLoginLoading(true);

    try {
      // TODO: Yahan apna actual API call lagana (e.g., axios or fetch)
      // const response = await fetch('/api/admin/login', { ... })
      
      // Mock API call (Replace with actual logic)
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      
      // Agar credentials sahi hain, to OTP dialog open karo
      // (Backend se OTP send karne ka logic yahan trigger hoga)
      setIsOtpDialogOpen(true);
    } catch (error) {
      setLoginError("Invalid credentials. Please try again.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  // 2. Handle OTP Verification
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLoginSubmit}>
          <CardContent className="space-y-4">
            {loginError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {loginError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoginLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoginLoading}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoginLoading}
            >
              {isLoginLoading ? "Authenticating..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* OTP Verification Dialog / Popup */}
      
      <OtpDialog
              open={isOtpDialogOpen}
              email={email}
              // isLoading={isVerifyingOtp}
              onOpenChange={setIsOtpDialogOpen}
              onVerify={handleVerify}
              onResend={handleResend}
            />
    </div>
  );
}
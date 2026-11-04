"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
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

import { OtpDialog } from "@/components/signup/otp-dialog";
import {
  useAdminLogin,
  useAdminLoginVerify,
} from "@/hooks/mutations/use-admin-signup";

export default function AdminLogin() {
  const router = useRouter();
  const loginMutation = useAdminLogin();
  const verifyMutation = useAdminLoginVerify();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      setIsOtpDialogOpen(true);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Unable to log in. Please try again.",
      );
    }
  };

  async function handleVerify(otp: string) {
    try {
      await verifyMutation.mutateAsync({ email, otp });
      toast.success("Admin login verified successfully.");
      setIsOtpDialogOpen(false);
      router.replace("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "OTP verification failed.",
      );
    }
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
                disabled={loginMutation.isPending}
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
                disabled={loginMutation.isPending}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Authenticating..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* OTP Verification Dialog / Popup */}
      
      <OtpDialog
              open={isOtpDialogOpen}
              email={email}
              isLoading={verifyMutation.isPending}
              onOpenChange={setIsOtpDialogOpen}
              onVerify={handleVerify}
            />
    </div>
  );
}
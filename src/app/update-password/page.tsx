"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { validateResetPasswordData } from "@/utils/validation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, loading } = useAuth();

  // Check for reset tokens in URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  // Handle authentication from reset tokens
  useEffect(() => {
    const authenticateFromTokens = async () => {
      if (
        accessToken &&
        refreshToken &&
        type === "recovery" &&
        !isLoggedIn &&
        !isAuthenticating
      ) {
        setIsAuthenticating(true);
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Authentication error:", error);
            setMessage({
              type: "error",
              message:
                "Invalid or expired reset link. Please request a new one.",
            });
            setTimeout(() => router.push("/reset-password"), 3000);
          }
        } catch (error) {
          console.error("Authentication error:", error);
          setMessage({
            type: "error",
            message: "Invalid or expired reset link. Please request a new one.",
          });
          setTimeout(() => router.push("/reset-password"), 3000);
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    authenticateFromTokens();
  }, [accessToken, refreshToken, type, isLoggedIn, isAuthenticating, router]);

  // Redirect if not logged in and no tokens to authenticate with
  useEffect(() => {
    if (!loading && !isLoggedIn && !accessToken && !refreshToken) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router, accessToken, refreshToken]);

  // Show loading while checking auth status or authenticating
  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isAuthenticating ? "Authenticating..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not logged in and no tokens to authenticate with
  if (!isLoggedIn && !accessToken && !refreshToken) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateResetPasswordData({ password, confirmPassword });
    if (!validation.isValid) {
      setMessage({ type: "error", message: validation.error! });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage({ type: "error", message: error.message });
      } else {
        setMessage({
          type: "success",
          message: "Password reset successfully! Redirecting to dashboard...",
        });

        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Password update error:", error);
      setMessage({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Update Your Password
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {message && message.type === "error" && (
              <div className="p-3 rounded-md text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                {message.message}
              </div>
            )}

            {message && message.type === "success" && (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 p-2 bg-green-50 dark:bg-green-900/10 rounded-md">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                    Password reset successfully, redirecting...
                  </span>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => router.push("/")}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                  >
                    Click here if not redirected automatically
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Back to Dashboard
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

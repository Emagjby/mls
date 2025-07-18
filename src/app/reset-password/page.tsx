"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import { createClient } from "@/utils/supabase/client";
import { validateEmail } from "@/utils/validation";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if this page was accessed with reset tokens
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  // If tokens are present, redirect to update-password
  useEffect(() => {
    if (accessToken && refreshToken && type === "recovery") {
      const updatePasswordUrl = `/update-password?access_token=${accessToken}&refresh_token=${refreshToken}&type=${type}`;
      router.replace(updatePasswordUrl);
    }
  }, [accessToken, refreshToken, type, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setMessage({ type: "error", message: emailValidation.error! });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setMessage({ type: "error", message: error.message });
      } else {
        setMessage({
          type: "success",
          message:
            "Password reset email sent! Check your inbox and spam folder.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Reset password error:", error);
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
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Reset Your Password
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {message && message.type === "error" && (
              <div className="p-3 rounded-md text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                {message.message}
              </div>
            )}

            {message && message.type === "success" && (
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
                  Password reset email sent! Check your inbox and spam folder.
                </span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending Reset Email..." : "Send Reset Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

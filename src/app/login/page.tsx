"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import { createClient } from "@/utils/supabase/client";
import { logSessionInfo } from "@/utils/supabase/client-logger";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    logSessionInfo();
  }, []);

  // Redirect logged-in users to home page
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, loading, router]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is already logged in
  if (isLoggedIn) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrors({});

    try {
      const supabase = createClient();

      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const { error } = await supabase.auth.signInWithPassword(data);

      if (error) {
        setErrors({ general: error.message });
        setIsLoading(false);
        return;
      }

      // Successful login - show redirecting message
      setIsLoading(false);
      setIsRedirecting(true);

      // Redirect to home after a short delay to show the message
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "An unexpected error occurred" });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Welcome back to MLS Framework
            </p>
          </div>

          <form className="space-y-4">
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              onChange={handleChange}
              error={errors.password}
            />

            {errors.general && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            {isRedirecting && (
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
                    Login successful, redirecting...
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || isRedirecting}
              formAction={handleSubmit}
            >
              {isLoading
                ? "Signing In..."
                : isRedirecting
                  ? "Redirecting..."
                  : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

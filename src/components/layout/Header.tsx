"use client";

import React from "react";
import Link from "next/link";
import Button from "../ui/Button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "../ui/ThemeToggle";

export default function Header() {
  const supabase = createClient();
  const router = useRouter();

  const { isLoggedIn, loading, refreshAuth } = useAuth();

  async function signOut() {
    try {
      console.log("🔍 Starting logout process...");

      // First, sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("❌ Logout error:", error);
        return;
      }

      console.log("✅ Supabase logout successful");

      // Force refresh the auth state
      await refreshAuth();

      // Wait a bit to ensure the auth state has updated
      await new Promise((resolve) => setTimeout(resolve, 200));

      console.log("✅ Auth state refreshed, redirecting to login...");
      router.push("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              MLS Framework
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Profile
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && !loading && <ThemeToggle />}
            {!isLoggedIn && !loading && (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
            {!isLoggedIn && !loading && (
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            )}
            {isLoggedIn && !loading && (
              <Button variant="primary" size="sm" onClick={() => signOut()}>
                Log Out
              </Button>
            )}
            {loading && (
              <div className="flex items-center space-x-4">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

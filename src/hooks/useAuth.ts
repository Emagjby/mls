"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { checkUserAuth, type AuthResult } from "@/utils/auth/user";

// Simple singleton to manage auth state
class AuthManager {
  private static instance: AuthManager;
  private authState: AuthResult = {
    isLoggedIn: false,
    user: null,
    session: null,
  };
  private loading = true;
  private listeners: Set<(state: AuthResult, loading: boolean) => void> =
    new Set();
  private initialized = false;
  private subscription: { unsubscribe: () => void } | null = null;

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) =>
      listener(this.authState, this.loading),
    );
  }

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    const supabase = createClient();

    // Initial auth check
    try {
      const result = await checkUserAuth();
      this.authState = result;
      this.loading = false;
      this.notifyListeners();
    } catch (error) {
      console.error("Auth check failed:", error);
      this.authState = { isLoggedIn: false, user: null, session: null };
      this.loading = false;
      this.notifyListeners();
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // User signed in or token refreshed
        const result = await checkUserAuth();
        this.authState = result;
        this.loading = false;
        this.notifyListeners();
      } else if (event === "SIGNED_OUT") {
        // User signed out
        this.authState = { isLoggedIn: false, user: null, session: null };
        this.loading = false;
        this.notifyListeners();
      }
    });

    this.subscription = subscription;

    // Cleanup subscription on page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      });
    }
  }

  subscribe(listener: (state: AuthResult, loading: boolean) => void) {
    this.listeners.add(listener);
    // Immediately notify with current state
    listener(this.authState, this.loading);

    return () => {
      this.listeners.delete(listener);
    };
  }

  async refreshAuth() {
    this.loading = true;
    this.notifyListeners();

    try {
      const result = await checkUserAuth();
      this.authState = result;
      this.loading = false;
      this.notifyListeners();
    } catch (error) {
      console.error("Auth refresh failed:", error);
      this.authState = { isLoggedIn: false, user: null, session: null };
      this.loading = false;
      this.notifyListeners();
    }
  }

  getCurrentState() {
    return { ...this.authState, loading: this.loading };
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthResult>({
    isLoggedIn: false,
    user: null,
    session: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authManager = AuthManager.getInstance();

    // Initialize auth
    authManager.initialize();

    // Subscribe to auth changes
    const unsubscribe = authManager.subscribe((state, loadingState) => {
      setAuthState(state);
      setLoading(loadingState);
    });

    return unsubscribe;
  }, []);

  const refreshAuth = async () => {
    const authManager = AuthManager.getInstance();
    await authManager.refreshAuth();
  };

  return {
    ...authState,
    loading,
    refreshAuth,
  };
}

// Shorthand hooks for specific use cases
export function useUser() {
  const { user, loading } = useAuth();
  return { user, loading };
}

export function useIsLoggedIn() {
  const { isLoggedIn, loading } = useAuth();
  return { isLoggedIn, loading };
}

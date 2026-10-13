"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastProvider";

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  display_name: string;
  phone?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Try restoring from localStorage instantly
    const cached = localStorage.getItem("shopzen_user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem("shopzen_user");
      }
    }

    // 2. Validate with backend /api/auth/me
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          localStorage.setItem("shopzen_user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("shopzen_user");
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.customer) {
        setUser(data.customer);
        localStorage.setItem("shopzen_user", JSON.stringify(data.customer));
        showToast(`Welcome back, ${data.customer.first_name || "Friend"}!`, "success");
        return true;
      } else {
        showToast(data.message || "Invalid credentials", "error");
        return false;
      }
    } catch {
      showToast("Network error. Please try again.", "error");
      return false;
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    localStorage.removeItem("shopzen_user");
    showToast("Signed out successfully", "info");
    router.push("/");
  }

  function updateUser(updatedData: Partial<User>) {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedData };
      localStorage.setItem("shopzen_user", JSON.stringify(merged));
      return merged;
    });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { showToast } from "@/components/ToastProvider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        showToast("Password reset instructions dispatched!", "success");
      } else {
        showToast(data.message || "Failed to process request", "error");
      }
    } catch {
      showToast("Network error. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text">ShopZen</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-6 mb-1">Reset your password</h1>
          <p className="text-gray-500 text-sm">
            We&apos;ll send you instructions to recover your account
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          {submitted ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-xs">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  If an account exists with <strong className="text-gray-800">{email}</strong>, you will receive an email with reset instructions shortly.
                </p>
              </div>

              <div className="bg-indigo-50/60 rounded-2xl p-4 text-xs text-indigo-900 text-left space-y-1.5 border border-indigo-100">
                <div className="font-semibold flex items-center gap-1.5">
                  <span>💡</span> Can&apos;t find the email?
                </div>
                <p className="text-indigo-700/80 leading-normal">
                  Check your spam/junk folder, or make sure the email matches your registered ShopZen account.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-2xl transition-colors border border-gray-200"
                >
                  Try another email address
                </button>
                <Link
                  href="/login"
                  className="block w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-2xl transition-colors shadow-xs"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white"
                  />
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 font-bold rounded-2xl text-white transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Sending Instructions...
                  </>
                ) : (
                  "Send Reset Link →"
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Remember password? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

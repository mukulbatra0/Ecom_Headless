"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-sm text-center">
        {/* Warning Icon */}
        <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-xs">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          An unexpected error occurred while loading this page. Our engineers have been alerted.
        </p>

        {error.digest && (
          <div className="mb-6 p-2.5 bg-gray-50 rounded-xl text-[11px] font-mono text-slate-500 border border-gray-200 truncate">
            Error ID: {error.digest}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-slate-800 text-xs font-semibold rounded-full transition-colors border border-gray-200 flex items-center justify-center gap-2"
          >
            <span>Return to Homepage</span>
          </Link>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100 text-xs text-slate-400">
          Need immediate assistance?{" "}
          <Link href="/contact" className="text-indigo-600 hover:underline font-semibold">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

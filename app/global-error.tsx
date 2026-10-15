"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Application Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Error</h2>
          <p className="text-xs text-gray-500 mb-6">
            A critical error interrupted the application layout. Please reload or click reset below.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-colors shadow-xs"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}

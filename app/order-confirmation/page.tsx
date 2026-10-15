"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderConfirmationIndexPage() {
  const router = useRouter();
  const [orderInput, setOrderInput] = useState("");

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (orderInput.trim()) {
      router.push(`/order-confirmation/${orderInput.trim()}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
          📦
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmation</h1>
        <p className="text-sm text-gray-500 mb-6">
          Looking for your order receipt or confirmation? Enter your order number below or visit your account orders.
        </p>

        <form onSubmit={handleLookup} className="space-y-4 mb-6">
          <input
            type="text"
            required
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            placeholder="Enter Order ID (e.g. 1045)"
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-2xl transition-colors shadow-xs"
          >
            Find Order Confirmation →
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
          <Link href="/account/orders" className="text-indigo-600 font-semibold hover:underline">
            View My Orders
          </Link>
          <Link href="/products" className="text-slate-500 hover:text-slate-900 font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

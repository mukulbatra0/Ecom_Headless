"use client";

import Link from "next/link";
import { useState } from "react";
import { showToast } from "@/components/ToastProvider";

export default function ReturnsPage() {
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleReturnRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) {
      showToast("Please enter your Order ID", "error");
      return;
    }
    setSubmitted(true);
    showToast("Return request submitted! Our support team will contact you.", "success");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-slate-50 border-b border-gray-100 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Hassle-Free Returns
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Returns &amp; Refunds Policy
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We want you to love everything you buy from ShopZen. If you are not 100% satisfied, we make returns straightforward and stress-free.
          </p>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f8fafc] border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              🗓️
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">7 Days Window</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Initiate a return within 7 calendar days of doorstep delivery for any reason.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f8fafc] border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              🚚
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Free Doorstep Pickup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our courier partners collect the package right from your doorstep at zero cost.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f8fafc] border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚡
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Fast Direct Refunds</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Refunds are credited back to your original payment method within 3-5 business days.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-16 bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center">
            How Does the Return Process Work?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-400/30">
                1
              </div>
              <h4 className="font-bold text-base">Submit Return Request</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your order number below or click &quot;Return Item&quot; inside your order details page.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-400/30">
                2
              </div>
              <h4 className="font-bold text-base">Handover to Courier</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep the product packed with original brand tags intact. Our courier agent will verify and pick it up.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-400/30">
                3
              </div>
              <h4 className="font-bold text-base">Instant Credit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                As soon as the item passes inspection, your refund is instantly initiated to your bank or UPI.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Return Request Form */}
        <div className="mt-16 max-w-xl mx-auto bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Request a Return or Replacement</h3>
            <p className="text-xs text-slate-500 mt-1">
              Have an order ready to return? Fill in the details to generate a return pickup ticket.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h4 className="font-bold text-slate-900">Return Ticket Created</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We have registered your return request for Order #{orderId}. Our logistics executive will coordinate pickup within 24-48 hours.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/account/orders"
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-full"
                >
                  View My Orders
                </Link>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setOrderId(""); setReason(""); }}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-slate-700 text-xs font-semibold rounded-full"
                >
                  New Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReturnRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Order ID / Number
                </label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. 1045 or OD003547"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reason for Return
                </label>
                <select
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select a reason</option>
                  <option value="size">Size/fit issue</option>
                  <option value="damaged">Product arrived damaged or defective</option>
                  <option value="wrong_item">Received incorrect item</option>
                  <option value="not_as_described">Item does not match website pictures</option>
                  <option value="other">Changed mind / Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors shadow-xs"
              >
                Submit Return Request →
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/contact"
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Need live assistance? Contact customer support
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

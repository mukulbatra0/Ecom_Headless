"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl text-center">
          {/* Checkmark Animation */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping-slow opacity-50" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-6">
            Thank you for shopping with <span className="font-bold text-indigo-600">ShopZen</span>!
            Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Details */}
          <div className="bg-indigo-50 rounded-2xl p-6 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order Number</span>
              <span className="font-bold text-gray-900">#{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated Delivery</span>
              <span className="font-bold text-emerald-600">5-7 Business Days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-indigo-600">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                Processing
              </span>
            </div>
          </div>

          {/* What happens next */}
          <div className="text-left mb-8">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">What happens next?</h3>
            <div className="space-y-3">
              {[
                { icon: "📧", text: "Order confirmation email sent to your registered email" },
                { icon: "📦", text: "Your order will be packed within 24 hours" },
                { icon: "🚚", text: "Tracking details will be shared via SMS & email" },
                { icon: "🏠", text: "Delivery within 5-7 business days" },
              ].map((step) => (
                <div key={step.text} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{step.icon}</span>
                  <p className="text-sm text-gray-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/account/orders`}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-indigo-200 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
              Track Order
            </Link>
            <Link
              href="/products"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
            >
              Continue Shopping
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>

        {/* Help */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Need help?{" "}
          <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface TrackingItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState("OD003547");
  const [searched, setSearched] = useState(true);

  const orderData = {
    id: "OD003547",
    date: "12 Oct 2026",
    status: "Out for Delivery",
    courier: "Delhivery Express",
    trackingId: "DEL9876543210",
    estimatedDelivery: "14 Oct 2026, by 8:00 PM",
    steps: [
      { label: "Order Placed", date: "12 Oct, 10:30 AM", completed: true },
      { label: "Shipped", date: "13 Oct, 02:15 PM", completed: true },
      { label: "Out for Delivery", date: "14 Oct, 09:00 AM", completed: true, active: true },
      { label: "Delivered", date: "Expected Today", completed: false },
    ],
    items: [
      {
        id: 1,
        name: "iPhone 15 (128GB) - Blue",
        price: "79,900",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80",
      },
      {
        id: 2,
        name: "Nike Running Shoes",
        price: "4,499",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
      },
      {
        id: 3,
        name: "Men's Classic T-Shirt",
        price: "799",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
      },
    ],
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (orderQuery.trim()) {
      setSearched(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Enter your order ID to see real-time shipment status and updates
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex gap-2">
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="e.g. OD003547"
              className="flex-1 px-5 py-3 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:border-indigo-500 shadow-xs"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-full shadow-xs transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {searched && (
          <div className="space-y-6">
            {/* Order Header Card */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">
                      Order #{orderData.id}
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200/60">
                      {orderData.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Placed on {orderData.date}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Estimated Delivery</span>
                  <span className="text-sm font-bold text-slate-900">{orderData.estimatedDelivery}</span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-8">
                <div className="relative flex items-center justify-between">
                  {/* Connecting Line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-0">
                    <div className="h-full bg-emerald-500 w-[66%]" />
                  </div>

                  {orderData.steps.map((step, idx) => (
                    <div key={step.label} className="relative z-10 flex flex-col items-center text-center">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          step.completed
                            ? "bg-emerald-500 text-white ring-4 ring-emerald-50"
                            : "bg-white border-2 border-gray-200 text-slate-400"
                        }`}
                      >
                        {step.completed ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5">
                        {step.label}
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                        {step.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipment Details Box */}
              <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Shipment Details</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">{orderData.courier}</span>
                    <span className="text-xs text-slate-500 font-mono">({orderData.trackingId})</span>
                  </div>
                </div>
                <a
                  href={`https://delhivery.com/tracking?id=${orderData.trackingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white hover:bg-slate-50 border border-gray-200 text-slate-800 text-xs font-bold rounded-full transition-colors shadow-xs"
                >
                  <span>Live Tracking</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Order Items List */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4">Items in this Package</h3>
              <div className="divide-y divide-gray-100">
                {orderData.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>← Continue Shopping</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

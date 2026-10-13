"use client";

import Link from "next/link";
import { useState } from "react";

const SAMPLE_ORDERS = [
  { id: "00045", date: "12 Oct 2026", status: "completed", total: "2499", items: 2, payment: "Online" },
  { id: "00032", date: "28 Sep 2026", status: "processing", total: "12999", items: 1, payment: "Razorpay" },
  { id: "00018", date: "15 Sep 2026", status: "cancelled", total: "799", items: 3, payment: "COD" },
];

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  completed: { label: "Delivered", cls: "status-completed" },
  processing: { label: "Processing", cls: "status-processing" },
  cancelled: { label: "Cancelled", cls: "status-cancelled" },
  pending: { label: "Pending", cls: "status-pending" },
  shipped: { label: "Shipped", cls: "status-shipped" },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? SAMPLE_ORDERS : SAMPLE_ORDERS.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
          </div>
          <Link href="/account" className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            Back to Account
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "processing", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all capitalize ${filter === f ? "bg-indigo-500 text-white shadow-md shadow-indigo-200" : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"}`}
            >
              {f === "all" ? "All Orders" : f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You have no {filter !== "all" ? filter : ""} orders yet.</p>
            <Link href="/products" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const st = STATUS_LABELS[order.status] || { label: order.status, cls: "status-pending" };
              return (
                <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">Order #{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold badge ${st.cls}`}>{st.label}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📅 {order.date}</span>
                        <span>📦 {order.items} item{order.items !== 1 ? "s" : ""}</span>
                        <span>💳 {order.payment}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-indigo-600">₹{parseInt(order.total).toLocaleString("en-IN")}</div>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        View Details
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                      </Link>
                    </div>
                  </div>

                  {/* Order Progress */}
                  {order.status !== "cancelled" && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        {["Placed", "Confirmed", "Shipped", "Delivered"].map((step, i) => {
                          const stepIdx = order.status === "completed" ? 4 : order.status === "processing" ? 2 : 1;
                          const active = i < stepIdx;
                          const current = i === stepIdx - 1;
                          return (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${active ? "bg-indigo-500 text-white" : current ? "bg-indigo-100 text-indigo-500 border-2 border-indigo-300" : "bg-gray-100 text-gray-400"}`}>
                                {active ? "✓" : i + 1}
                              </div>
                              <span className={`text-[10px] font-semibold text-center ${active ? "text-indigo-600" : "text-gray-400"}`}>{step}</span>
                              {i < 3 && <div className={`absolute h-0.5 w-full ${active ? "bg-indigo-300" : "bg-gray-200"}`} style={{ marginTop: "-25px", marginLeft: "50%", width: "100%" }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

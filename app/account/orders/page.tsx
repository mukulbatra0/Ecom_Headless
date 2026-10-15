"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils/formatters";

interface CustomerOrder {
  id: number;
  number: string;
  status: string;
  total: string;
  date_created: string;
  payment_method_title: string;
  line_items: Array<{ id: number; name: string; quantity: number }>;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  completed: { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  processing: { label: "Processing", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  cancelled: { label: "Cancelled", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  "on-hold": { label: "On Hold", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  refunded: { label: "Refunded", cls: "bg-purple-50 text-purple-700 border-purple-200" },
};

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch("/api/customer/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        })
        .catch((err) => {
          console.error("Failed to load customer orders:", err);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, [user, isLoading, router]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (isLoading || loadingOrders) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded-full w-48 mb-6" />
            <div className="h-10 bg-gray-200 rounded-2xl w-full mb-6" />
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100 p-6" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
          </div>
          <Link href="/account" className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to Account
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "processing", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
              }`}
            >
              {f === "all" ? "All Orders" : f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {filter !== "all" ? `You have no ${filter} orders yet.` : "You haven't placed any orders yet."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-full transition-colors shadow-xs"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const st = STATUS_LABELS[order.status] || { label: order.status, cls: "bg-gray-50 text-gray-700 border-gray-200" };
              const itemCount = order.line_items ? order.line_items.reduce((acc, it) => acc + (it.quantity || 1), 0) : 0;
              const formattedDate = new Date(order.date_created).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900 text-base">Order #{order.number || order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500">
                        <span>📅 {formattedDate}</span>
                        <span>📦 {itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                        <span>💳 {order.payment_method_title || "Standard"}</span>
                      </div>

                      {/* Line Item Preview */}
                      {order.line_items && order.line_items.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-700 font-medium">
                          {order.line_items.map((item, idx) => (
                            <span key={item.id ? `item-${item.id}` : `item-${idx}`} className="inline-block bg-slate-50 px-2.5 py-1 rounded-lg border border-gray-100">
                              {item.name} {item.quantity > 1 ? `(×${item.quantity})` : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-left sm:text-right flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 flex sm:flex-col justify-between items-center sm:items-end">
                      <div className="text-lg font-bold text-indigo-600">{formatPrice(order.total)}</div>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="mt-2 inline-flex items-center gap-1 px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors shadow-xs"
                      >
                        View Details
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

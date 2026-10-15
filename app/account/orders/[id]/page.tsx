"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils/formatters";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  subtotal: string;
  total: string;
  price: number;
  sku?: string;
  image?: { src: string };
}

interface OrderDetail {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  shipping_total: string;
  discount_total: string;
  payment_method_title: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: OrderItem[];
}

const STATUS_MAP: Record<string, { label: string; cls: string; step: number }> = {
  pending: { label: "Pending Payment", cls: "bg-amber-50 text-amber-700 border-amber-200", step: 1 },
  processing: { label: "Processing", cls: "bg-blue-50 text-blue-700 border-blue-200", step: 2 },
  "on-hold": { label: "On Hold", cls: "bg-amber-50 text-amber-700 border-amber-200", step: 1 },
  completed: { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", step: 4 },
  cancelled: { label: "Cancelled", cls: "bg-rose-50 text-rose-700 border-rose-200", step: 0 },
  refunded: { label: "Refunded", cls: "bg-purple-50 text-purple-700 border-purple-200", step: 0 },
  failed: { label: "Failed", cls: "bg-rose-50 text-rose-700 border-rose-200", step: 0 },
};

function OrderDetailContent() {
  const { id } = useParams();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && id) {
      fetch(`/api/customer/orders/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          } else {
            setErrorMsg(data.message || "Order not found");
          }
        })
        .catch(() => {
          setErrorMsg("Failed to load order details");
        })
        .finally(() => {
          setLoadingOrder(false);
        });
    }
  }, [user, isLoading, id, router]);

  if (isLoading || loadingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="text-4xl mb-3">📦</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-xs text-gray-500 mb-6">{errorMsg || "Unable to display this order."}</p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const st = STATUS_MAP[order.status] || { label: order.status, cls: "bg-gray-50 text-gray-700 border-gray-200", step: 1 };
  const formattedDate = new Date(order.date_created).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to All Orders
          </Link>
          <span className="text-xs text-gray-400">Placed on {formattedDate}</span>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">Order #{order.number || order.id}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${st.cls}`}>
                  {st.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Payment Method: {order.payment_method_title || "Standard"}</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Amount</div>
              <div className="text-2xl font-black text-indigo-600 mt-0.5">{formatPrice(order.total)}</div>
            </div>
          </div>

          {/* Stepper (for active orders) */}
          {order.status !== "cancelled" && order.status !== "failed" && (
            <div className="pt-6">
              <div className="flex items-center justify-between relative">
                {["Placed", "Processing", "Shipped", "Delivered"].map((stepLabel, idx) => {
                  const stepNumber = idx + 1;
                  const isDone = st.step >= stepNumber;
                  const isCurrent = st.step === stepNumber;
                  return (
                    <div key={stepLabel} className="flex flex-col items-center flex-1 z-10">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          isDone
                            ? "bg-indigo-600 text-white"
                            : isCurrent
                            ? "bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isDone ? "✓" : stepNumber}
                      </div>
                      <span className={`text-[11px] font-semibold mt-2 ${isDone ? "text-slate-900" : "text-slate-400"}`}>
                        {stepLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Line Items */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Items in this Order ({order.line_items.length})</h2>
          <div className="divide-y divide-gray-100">
            {order.line_items.map((item, idx) => (
              <div key={item.id ? `order-item-${item.id}` : `order-item-${idx}`} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    🛍️
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">{formatPrice(item.total)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total</span>
              <span className="font-semibold text-slate-900">{formatPrice(String(parseFloat(order.total) - parseFloat(order.shipping_total || "0")))}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">
                {parseFloat(order.shipping_total || "0") > 0 ? formatPrice(order.shipping_total) : "Free"}
              </span>
            </div>
            {parseFloat(order.discount_total || "0") > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-semibold">-{formatPrice(order.discount_total)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-gray-100">
              <span>Grand Total</span>
              <span className="text-indigo-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Addresses & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🚚</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipping Address</h3>
            </div>
            <div className="text-sm text-slate-800 space-y-1">
              <p className="font-bold">{order.shipping.first_name} {order.shipping.last_name}</p>
              <p>{order.shipping.address_1}</p>
              {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
              <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</p>
              <p>{order.shipping.country}</p>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🧾</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Address</h3>
            </div>
            <div className="text-sm text-slate-800 space-y-1">
              <p className="font-bold">{order.billing.first_name} {order.billing.last_name}</p>
              <p>{order.billing.address_1}</p>
              {order.billing.address_2 && <p>{order.billing.address_2}</p>}
              <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
              <p>{order.billing.country}</p>
              {order.billing.phone && <p className="pt-1 text-slate-500 text-xs">📞 {order.billing.phone}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}

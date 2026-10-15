"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getImageUrl } from "@/lib/utils/formatters";
import { showToast } from "@/components/ToastProvider";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, discount, total, coupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shipping + tax;

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/cart/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        applyCoupon(data.code, data.discount, data.type);
        showToast(`Coupon "${data.code}" applied! You save ${formatPrice(String(data.discount))}`, "success");
        setCouponCode("");
      } else {
        showToast(data.message || "Invalid coupon code", "error");
      }
    } catch {
      showToast("Failed to apply coupon", "error");
    }
    setCouponLoading(false);
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added anything yet. Start shopping to fill it up!</p>
          <Link href="/products" className="btn-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== CART ITEMS ===== */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={`cart-item-${item.id}-${idx}`} className="bg-white rounded-3xl p-5 flex gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                {/* Image */}
                <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden">
                    <Image src={getImageUrl(item.image)} alt={item.name} fill unoptimized={true} className="object-contain p-2 rounded-xl" sizes="96px" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <Link href={`/products/${item.slug}`} className="font-semibold text-gray-900 text-sm hover:text-indigo-600 transition-colors line-clamp-2">{item.name}</Link>
                      {item.regular_price && parseFloat(item.regular_price) > parseFloat(item.price) && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-bold text-indigo-600">{formatPrice(item.price)}</span>
                          <span className="text-xs text-gray-400 line-through">{formatPrice(item.regular_price)}</span>
                        </div>
                      )}
                      {!(item.regular_price && parseFloat(item.regular_price) > parseFloat(item.price)) && (
                        <span className="text-base font-bold text-indigo-600 mt-1 block">{formatPrice(item.price)}</span>
                      )}
                    </div>
                    <button onClick={() => { removeItem(item.id); showToast("Item removed from cart", "info"); }} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>

                  {/* Quantity & Subtotal */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-bold">−</button>
                      <span className="w-10 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-bold">+</button>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Subtotal</div>
                      <div className="font-bold text-gray-900">{formatPrice(String(parseFloat(item.price) * item.quantity))}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={() => { clearCart(); showToast("Cart cleared", "info"); }}
                className="text-sm text-gray-400 hover:text-rose-500 transition-colors underline-offset-2 hover:underline"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>
                Coupon Code
              </h3>
              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div>
                    <div className="font-bold text-emerald-700 text-sm">🎉 {coupon.code}</div>
                    <div className="text-xs text-emerald-600">Discount applied!</div>
                  </div>
                  <button onClick={removeCoupon} className="text-xs font-semibold text-rose-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors font-mono tracking-wider"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2.5 bg-indigo-500 text-white font-semibold rounded-2xl text-sm hover:bg-indigo-600 transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-5 text-base">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(String(subtotal))}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-{formatPrice(String(discount))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">{formatPrice(String(shipping))}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(String(tax))}</span>
                </div>
                {shipping > 0 && (
                  <div className="p-3 bg-indigo-50 rounded-2xl text-xs text-indigo-700 font-medium">
                    💡 Add {formatPrice(String(999 - subtotal))} more for free shipping!
                  </div>
                )}
                <div className="divider" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <span className="font-extrabold text-indigo-600 text-xl">{formatPrice(String(grandTotal))}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 text-sm"
              >
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
                Secure checkout powered by Razorpay
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 text-center mb-3 font-medium">We accept</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {["💳 VISA", "🏦 Net Banking", "📱 UPI", "💰 COD"].map((m) => (
                  <span key={m} className="text-xs bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-xl">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, getImageUrl } from "@/lib/utils/formatters";
import { showToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";

const STEPS = ["Contact", "Shipping", "Payment"];

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

const initialShipping: ShippingInfo = {
  firstName: "", lastName: "", email: "", phone: "",
  address1: "", address2: "", city: "", state: "", postcode: "", country: "IN"
};

export default function CheckoutPage() {
  const { items, subtotal, discount, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingInfo>(initialShipping);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [orderNotes, setOrderNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fill from user profile and saved addresses
  useEffect(() => {
    if (user) {
      setShipping((prev) => ({
        ...prev,
        firstName: prev.firstName || user.first_name || (user.display_name ? user.display_name.split(" ")[0] : ""),
        lastName: prev.lastName || user.last_name || (user.display_name ? user.display_name.split(" ").slice(1).join(" ") : ""),
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));

      // Try fetching saved customer addresses
      fetch("/api/customer/addresses")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.shipping) {
            const s = data.shipping;
            setShipping((prev) => ({
              ...prev,
              firstName: prev.firstName || s.first_name || "",
              lastName: prev.lastName || s.last_name || "",
              address1: prev.address1 || s.address_1 || "",
              address2: prev.address2 || s.address_2 || "",
              city: prev.city || s.city || "",
              state: prev.state || s.state || "",
              postcode: prev.postcode || s.postcode || "",
              phone: prev.phone || s.phone || "",
            }));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const shippingCost = subtotal > 999 ? 0 : (shippingMethod === "express" ? 199 : 99);
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shippingCost + tax;

  function updateField(field: keyof ShippingInfo, value: string) {
    setShipping((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep0() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      Boolean(shipping.firstName?.trim()) &&
      Boolean(shipping.lastName?.trim()) &&
      Boolean(shipping.email?.trim()) &&
      emailRegex.test(shipping.email.trim()) &&
      Boolean(shipping.phone?.trim())
    );
  }

  function validateStep1() {
    return (
      Boolean(shipping.address1?.trim()) &&
      Boolean(shipping.city?.trim()) &&
      Boolean(shipping.state?.trim()) &&
      Boolean(shipping.postcode?.trim())
    );
  }

  async function handlePlaceOrder() {
    if (!items || items.length === 0) {
      showToast("Your cart is empty. Please add items before checking out.", "error");
      router.push("/");
      return;
    }

    if (!validateStep0()) {
      showToast("Please provide your contact name, valid email, and phone number.", "error");
      setStep(0);
      return;
    }

    if (!validateStep1()) {
      showToast("Please provide your complete shipping address.", "error");
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: { ...shipping, first_name: shipping.firstName, last_name: shipping.lastName },
          shipping: { ...shipping, first_name: shipping.firstName, last_name: shipping.lastName },
          line_items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
          payment_method: paymentMethod,
          shipping_method: shippingMethod,
          shipping_cost: shippingCost,
          customer_note: orderNotes,
          customer_id: user?.id || 0,
          coupon_code: coupon?.code || undefined,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        showToast(orderData.message || "Failed to create order", "error");
        setLoading(false);
        return;
      }

      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/order-confirmation/${orderData.orderId}`);
        return;
      }

      // Razorpay
      const payRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId, amount: grandTotal }),
      });
      const payData = await payRes.json();

      if (!payData.success) {
        showToast("Payment initialization failed", "error");
        setLoading(false);
        return;
      }

      // Open Razorpay
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: payData.amount,
          currency: "INR",
          name: "ShopZen",
          description: `Order #${orderData.orderId}`,
          order_id: payData.razorpayOrderId,
          prefill: { name: `${shipping.firstName} ${shipping.lastName}`, email: shipping.email, contact: shipping.phone },
          theme: { color: "#6366f1" },
          handler: async (response: any) => {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, orderId: orderData.orderId }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order-confirmation/${orderData.orderId}`);
            } else {
              showToast("Payment verification failed", "error");
            }
          },
          modal: { ondismiss: () => setLoading(false) },
        });
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err: any) {
      showToast(err?.message || "Something went wrong. Please try again.", "error");
      setLoading(false);
    }
  }

  const indianStates = ["Andhra Pradesh","Assam","Bihar","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"];

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-6">You have no items in your shopping cart to checkout.</p>
          <Link href="/" className="btn-primary inline-flex justify-center w-full">
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
              </div>
              <span className="font-bold text-lg gradient-text">ShopZen</span>
            </Link>
            <Link href="/cart" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              Back to Cart
            </Link>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${i === step ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200" : i < step ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? "bg-white/30" : i < step ? "bg-white/30" : "bg-gray-200"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  {s}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 mx-1 ${i < step ? "bg-emerald-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== FORM ===== */}
          <div className="lg:col-span-2">
            {/* Step 0: Contact */}
            {step === 0 && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Contact Information</h2>
                    <p className="text-xs text-gray-500">We&apos;ll use this to send your order confirmation</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "First Name", field: "firstName" as const, placeholder: "John", col: 1 },
                    { label: "Last Name", field: "lastName" as const, placeholder: "Doe", col: 1 },
                    { label: "Email Address", field: "email" as const, placeholder: "john@example.com", col: 2, type: "email" },
                    { label: "Phone Number", field: "phone" as const, placeholder: "+91 9876543210", col: 2, type: "tel" },
                  ].map((f) => (
                    <div key={f.field} className={f.col === 2 ? "col-span-2" : ""}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label} *</label>
                      <input
                        type={f.type || "text"}
                        value={shipping[f.field]}
                        onChange={(e) => updateField(f.field, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => { if (validateStep0()) setStep(1); else showToast("Please fill all required fields", "error"); }}
                    className="btn-primary"
                  >
                    Continue to Shipping
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 text-lg">Shipping Address</h2>
                      <p className="text-xs text-gray-500">Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 *</label>
                      <input type="text" value={shipping.address1} onChange={(e) => updateField("address1", e.target.value)} placeholder="123 Main Street, Apartment 4B" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2</label>
                      <input type="text" value={shipping.address2} onChange={(e) => updateField("address2", e.target.value)} placeholder="Landmark, Near etc. (optional)" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input type="text" value={shipping.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Mumbai" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                      <select value={shipping.state} onChange={(e) => updateField("state", e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white">
                        <option value="">Select state</option>
                        {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code *</label>
                      <input type="text" value={shipping.postcode} onChange={(e) => updateField("postcode", e.target.value)} placeholder="400001" maxLength={6} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input type="text" value="India" readOnly className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm bg-gray-100 text-gray-500 cursor-not-allowed" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Order Notes (Optional)</label>
                      <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Special instructions for your order..." rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-gray-50 focus:bg-white resize-none" />
                    </div>
                  </div>
                </div>

                {/* Shipping Methods */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                    Shipping Method
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: "standard", label: "Standard Shipping", desc: "5-7 business days", price: subtotal > 999 ? "FREE" : "₹99" },
                      { id: "express", label: "Express Shipping", desc: "2-3 business days", price: "₹199" },
                    ].map((m) => (
                      <label key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === m.id ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}>
                        <input type="radio" name="shipping" value={m.id} checked={shippingMethod === m.id} onChange={() => setShippingMethod(m.id)} className="accent-indigo-500 w-4 h-4" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm">{m.label}</div>
                          <div className="text-xs text-gray-500">{m.desc}</div>
                        </div>
                        <span className="font-bold text-indigo-600 text-sm">{m.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(0)} className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:border-indigo-300 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    Back
                  </button>
                  <button
                    onClick={() => { if (validateStep1()) setStep(2); else showToast("Please fill all required address fields", "error"); }}
                    className="btn-primary"
                  >
                    Continue to Payment
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                    </div>
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {[
                      { id: "razorpay", label: "Pay Online", desc: "UPI, Cards, Net Banking, Wallets via Razorpay", icon: "💳" },
                      { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵" },
                    ].map((m) => (
                      <label key={m.id} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === m.id ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}>
                        <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="accent-indigo-500 w-4 h-4" />
                        <div className="text-2xl">{m.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{m.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{m.desc}</div>
                        </div>
                        {paymentMethod === m.id && (
                          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Review */}
                <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm">Review your order</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Shipping to</span><span className="font-medium text-gray-900">{shipping.city}, {shipping.state}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Shipping method</span><span className="font-medium text-gray-900 capitalize">{shippingMethod}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Payment</span><span className="font-medium text-gray-900">{paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</span></div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:border-indigo-300 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className={`btn-primary ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>Processing...</>
                    ) : (
                      <>{paymentMethod === "cod" ? "Place Order" : `Pay ${formatPrice(String(grandTotal))}`}<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===== ORDER SUMMARY SIDEBAR ===== */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {items.map((item, idx) => (
                  <div key={`checkout-item-${item.id}-${idx}`} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={getImageUrl(item.image)} alt={item.name} fill unoptimized={true} className="object-contain p-1 rounded-lg" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900 flex-shrink-0">{formatPrice(String(parseFloat(item.price) * item.quantity))}</span>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium">{formatPrice(String(subtotal))}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span className="font-medium">-{formatPrice(String(discount))}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="font-medium">{shippingCost === 0 ? "FREE" : formatPrice(String(shippingCost))}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (GST 18%)</span><span className="font-medium">{formatPrice(String(tax))}</span></div>
                <div className="divider" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-extrabold text-indigo-600 text-lg">{formatPrice(String(grandTotal))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

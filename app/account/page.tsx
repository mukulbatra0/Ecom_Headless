"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastProvider";
import { formatPrice } from "@/lib/utils/formatters";

const menuItems = [
  { href: "/account", icon: "👤", label: "My Profile", active: true },
  { href: "/account/orders", icon: "📦", label: "My Orders" },
  { href: "/account/wishlist", icon: "❤️", label: "Wishlist" },
  { href: "/account/addresses", icon: "📍", label: "Addresses" },
];

interface RecentOrder {
  id: number;
  number: string;
  date_created: string;
  status: string;
  total: string;
  line_items: Array<{ id: number; name: string; quantity: number }>;
}

export default function AccountPage() {
  const { user, isLoading, logout, updateUser } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [addressCount, setAddressCount] = useState<number>(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      setProfile({
        firstName: user.first_name || user.username || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      // Fetch customer orders for real statistics and recent order list
      fetch("/api/customer/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        })
        .catch(() => {});

      // Fetch customer addresses count
      fetch("/api/customer/addresses")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            let count = 0;
            if (data.billing && data.billing.address_1) count++;
            if (data.shipping && data.shipping.address_1) count++;
            setAddressCount(count > 0 ? count : 1);
          }
        })
        .catch(() => {});
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  async function handleSave() {
    setSaving(true);
    try {
      // 1. Persist to WooCommerce database via API
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.firstName,
          last_name: profile.lastName,
          billing: {
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone: profile.phone,
          },
        }),
      });
      const data = await res.json();

      if (data.success) {
        updateUser({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
        });
        showToast("Profile updated successfully", "success");
        setEditMode(false);
      } else {
        showToast(data.message || "Failed to update profile", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  const displayName = profile.firstName || user.username || "User";
  const initials = `${(displayName?.[0] || "U").toUpperCase()}${(profile.lastName?.[0] || "").toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-3">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white shadow-lg">
                {initials}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                {displayName} {profile.lastName}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200/60">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Verified Customer
              </span>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-4 text-sm font-semibold transition-all border-b border-gray-50 last:border-0 ${
                    item.active ? "text-indigo-700 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                  {item.active && <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all text-left"
              >
                <span>🚪</span>
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Orders", value: String(orders.length), icon: "📦", color: "from-indigo-500 to-violet-600" },
                { label: "Wishlist Items", value: String(wishlistCount), icon: "❤️", color: "from-rose-400 to-pink-500" },
                { label: "Saved Addresses", value: String(addressCount), icon: "📍", color: "from-emerald-400 to-teal-500" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3 text-white`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Personal Information</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage your personal details and contact info</p>
                </div>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 hover:border-gray-400 text-xs font-semibold rounded-full transition-colors"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors shadow-xs disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "First Name", value: profile.firstName || "—" },
                    { label: "Last Name", value: profile.lastName || "—" },
                    { label: "Email Address", value: profile.email || "—", full: true },
                    { label: "Phone Number", value: profile.phone || "Not set", full: true },
                  ].map((f) => (
                    <div key={f.label} className={f.full ? "col-span-2" : ""}>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{f.label}</div>
                      <div className="text-sm font-semibold text-gray-900">{f.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900 text-lg">Recent Orders</h2>
                <Link href="/account/orders" className="text-xs font-semibold text-indigo-600 hover:underline">
                  View All Orders →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-500 mb-3">You haven't placed any orders yet.</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-full"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => {
                    const formattedDate = new Date(order.date_created).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    const itemCount = order.line_items
                      ? order.line_items.reduce((acc, it) => acc + (it.quantity || 1), 0)
                      : 0;

                    return (
                      <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-slate-100 transition-colors">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-sm font-bold text-indigo-700 flex-shrink-0">
                          📦
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">#{order.number || order.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate">
                            {formattedDate} · {itemCount} item{itemCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-full border border-gray-200 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

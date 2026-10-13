"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastProvider";

const menuItems = [
  { href: "/account", icon: "👤", label: "My Profile", active: true },
  { href: "/account/orders", icon: "📦", label: "My Orders" },
  { href: "/account/wishlist", icon: "❤️", label: "Wishlist" },
  { href: "/account/addresses", icon: "📍", label: "Addresses" },
];

export default function AccountPage() {
  const { user, isLoading, logout, updateUser } = useAuth();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      setProfile({
        firstName: user.first_name || user.username || "Sachin",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "+91 9876543210",
      });
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
    updateUser({
      first_name: profile.firstName,
      last_name: profile.lastName,
      phone: profile.phone,
    });
    showToast("Profile updated successfully", "success");
    setSaving(false);
    setEditMode(false);
  }

  const initials = `${(profile.firstName?.[0] || "U").toUpperCase()}${(profile.lastName?.[0] || "").toUpperCase()}`;

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
                {profile.firstName} {profile.lastName}
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
                { label: "Total Orders", value: "3", icon: "📦", color: "from-indigo-500 to-violet-600" },
                { label: "Wishlist Items", value: "5", icon: "❤️", color: "from-rose-400 to-pink-500" },
                { label: "Saved Addresses", value: "2", icon: "📍", color: "from-emerald-400 to-teal-500" },
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
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors shadow-xs"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "First Name", value: profile.firstName },
                    { label: "Last Name", value: profile.lastName || "—" },
                    { label: "Email Address", value: profile.email, full: true },
                    { label: "Phone Number", value: profile.phone, full: true },
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
              <div className="space-y-3">
                {[
                  { id: "#00045", date: "12 Oct 2026", status: "Delivered", total: "₹2,499", items: 2 },
                  { id: "#00032", date: "28 Sep 2026", status: "Processing", total: "₹12,999", items: 1 },
                ].map((order) => (
                  <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-sm font-bold text-indigo-700 flex-shrink-0">
                      📦
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{order.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{order.date} · {order.items} items</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{order.total}</div>
                    <Link href={`/account/orders`} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

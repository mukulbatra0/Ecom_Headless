"use client";

import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { href: "/account", icon: "👤", label: "My Profile", active: true },
  { href: "/account/orders", icon: "📦", label: "My Orders" },
  { href: "/account/wishlist", icon: "❤️", label: "Wishlist" },
  { href: "/account/addresses", icon: "📍", label: "Addresses" },
  { href: "/account/security", icon: "🔒", label: "Security" },
];

export default function AccountPage() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Sachin",
    lastName: "Kumar",
    email: "sachin@example.com",
    phone: "+91 9876543210",
  });
  const [saving, setSaving] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-3">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-bold text-white shadow-lg shadow-indigo-200">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <h3 className="font-bold text-gray-900">{profile.firstName} {profile.lastName}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Verified Member
              </span>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-4 text-sm font-semibold transition-all border-b border-gray-50 last:border-0 ${item.active ? "text-indigo-700 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                  {item.active && <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                </Link>
              ))}
              <button className="w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all">
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
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>
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
                  <p className="text-sm text-gray-500">Manage your personal details</p>
                </div>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${editMode ? "bg-gray-100 text-gray-700" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}
                >
                  {editMode ? "Cancel" : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>Edit Profile</>
                  )}
                </button>
              </div>

              {editMode ? (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "First Name", key: "firstName" as const, placeholder: "John" },
                    { label: "Last Name", key: "lastName" as const, placeholder: "Doe" },
                    { label: "Email", key: "email" as const, placeholder: "john@example.com", type: "email", full: true },
                    { label: "Phone", key: "phone" as const, placeholder: "+91 9876543210", type: "tel", full: true },
                  ].map((f) => (
                    <div key={f.key} className={f.full ? "col-span-2" : ""}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                      <input
                        type={f.type || "text"}
                        value={profile[f.key]}
                        onChange={(e) => setProfile((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                      />
                    </div>
                  ))}
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={async () => {
                        setSaving(true);
                        await new Promise((r) => setTimeout(r, 800));
                        setEditMode(false);
                        setSaving(false);
                      }}
                      className="btn-primary"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "First Name", value: profile.firstName },
                    { label: "Last Name", value: profile.lastName },
                    { label: "Email Address", value: profile.email, full: true },
                    { label: "Phone Number", value: profile.phone, full: true },
                  ].map((f) => (
                    <div key={f.label} className={f.full ? "col-span-2" : ""}>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{f.label}</div>
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
                <Link href="/account/orders" className="text-sm font-semibold text-indigo-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {[
                  { id: "#00045", date: "12 Oct 2026", status: "Delivered", total: "₹2,499", items: 2 },
                  { id: "#00032", date: "28 Sep 2026", status: "Processing", total: "₹12,999", items: 1 },
                  { id: "#00018", date: "15 Sep 2026", status: "Cancelled", total: "₹799", items: 3 },
                ].map((order) => (
                  <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-sm font-bold text-indigo-700 flex-shrink-0">📦</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.status === "Delivered" ? "status-completed" : order.status === "Processing" ? "status-processing" : "status-cancelled"}`}>{order.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{order.date} · {order.items} items</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{order.total}</div>
                    <Link href={`/account/orders/${order.id.replace("#", "")}`} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
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

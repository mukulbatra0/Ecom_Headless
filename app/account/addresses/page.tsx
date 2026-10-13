"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastProvider";

interface Address {
  id: string;
  type: "shipping" | "billing";
  title: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "shipping",
      title: "Home",
      firstName: "Sachin",
      lastName: "Kumar",
      address1: "Flat 402, Lotus Residency, Sector 45",
      address2: "Near City Park",
      city: "Gurugram",
      state: "Haryana",
      postcode: "122003",
      phone: "+91 9876543210",
      isDefault: true,
    },
    {
      id: "2",
      type: "billing",
      title: "Office / Work",
      firstName: "Sachin",
      lastName: "Kumar",
      address1: "Tower B, 7th Floor, Cyber City",
      address2: "DLF Phase 2",
      city: "Gurugram",
      state: "Haryana",
      postcode: "122002",
      phone: "+91 9876543210",
      isDefault: false,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Address>>({
    title: "Home",
    type: "shipping",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  function openAddModal() {
    setEditingId(null);
    setForm({
      title: "Home",
      type: "shipping",
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      phone: user?.phone || "",
      isDefault: false,
    });
    setModalOpen(true);
  }

  function openEditModal(addr: Address) {
    setEditingId(addr.id);
    setForm({ ...addr });
    setModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.address1 || !form.city || !form.postcode) {
      showToast("Please fill all required address fields", "error");
      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? ({ ...a, ...form } as Address) : a))
      );
      showToast("Address updated successfully!", "success");
    } else {
      const newAddress: Address = {
        ...(form as Address),
        id: String(Date.now()),
      };
      setAddresses((prev) => [...prev, newAddress]);
      showToast("New address added successfully!", "success");
    }

    setModalOpen(false);
  }

  function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast("Address removed", "info");
  }

  function handleSetDefault(id: string) {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast("Default address updated", "success");
  }

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/account" className="hover:text-slate-900">My Account</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">Addresses</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Addresses</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your delivery and billing locations for faster checkout</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors shadow-xs"
          >
            <span>+ Add New Address</span>
          </button>
        </div>

        {/* Address Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-[2rem] p-6 border transition-all relative ${
                addr.isDefault
                  ? "border-indigo-600 shadow-sm ring-2 ring-indigo-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{addr.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-slate-600 uppercase">
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(addr)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                  <span className="text-gray-300">·</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="font-bold text-slate-900 text-sm">
                  {addr.firstName} {addr.lastName}
                </p>
                <p>{addr.address1}</p>
                {addr.address2 && <p>{addr.address2}</p>}
                <p>
                  {addr.city}, {addr.state} - <span className="font-semibold text-slate-900">{addr.postcode}</span>
                </p>
                <p className="pt-2 text-slate-500 font-medium">📞 {addr.phone}</p>
              </div>

              {/* Footer */}
              {!addr.isDefault && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <span>Set as Default</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal for Add / Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 hover:text-slate-800 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Tag / Label</label>
                    <select
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      <option value="Home">Home</option>
                      <option value="Office / Work">Office / Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      <option value="shipping">Shipping Address</option>
                      <option value="billing">Billing Address</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Street"
                    value={form.address1}
                    onChange={(e) => setForm({ ...form, address1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, landmark"
                    value={form.address2}
                    onChange={(e) => setForm({ ...form, address2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={form.postcode}
                      onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-3 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

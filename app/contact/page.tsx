"use client";

import { useState } from "react";
import { showToast } from "@/components/ToastProvider";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message sent successfully! We'll reply shortly.", "success");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Get in touch</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            We&apos;d love to hear from you
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Have a question about an order, product or partnership? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 space-y-6">
            <h3 className="text-xl font-bold">Contact Info</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our support team is available Monday through Saturday, 9 AM – 7 PM IST.
            </p>

            <div className="space-y-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block">Email:</span>
                <span className="font-semibold text-white">support@shopzen.com</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <span className="font-semibold text-white">+91 98765 43210</span>
              </div>
              <div>
                <span className="text-slate-400 block">Address:</span>
                <span className="font-semibold text-white">
                  123 Innovation Tower, Tech Park, Gurugram, HR - 122001
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-500">Thank you for contacting us! Our team will get back to you within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                  className="px-6 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Sachin Kumar"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sachin@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Order inquiry / Feedback"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors shadow-xs"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

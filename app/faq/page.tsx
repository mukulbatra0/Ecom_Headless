"use client";

import { useState } from "react";
import Link from "next/link";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Standard shipping typically takes 3-5 business days across major metro cities in India, and 5-7 business days for other regions. Express delivery takes 1-2 days.",
    },
    {
      q: "What is your return policy?",
      a: "We offer a 7-day hassle-free return and exchange policy from the date of delivery. Items must be unused, with original tags and packaging intact.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD).",
    },
    {
      q: "How can I track my order?",
      a: "You can track your order anytime using our 'Track Order' page with your Order ID or airway bill number (AWB).",
    },
    {
      q: "Are the products authentic and covered under warranty?",
      a: "Yes! 100% of our products are genuine, direct-sourced brand items covered under full manufacturer warranty.",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Help Center</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Find answers to commonly asked questions about our products, shipping, and returns.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-gray-100 bg-[#f8fafc] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl leading-none text-slate-400 font-normal">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-gray-100/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center p-8 rounded-3xl bg-slate-50 border border-gray-100">
          <h4 className="text-sm font-bold text-slate-900">Still have questions?</h4>
          <p className="text-xs text-slate-500 mt-1">Our customer support team is always ready to assist you.</p>
          <Link
            href="/contact"
            className="inline-block mt-4 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-full transition-colors"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}

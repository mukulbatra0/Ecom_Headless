"use client";

import React from "react";
import { formatPrice } from "@/lib/utils/formatters";

export interface InvoiceOrderData {
  id: number;
  number?: string;
  status: string;
  date_created: string;
  total: string;
  shipping_total?: string;
  discount_total?: string;
  payment_method_title?: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email?: string;
    phone?: string;
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
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    subtotal?: string;
    total: string;
    price?: number;
    sku?: string;
  }>;
}

interface OrderInvoiceProps {
  order: InvoiceOrderData;
  onClose?: () => void;
  isModal?: boolean;
}

export default function OrderInvoice({ order, onClose, isModal = false }: OrderInvoiceProps) {
  const invoiceNumber = `SZ-INV-${order.number || order.id}`;
  const orderDate = order.date_created
    ? new Date(order.date_created).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const totalNum = parseFloat(order.total || "0");
  const shippingNum = parseFloat(order.shipping_total || "0");
  const discountNum = parseFloat(order.discount_total || "0");
  const itemsSubtotal = (totalNum - shippingNum + discountNum).toFixed(2);
  const estimatedTax = (totalNum * 0.18 / 1.18).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  const invoiceContent = (
    <div id="printable-invoice" className="bg-white text-slate-800 p-8 sm:p-12 max-w-4xl mx-auto font-sans">
      {/* Invoice Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b-2 border-slate-900 gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              S
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">ShopZen</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed max-w-xs">
            ShopZen Retail India Private Limited<br />
            Tech Hub, Sector 62, Noida, UP - 201309<br />
            GSTIN: <span className="font-semibold text-slate-700">07AAACS1429B1ZB</span><br />
            support@shopzen.com | +91 1800-123-9090
          </p>
        </div>

        <div className="sm:text-right">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 mb-2">
            TAX INVOICE / RECEIPT
          </span>
          <div className="text-sm font-semibold text-slate-500">Invoice No:</div>
          <div className="text-lg font-bold text-slate-900 font-mono">{invoiceNumber}</div>
          <div className="text-xs text-slate-500 mt-1">Invoice Date: <span className="font-semibold text-slate-800">{orderDate}</span></div>
          <div className="text-xs text-slate-500">Order Ref: <span className="font-semibold text-slate-800">#{order.number || order.id}</span></div>
        </div>
      </div>

      {/* Bill To & Ship To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-slate-100 text-xs leading-relaxed">
        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Billed To:</span>
          <p className="font-bold text-sm text-slate-900">{order.billing.first_name} {order.billing.last_name}</p>
          <p className="text-slate-600">{order.billing.address_1}</p>
          {order.billing.address_2 && <p className="text-slate-600">{order.billing.address_2}</p>}
          <p className="text-slate-600">{order.billing.city}, {order.billing.state} - {order.billing.postcode}</p>
          <p className="text-slate-600">{order.billing.country}</p>
          {order.billing.email && <p className="text-slate-600 mt-1">✉️ {order.billing.email}</p>}
          {order.billing.phone && <p className="text-slate-600">📞 {order.billing.phone}</p>}
        </div>

        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Shipped To:</span>
          <p className="font-bold text-sm text-slate-900">{order.shipping.first_name} {order.shipping.last_name}</p>
          <p className="text-slate-600">{order.shipping.address_1}</p>
          {order.shipping.address_2 && <p className="text-slate-600">{order.shipping.address_2}</p>}
          <p className="text-slate-600">{order.shipping.city}, {order.shipping.state} - {order.shipping.postcode}</p>
          <p className="text-slate-600">{order.shipping.country}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
            <span>Payment Mode:</span>
            <span className="font-bold text-slate-900">{order.payment_method_title || "Online / COD"}</span>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="py-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3 px-2 w-12">#</th>
              <th className="py-3 px-2">Description</th>
              <th className="py-3 px-2 text-center w-16">Qty</th>
              <th className="py-3 px-2 text-right w-24">Unit Rate</th>
              <th className="py-3 px-2 text-right w-24">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.line_items.map((item, idx) => {
              const itemTotal = parseFloat(item.total || "0");
              const unitRate = item.quantity > 0 ? (itemTotal / item.quantity).toFixed(2) : itemTotal.toFixed(2);
              return (
                <tr key={`inv-row-${item.id}-${idx}`}>
                  <td className="py-3 px-2 text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-slate-900">{item.name}</span>
                    {item.sku && <span className="block text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.quantity}</td>
                  <td className="py-3 px-2 text-right text-slate-600">{formatPrice(unitRate)}</td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900">{formatPrice(item.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="border-t-2 border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="text-xs text-slate-500 max-w-sm">
          <p className="font-semibold text-slate-700 mb-1">Tax Breakdown (Inclusive 18% GST):</p>
          <div className="flex justify-between py-0.5">
            <span>CGST (9%):</span>
            <span className="font-medium text-slate-800">{formatPrice((parseFloat(estimatedTax) / 2).toFixed(2))}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>SGST / UTGST (9%):</span>
            <span className="font-medium text-slate-800">{formatPrice((parseFloat(estimatedTax) / 2).toFixed(2))}</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 italic">
            This invoice is system-generated and valid without a physical signature.
          </p>
        </div>

        <div className="w-full sm:w-64 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal (Items):</span>
            <span className="font-semibold text-slate-900">{formatPrice(itemsSubtotal)}</span>
          </div>
          {discountNum > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount Applied:</span>
              <span>-{formatPrice(discountNum.toString())}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping & Handling:</span>
            <span className="font-semibold text-slate-900">
              {shippingNum > 0 ? formatPrice(shippingNum.toString()) : "FREE"}
            </span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t-2 border-slate-900">
            <span>Grand Total:</span>
            <span className="text-indigo-600 font-black">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Signature & Seal */}
      <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-end text-xs">
        <div>
          <span className="font-semibold text-slate-800">ShopZen Retail India Pvt. Ltd.</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Authorized Signatory</p>
        </div>
        <div className="text-right">
          <div className="w-24 h-10 border-b-2 border-dashed border-slate-300 ml-auto flex items-end justify-center pb-1 text-[10px] text-slate-400 font-mono">
            [Authorized Seal]
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Thank you for shopping with us!</p>
        </div>
      </div>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
          {/* Action Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base">📄</span>
              <span className="font-bold text-sm">Tax Invoice Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.656h10.5Z" />
                </svg>
                Print / Download PDF
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  aria-label="Close invoice preview"
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-2 sm:p-6 bg-slate-50">
            {invoiceContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.656h10.5Z" />
          </svg>
          Print / Download Tax Invoice
        </button>
      </div>
      {invoiceContent}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/formatters";
import { showToast } from "@/components/ToastProvider";
import Image from "next/image";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  function moveToCart(item: typeof items[0]) {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      regular_price: item.regular_price,
      image: item.image,
      slug: item.slug,
      quantity: 1,
      stock_status: item.stock_status,
      stock_quantity: null,
    });
    removeItem(item.id);
    showToast(`${item.name} moved to cart!`, "success");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-sm">Save items you love by clicking the heart icon on any product.</p>
            <Link href="/products" className="btn-primary">Discover Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-1">
                <Link href={`/products/${item.slug}`}>
                  <div className="relative aspect-square bg-gray-50 rounded-t-3xl overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" sizes="200px" />
                    {item.stock_status === "outofstock" && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-full border">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 hover:text-indigo-600 transition-colors mb-2">{item.name}</h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-bold text-indigo-600">{formatPrice(item.price)}</span>
                    {item.regular_price && parseFloat(item.regular_price) > parseFloat(item.price) && (
                      <span className="text-xs text-gray-400 line-through">{formatPrice(item.regular_price)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      disabled={item.stock_status === "outofstock"}
                      className="flex-1 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => { removeItem(item.id); showToast("Removed from wishlist", "info"); }}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500 transition-all flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

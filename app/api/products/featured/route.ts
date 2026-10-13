import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

const FALLBACK_FEATURED = [
  {
    id: 101,
    name: "Apple AirPods Pro",
    slug: "apple-airpods-pro",
    price: "24900",
    regular_price: "26900",
    sale_price: "24900",
    on_sale: true,
    stock_status: "instock",
    featured: true,
    average_rating: "4.8",
    rating_count: 120,
    images: [{ src: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80", alt: "AirPods Pro" }],
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
  },
  {
    id: 102,
    name: "Samsung Galaxy Buds 2",
    slug: "samsung-galaxy-buds-2",
    price: "12999",
    regular_price: "16999",
    sale_price: "12999",
    on_sale: true,
    stock_status: "instock",
    featured: true,
    average_rating: "4.6",
    rating_count: 95,
    images: [{ src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80", alt: "Galaxy Buds 2" }],
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
  },
  {
    id: 103,
    name: "Nike Running Shoes",
    slug: "nike-running-shoes",
    price: "4499",
    regular_price: "6999",
    sale_price: "4499",
    on_sale: true,
    stock_status: "instock",
    featured: true,
    average_rating: "4.9",
    rating_count: 210,
    images: [{ src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", alt: "Nike Running Shoes" }],
    categories: [{ id: 2, name: "Fashion", slug: "fashion" }],
  },
  {
    id: 104,
    name: "Smart Watch",
    slug: "smart-watch",
    price: "8999",
    regular_price: "12999",
    sale_price: "8999",
    on_sale: true,
    stock_status: "instock",
    featured: true,
    average_rating: "4.7",
    rating_count: 154,
    images: [{ src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80", alt: "Smart Watch" }],
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
  },
];

export async function GET() {
  try {
    const fetchPromise = api.get("products", {
      featured: true,
      per_page: 8,
      status: "publish",
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 8000)
    );

    const response = (await Promise.race([fetchPromise, timeoutPromise])) as any;

    if (response?.data && response.data.length > 0) {
      return NextResponse.json({
        success: true,
        products: response.data,
      });
    }

    return NextResponse.json({
      success: true,
      products: FALLBACK_FEATURED,
    });
  } catch {
    return NextResponse.json({
      success: true,
      products: FALLBACK_FEATURED,
    });
  }
}

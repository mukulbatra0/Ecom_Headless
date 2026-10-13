import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

const ALL_SAMPLE_PRODUCTS = [
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
    description: "Active Noise Cancellation reduces unwanted background noise. Adaptive Transparency lets outside sounds in while reducing loud environmental noise. Personalized Spatial Audio with dynamic head tracking places sound all around you.",
    short_description: "Magic like you've never heard.",
    images: [{ src: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80", alt: "Apple AirPods Pro" }],
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
    description: "Immersive sound with dynamic 2-way speakers. Active Noise Canceling reduces unwanted background noise. Comfort fit design you can wear comfortably all day long.",
    short_description: "Comfort fit with premium sound.",
    images: [{ src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80", alt: "Samsung Galaxy Buds 2" }],
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
    description: "Engineered mesh throughout the upper offers lightweight breathability. Foam cushioning delivers a smooth, stable ride. Durable rubber outsole provides traction on various surfaces.",
    short_description: "Engineered for speed and comfort.",
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
    description: "Advanced health sensors monitor heart rate, blood oxygen, and sleep quality. Over 100 sports tracking modes with water resistance and 10-day battery life.",
    short_description: "Your smart daily health companion.",
    images: [{ src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80", alt: "Smart Watch" }],
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
  },
  {
    id: 201,
    name: "iPhone 15 (128GB) - Blue",
    slug: "iphone-15-128gb-blue",
    price: "79900",
    regular_price: "89900",
    sale_price: "79900",
    on_sale: true,
    stock_status: "instock",
    featured: true,
    average_rating: "4.9",
    rating_count: 320,
    description: "Dynamic Island bubbles up alerts and Live Activities. 48MP Main camera with 2x Telephoto. Durable color-infused glass and aluminum design with USB-C connector.",
    short_description: "Dynamic Island. 48MP main camera.",
    images: [{ src: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80", alt: "iPhone 15 Blue" }],
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
  },
  {
    id: 202,
    name: "Wireless Studio Headphones",
    slug: "wireless-studio-headphones",
    price: "7499",
    regular_price: "9999",
    sale_price: "7499",
    on_sale: true,
    stock_status: "instock",
    featured: true,
    average_rating: "4.7",
    rating_count: 84,
    description: "Studio-quality acoustic platform delivers powerful, balanced sound. Active Noise Cancelling and Transparency mode. Up to 40 hours of battery life with Fast Fuel charging.",
    short_description: "40 hours of playtime.",
    images: [{ src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", alt: "Wireless Studio Headphones" }],
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
  },
  {
    id: 203,
    name: "Men's Classic T-Shirt",
    slug: "mens-classic-t-shirt",
    price: "799",
    regular_price: "1299",
    sale_price: "799",
    on_sale: true,
    stock_status: "instock",
    featured: false,
    average_rating: "4.5",
    rating_count: 140,
    description: "100% premium combed organic cotton crewneck t-shirt with modern regular fit and durable double-needle stitching.",
    short_description: "Soft, breathable everyday wear.",
    images: [{ src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", alt: "Men's Classic T-Shirt" }],
    categories: [{ id: 2, name: "Fashion", slug: "fashion" }],
  },
  {
    id: 204,
    name: "Urban Daily Backpack",
    slug: "urban-daily-backpack",
    price: "2199",
    regular_price: "3499",
    sale_price: "2199",
    on_sale: true,
    stock_status: "instock",
    featured: false,
    average_rating: "4.8",
    rating_count: 92,
    description: "Weather-resistant minimalist commuter backpack with dedicated 15.6-inch padded laptop sleeve and ergonomic shoulder straps.",
    short_description: "Lightweight, durable, functional.",
    images: [{ src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80", alt: "Urban Daily Backpack" }],
    categories: [{ id: 5, name: "Accessories", slug: "accessories" }],
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  let resolvedSlug = "";
  try {
    const { slug } = await params;
    resolvedSlug = slug;

    const fetchPromise = api.get("products", {
      slug,
      status: "publish",
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );

    const response = (await Promise.race([fetchPromise, timeoutPromise])) as any;

    if (response?.data && response.data.length > 0) {
      return NextResponse.json({
        success: true,
        product: response.data[0],
      });
    }

    const fallbackProduct = ALL_SAMPLE_PRODUCTS.find((p) => p.slug === slug);
    if (fallbackProduct) {
      return NextResponse.json({
        success: true,
        product: fallbackProduct,
      });
    }

    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  } catch {
    const fallbackProduct = ALL_SAMPLE_PRODUCTS.find((p) => p.slug === resolvedSlug);
    if (fallbackProduct) {
      return NextResponse.json({
        success: true,
        product: fallbackProduct,
      });
    }

    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  }
}

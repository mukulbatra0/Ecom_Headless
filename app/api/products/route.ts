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
    images: [{ src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80", alt: "Urban Daily Backpack" }],
    categories: [{ id: 5, name: "Accessories", slug: "accessories" }],
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || searchParams.get("per_page") || "12");
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const featured = searchParams.get("featured") || "";
    const onSale = searchParams.get("onSale") || searchParams.get("on_sale") || "";
    const inStock = searchParams.get("inStock") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const ids = searchParams.get("ids") || "";
    const sortBy = searchParams.get("sortBy") || "popularity";

    const params: Record<string, unknown> = {
      page,
      per_page: perPage,
      status: "publish",
    };

    if (sortBy === "price") { params.orderby = "price"; params.order = "asc"; }
    else if (sortBy === "price-desc") { params.orderby = "price"; params.order = "desc"; }
    else if (sortBy === "date") { params.orderby = "date"; params.order = "desc"; }
    else if (sortBy === "rating") { params.orderby = "rating"; params.order = "desc"; }
    else { params.orderby = "popularity"; params.order = "desc"; }

    if (category) params.category = category;
    if (search) params.search = search;
    if (featured) params.featured = featured === "true";
    if (onSale) params.on_sale = onSale === "true";
    if (inStock === "true") params.stock_status = "instock";
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (ids) params.include = ids;

    const fetchPromise = api.get("products", params);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );

    const response = (await Promise.race([fetchPromise, timeoutPromise])) as any;

    if (response?.data && response.data.length > 0) {
      return NextResponse.json({
        success: true,
        products: response.data,
        total: parseInt(response.headers["x-wp-total"] || String(response.data.length)),
        totalPages: parseInt(response.headers["x-wp-totalpages"] || "1"),
      });
    }

    // Filter fallback products
    let filtered = [...ALL_SAMPLE_PRODUCTS];
    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      filtered = filtered.filter((p) =>
        p.categories.some((c) => c.slug.toLowerCase() === category.toLowerCase() || String(c.id) === category)
      );
    }
    if (onSale === "true") {
      filtered = filtered.filter((p) => p.on_sale);
    }

    return NextResponse.json({
      success: true,
      products: filtered,
      total: filtered.length,
      totalPages: 1,
    });
  } catch {
    return NextResponse.json({
      success: true,
      products: ALL_SAMPLE_PRODUCTS,
      total: ALL_SAMPLE_PRODUCTS.length,
      totalPages: 1,
    });
  }
}

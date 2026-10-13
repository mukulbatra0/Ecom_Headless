import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { WooCommerceProduct } from "@/lib/woocommerce";

// Curated default products matching the user's design image
const FALLBACK_FEATURED_PRODUCTS: WooCommerceProduct[] = [
  {
    id: 101,
    name: "Apple AirPods Pro",
    slug: "apple-airpods-pro",
    permalink: "/products/apple-airpods-pro",
    date_created: "2026-01-01",
    date_modified: "2026-01-01",
    type: "simple",
    status: "publish",
    featured: true,
    description: "Active Noise Cancellation with Transparency mode and spatial audio.",
    short_description: "Magic like you've never heard.",
    sku: "AAP-001",
    price: "24900",
    regular_price: "26900",
    sale_price: "24900",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 15,
    manage_stock: true,
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
    tags: [{ id: 1, name: "Audio", slug: "audio" }],
    images: [
      {
        id: 1,
        src: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
        name: "Apple AirPods Pro",
        alt: "Apple AirPods Pro",
      },
    ],
    attributes: [],
    variations: [],
    average_rating: "4.8",
    rating_count: 120,
    related_ids: [],
  },
  {
    id: 102,
    name: "Samsung Galaxy Buds 2",
    slug: "samsung-galaxy-buds-2",
    permalink: "/products/samsung-galaxy-buds-2",
    date_created: "2026-01-01",
    date_modified: "2026-01-01",
    type: "simple",
    status: "publish",
    featured: true,
    description: "Immersive sound with dynamic 2-way speakers and active noise canceling.",
    short_description: "Comfort fit with premium sound.",
    sku: "SGB-002",
    price: "12999",
    regular_price: "16999",
    sale_price: "12999",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 20,
    manage_stock: true,
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
    tags: [],
    images: [
      {
        id: 2,
        src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        name: "Samsung Galaxy Buds 2",
        alt: "Samsung Galaxy Buds 2",
      },
    ],
    attributes: [],
    variations: [],
    average_rating: "4.6",
    rating_count: 95,
    related_ids: [],
  },
  {
    id: 103,
    name: "Nike Running Shoes",
    slug: "nike-running-shoes",
    permalink: "/products/nike-running-shoes",
    date_created: "2026-01-01",
    date_modified: "2026-01-01",
    type: "simple",
    status: "publish",
    featured: true,
    description: "Breathable mesh upper with responsive cushioning for high endurance running.",
    short_description: "Engineered for speed and comfort.",
    sku: "NRS-003",
    price: "4499",
    regular_price: "6999",
    sale_price: "4499",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 12,
    manage_stock: true,
    categories: [{ id: 2, name: "Fashion", slug: "fashion" }],
    tags: [],
    images: [
      {
        id: 3,
        src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        name: "Nike Running Shoes",
        alt: "Nike Running Shoes",
      },
    ],
    attributes: [],
    variations: [],
    average_rating: "4.9",
    rating_count: 210,
    related_ids: [],
  },
  {
    id: 104,
    name: "Smart Watch",
    slug: "smart-watch",
    permalink: "/products/smart-watch",
    date_created: "2026-01-01",
    date_modified: "2026-01-01",
    type: "simple",
    status: "publish",
    featured: true,
    description: "Fitness and health tracker with heart rate monitor, AMOLED display and long battery.",
    short_description: "Your smart daily health companion.",
    sku: "SW-004",
    price: "8999",
    regular_price: "12999",
    sale_price: "8999",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 18,
    manage_stock: true,
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
    tags: [],
    images: [
      {
        id: 4,
        src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        name: "Smart Watch",
        alt: "Smart Watch",
      },
    ],
    attributes: [],
    variations: [],
    average_rating: "4.7",
    rating_count: 154,
    related_ids: [],
  },
];

const NEW_ARRIVALS_PRODUCTS: WooCommerceProduct[] = [
  {
    id: 201,
    name: "iPhone 15 (128GB) - Blue",
    slug: "iphone-15-128gb-blue",
    permalink: "/products/iphone-15-128gb-blue",
    date_created: "2026-01-01",
    date_modified: "2026-01-01",
    type: "simple",
    status: "publish",
    featured: true,
    description: "A16 Bionic chip with advanced dual-camera system and dynamic island display.",
    short_description: "Dynamic island. 48MP main camera.",
    sku: "IPH15-01",
    price: "79900",
    regular_price: "89900",
    sale_price: "79900",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 10,
    manage_stock: true,
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
    tags: [],
    images: [
      {
        id: 201,
        src: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
        name: "iPhone 15 Blue",
        alt: "iPhone 15 Blue",
      },
    ],
    attributes: [],
    variations: [],
    average_rating: "4.9",
    rating_count: 320,
    related_ids: [],
  },
  {
    id: 202,
    name: "Wireless Studio Headphones",
    slug: "wireless-studio-headphones",
    permalink: "/products/wireless-studio-headphones",
    date_created: "2026-01-01",
    date_modified: "2026-01-01",
    type: "simple",
    status: "publish",
    featured: true,
    description: "High-fidelity spatial audio with deep bass and ultra-soft memory foam earcups.",
    short_description: "40 hours of playtime.",
    sku: "WSH-02",
    price: "7499",
    regular_price: "9999",
    sale_price: "7499",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 14,
    manage_stock: true,
    categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
    tags: [],
    images: [
      {
        id: 202,
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        name: "Wireless Studio Headphones",
        alt: "Wireless Studio Headphones",
      },
    ],
    attributes: [],
    variations: [],
    average_rating: "4.7",
    rating_count: 84,
    related_ids: [],
  },
  {
    id: 203,
    name: "Men's Classic T-Shirt",
    slug: "mens-classic-t-shirt",
    permalink: "/products/mens-classic-t-shirt",
    date_created: "2026-01-01",
    date_modified: "2026-01-01",
    type: "simple",
    status: "publish",
    featured: false,
    description: "100% premium combed organic cotton crewneck t-shirt with modern regular fit.",
    short_description: "Soft, breathable everyday wear.",
    sku: "TSH-03",
    price: "799",
    regular_price: "1299",
    sale_price: "799",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 50,
    manage_stock: true,
    categories: [{ id: 2, name: "Fashion", slug: "fashion" }],
    tags: [],
    images: [
      {
        id: 203,
        src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        name: "Men's Classic T-Shirt",
        alt: "Men's Classic T-Shirt",
      },
    ],
    attributes: [],
    variations: [],
    average_rating: "4.5",
    rating_count: 140,
    related_ids: [],
  },
  {
    id: 204,
    name: "Urban Daily Backpack",
    slug: "urban-daily-backpack",
    permalink: "/products/urban-daily-backpack",
    date_created: "2026-01-01",
    date_modified: "2026-01-01",
    type: "simple",
    status: "publish",
    featured: false,
    description: "Weather-resistant minimalist commuter backpack with dedicated 15.6 inch laptop sleeve.",
    short_description: "Lightweight, durable, functional.",
    sku: "BP-04",
    price: "2199",
    regular_price: "3499",
    sale_price: "2199",
    on_sale: true,
    stock_status: "instock",
    stock_quantity: 25,
    manage_stock: true,
    categories: [{ id: 5, name: "Accessories", slug: "accessories" }],
    tags: [],
    images: [
      {
        id: 204,
        src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        name: "Urban Daily Backpack",
        alt: "Urban Daily Backpack",
      },
    ],
    attributes: [],
    variations: [],
    average_rating: "4.8",
    rating_count: 92,
    related_ids: [],
  },
];

const CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics",
    icon: (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
    ),
  },
  {
    id: "home-living",
    name: "Home & Living",
    icon: (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12 3v18m0-18L3 9.75M12 3l9 6.75" />
      </svg>
    ),
  },
  {
    id: "beauty",
    name: "Beauty",
    icon: (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
      </svg>
    ),
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

async function getFeaturedProducts(): Promise<WooCommerceProduct[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products/featured`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      return data.products;
    }
  } catch (error) {
    console.error("Error fetching featured products from API:", error);
  }
  return FALLBACK_FEATURED_PRODUCTS;
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const productsToDisplay =
    featuredProducts && featuredProducts.length > 0
      ? featuredProducts.slice(0, 4)
      : FALLBACK_FEATURED_PRODUCTS;

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section Banner with Badges */}
      <HeroSection />

      {/* 2. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-1 group transition-colors"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* 4 Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {productsToDisplay.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Shop by Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-1 group transition-colors"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Categories Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group p-5 sm:p-6 bg-[#f8fafc] hover:bg-slate-100/90 rounded-2xl md:rounded-3xl border border-gray-100/80 transition-all duration-200 flex flex-col items-center justify-center text-center hover:-translate-y-1 hover:shadow-xs"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-slate-950">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Promotional Banners (Two Split Banners) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Summer Sale */}
          <div className="relative bg-gradient-to-r from-sky-100/90 to-cyan-100 rounded-[2rem] p-6 sm:p-8 md:p-10 flex items-center justify-between overflow-hidden group">
            <div className="space-y-3 z-10 max-w-[60%]">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Summer Sale
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Up to 50% OFF
              </h3>
              <div className="pt-2">
                <Link
                  href="/products?onSale=true"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Shop Now</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
                alt="Summer Sale Smart Watch"
                width={200}
                height={200}
                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Banner 2: New Arrivals Latest Collection */}
          <div className="relative bg-gradient-to-r from-slate-100 to-gray-200/90 rounded-[2rem] p-6 sm:p-8 md:p-10 flex items-center justify-between overflow-hidden group">
            <div className="space-y-3 z-10 max-w-[60%]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                New Arrivals
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Latest Collection
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Trendy • Premium • Stylish
              </p>
              <div className="pt-1">
                <Link
                  href="/products?sortBy=date"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Shop Now</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
                alt="New Arrivals Sneakers"
                width={200}
                height={200}
                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mb-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            New Arrivals
          </h2>
          <Link
            href="/products?sortBy=date"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-1 group transition-colors"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* New Arrivals Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {NEW_ARRIVALS_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

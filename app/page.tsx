import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import api, { WooCommerceProduct } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

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
    const res = await api.get("products", {
      featured: true,
      per_page: 4,
      status: "publish",
    });
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }

    const fallbackRes = await api.get("products", {
      per_page: 4,
      status: "publish",
    });
    if (fallbackRes?.data && Array.isArray(fallbackRes.data)) {
      return fallbackRes.data;
    }
  } catch (error) {
    console.error("Error fetching featured products from WooCommerce:", error);
  }
  return [];
}

async function getNewArrivals(): Promise<WooCommerceProduct[]> {
  try {
    const res = await api.get("products", {
      orderby: "date",
      order: "desc",
      per_page: 4,
      status: "publish",
    });
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (error) {
    console.error("Error fetching new arrivals from WooCommerce:", error);
  }
  return [];
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {[...Array(4)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function FeaturedProductsSection() {
  const featuredProducts = await getFeaturedProducts();
  if (featuredProducts.length === 0) {
    return <p className="text-center text-sm text-slate-500 py-8">No featured products available at the moment.</p>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {featuredProducts.slice(0, 4).map((product, idx) => (
        <ProductCard key={product.id ? `feat-${product.id}` : `feat-${idx}`} product={product} />
      ))}
    </div>
  );
}

async function NewArrivalsSection() {
  const newArrivals = await getNewArrivals();
  if (newArrivals.length === 0) {
    return <p className="text-center text-sm text-slate-500 py-8">No new arrivals available at the moment.</p>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {newArrivals.slice(0, 4).map((product, idx) => (
        <ProductCard key={product.id ? `arrival-${product.id}` : `arrival-${idx}`} product={product} />
      ))}
    </div>
  );
}

export default function Home() {
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

        {/* Featured Products Grid with Suspense */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProductsSection />
        </Suspense>
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
                unoptimized={true}
                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300 rounded-2xl"
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
                unoptimized={true}
                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300 rounded-2xl"
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

        {/* New Arrivals Product Grid with Suspense */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <NewArrivalsSection />
        </Suspense>
      </section>
    </div>
  );
}

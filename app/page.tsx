import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import api, { WooCommerceProduct } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

interface DisplayCategory {
  id: number | string;
  name: string;
  slug: string;
  count?: number;
}

const FALLBACK_FASHION_CATEGORIES: DisplayCategory[] = [
  { id: 17, name: "Men's Collection", slug: "men", count: 6 },
  { id: 26, name: "Women's Collection", slug: "women", count: 5 },
  { id: 18, name: "T-Shirts & Tops", slug: "t-shirts", count: 3 },
  { id: 64, name: "Jackets & Outerwear", slug: "jackets", count: 1 },
  { id: 33, name: "Jeans & Denim", slug: "jeans", count: 2 },
  { id: 67, name: "Accessories & Caps", slug: "accessories", count: 2 },
];

function getCategoryIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("men") && !s.includes("women")) {
    return (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    );
  }
  if (s.includes("women") || s.includes("dress") || s.includes("skirt")) {
    return (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    );
  }
  if (s.includes("shirt") || s.includes("top")) {
    return (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
    );
  }
  if (s.includes("jean") || s.includes("trouser") || s.includes("pant")) {
    return (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1.5 18-3.75-.75L12 13.5l-.75 6.75L7.5 21 9 3Z" />
      </svg>
    );
  }
  if (s.includes("jacket") || s.includes("hoodie") || s.includes("sweatshirt") || s.includes("coat")) {
    return (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0-15-4.5 4.5M12 4.5l4.5 4.5M3.75 9h16.5M4.5 19.5h15" />
      </svg>
    );
  }
  if (s.includes("cap") || s.includes("hat") || s.includes("accessori")) {
    return (
      <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  );
}

async function getCategories(): Promise<DisplayCategory[]> {
  try {
    const res = await api.get("products/categories", {
      per_page: 12,
      orderby: "count",
      order: "desc",
      hide_empty: true,
    });
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      const filtered = res.data.filter(
        (c: any) => c.slug !== "uncategorized" && c.count > 0
      );
      if (filtered.length > 0) return filtered;
    }
  } catch (error) {
    console.error("Error fetching categories from WooCommerce:", error);
  }
  return FALLBACK_FASHION_CATEGORIES;
}

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

async function CategoriesSection() {
  const categories = await getCategories();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {categories.slice(0, 6).map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="group p-5 sm:p-6 bg-[#f8fafc] hover:bg-slate-100/90 rounded-2xl md:rounded-3xl border border-gray-100/80 transition-all duration-200 flex flex-col items-center justify-center text-center hover:-translate-y-1 hover:shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            {getCategoryIcon(category.slug)}
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-slate-950">
            {category.name}
          </span>
          {category.count !== undefined && category.count > 0 && (
            <span className="text-[11px] text-slate-400 mt-0.5">
              {category.count} {category.count === 1 ? "Item" : "Items"}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section Banner */}
      <HeroSection />

      {/* 2. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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

        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProductsSection />
        </Suspense>
      </section>

      {/* 3. Shop by Category Section (Pure Fashion & Clothing Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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

        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          }
        >
          <CategoriesSection />
        </Suspense>
      </section>

      {/* 4. Promotional Banners (Two Split Fashion Banners) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Summer Fashion Sale */}
          <div className="relative bg-gradient-to-r from-amber-50/90 to-orange-100/70 rounded-[2rem] p-6 sm:p-8 md:p-10 flex items-center justify-between overflow-hidden group">
            <div className="space-y-3 z-10 max-w-[60%]">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Summer Season
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Up to 50% OFF
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Breezy Linens &amp; Casual Fits
              </p>
              <div className="pt-2">
                <Link
                  href="/products?onSale=true"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Shop Summer</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80"
                alt="Summer Apparel Collection"
                width={200}
                height={200}
                unoptimized={true}
                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300 rounded-2xl"
              />
            </div>
          </div>

          {/* Banner 2: New Season Streetwear & Denim */}
          <div className="relative bg-gradient-to-r from-slate-100 to-indigo-100/70 rounded-[2rem] p-6 sm:p-8 md:p-10 flex items-center justify-between overflow-hidden group">
            <div className="space-y-3 z-10 max-w-[60%]">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                New Arrivals
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Latest Collection
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Jackets • Denim • Urban Wear
              </p>
              <div className="pt-1">
                <Link
                  href="/products?sortBy=date"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Explore Now</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
                alt="Denim & Streetwear Jackets"
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

        <Suspense fallback={<ProductGridSkeleton />}>
          <NewArrivalsSection />
        </Suspense>
      </section>
    </div>
  );
}

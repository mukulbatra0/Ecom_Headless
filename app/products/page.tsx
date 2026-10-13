"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils/formatters";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { showToast } from "@/components/ToastProvider";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  stock_quantity: number | null;
  featured: boolean;
  average_rating: string;
  rating_count: number;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-8 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const imageUrl = product.images?.[0]?.src || "/placeholder-product.svg";
  const discount =
    product.on_sale && product.regular_price && product.sale_price
      ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
      : 0;

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-100 hover:-translate-y-1">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-3xl">
          <Image src={imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-full">{discount}% OFF</span>}
            {product.featured && <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">Featured</span>}
          </div>
          <button
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 ${inWishlist ? "bg-rose-500 text-white opacity-100" : "bg-white text-gray-400 hover:text-rose-500"}`}
            onClick={(e) => { e.preventDefault(); toggleItem({ id: product.id, name: product.name, price: product.price, regular_price: product.regular_price, image: imageUrl, slug: product.slug, stock_status: product.stock_status }); showToast(inWishlist ? "Removed from wishlist" : "Added to wishlist!", inWishlist ? "info" : "success"); }}
          >
            <svg className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
          {product.stock_status === "outofstock" && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <span className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          {product.categories?.[0] && <p className="text-[10px] text-indigo-500 font-semibold mb-1 uppercase tracking-wider">{product.categories[0].name}</p>}
          <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug min-h-[2.5rem]">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <StarRating rating={parseFloat(product.average_rating || "0")} />
            <span className="text-[10px] text-gray-400">({product.rating_count || 0})</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-indigo-600">{formatPrice(product.price)}</span>
            {product.on_sale && product.regular_price && <span className="text-xs text-gray-400 line-through">{formatPrice(product.regular_price)}</span>}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          disabled={product.stock_status === "outofstock"}
          onClick={() => {
            addItem({ id: product.id, name: product.name, price: product.price, regular_price: product.regular_price, image: imageUrl, slug: product.slug, quantity: 1, stock_status: product.stock_status, stock_quantity: product.stock_quantity });
            showToast(`${product.name} added to cart!`, "success");
          }}
          className={`w-full py-2.5 font-semibold rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2 ${product.stock_status === "outofstock" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"}`}
        >
          {product.stock_status === "outofstock" ? "Out of Stock" : (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(50000);
  const [sortBy, setSortBy] = useState("popularity");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const perPage = 12;
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories.filter((c: Category) => c.count > 0));
    } catch {}
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        perPage: String(perPage),
        sortBy,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(priceMin > 0 && { minPrice: String(priceMin) }),
        ...(priceMax < 50000 && { maxPrice: String(priceMax) }),
        ...(inStockOnly && { inStock: "true" }),
        ...(onSaleOnly && { onSale: "true" }),
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotalProducts(data.total || data.products.length);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, priceMin, priceMax, sortBy, inStockOnly, onSaleOnly]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(fetchProducts, 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [fetchProducts]);

  const totalPages = Math.ceil(totalProducts / perPage);

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceMin(0);
    setPriceMax(50000);
    setSortBy("popularity");
    setInStockOnly(false);
    setOnSaleOnly(false);
    setCurrentPage(1);
  }

  const hasFilters = searchQuery || selectedCategory || priceMin > 0 || priceMax < 50000 || inStockOnly || onSaleOnly;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-indigo-600 transition-colors">Home</Link>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            <span className="text-gray-700 font-medium">All Products</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ===== SIDEBAR ===== */}
          <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-white lg:bg-transparent transform transition-transform duration-300 lg:transform-none lg:block ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"} overflow-y-auto lg:overflow-visible`}>
            <div className="lg:sticky lg:top-24 space-y-6 p-6 lg:p-0">
              {/* Close btn mobile */}
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Search */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Search Products</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Type to search..."
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="category" checked={selectedCategory === ""} onChange={() => { setSelectedCategory(""); setCurrentPage(1); }} className="accent-indigo-500 w-4 h-4" />
                    <span className={`text-sm font-medium ${selectedCategory === "" ? "text-indigo-600" : "text-gray-700 group-hover:text-indigo-600"} transition-colors`}>All Products</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="category" checked={selectedCategory === String(cat.id)} onChange={() => { setSelectedCategory(String(cat.id)); setCurrentPage(1); }} className="accent-indigo-500 w-4 h-4" />
                      <span className={`text-sm font-medium flex-1 ${selectedCategory === String(cat.id) ? "text-indigo-600" : "text-gray-700 group-hover:text-indigo-600"} transition-colors`}>{cat.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{cat.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-indigo-600">₹{priceMin.toLocaleString()}</span>
                    <span className="text-indigo-600">₹{priceMax.toLocaleString()}</span>
                  </div>
                  <input type="range" min={0} max={50000} step={500} value={priceMin} onChange={(e) => { setPriceMin(Number(e.target.value)); setCurrentPage(1); }} className="w-full" />
                  <input type="range" min={0} max={50000} step={500} value={priceMax} onChange={(e) => { setPriceMax(Number(e.target.value)); setCurrentPage(1); }} className="w-full" />
                  <div className="grid grid-cols-2 gap-2">
                    {[[0, 1000], [1000, 5000], [5000, 15000], [15000, 50000]].map(([min, max]) => (
                      <button key={min} onClick={() => { setPriceMin(min); setPriceMax(max); setCurrentPage(1); }} className={`text-xs py-1.5 px-2 rounded-xl border transition-all ${priceMin === min && priceMax === max ? "bg-indigo-500 text-white border-indigo-500" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}>
                        ₹{min === 0 ? "0" : `${min/1000}K`} - ₹{max === 50000 ? "50K+" : `${max/1000}K`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Availability</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={inStockOnly} onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(1); }} className="accent-indigo-500 w-4 h-4 rounded" />
                    <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={onSaleOnly} onChange={(e) => { setOnSaleOnly(e.target.checked); setCurrentPage(1); }} className="accent-indigo-500 w-4 h-4 rounded" />
                    <span className="text-sm text-gray-700 font-medium">On Sale Only</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              {hasFilters && (
                <button onClick={clearFilters} className="w-full py-3 border-2 border-rose-200 text-rose-500 font-semibold rounded-2xl hover:bg-rose-50 transition-colors text-sm">
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

          {/* ===== MAIN CONTENT ===== */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Filter Toggle - Mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:border-indigo-300 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                Filters
              </button>

              {/* Results Count */}
              <div className="text-sm text-gray-500 font-medium">
                {loading ? "Loading..." : <><span className="text-indigo-600 font-bold">{totalProducts}</span> products found</>}
              </div>

              {/* Active Filter Tags */}
              {hasFilters && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && <span className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">"{searchQuery}" <button onClick={() => setSearchQuery("")}>×</button></span>}
                  {selectedCategory && <span className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">Category <button onClick={() => setSelectedCategory("")}>×</button></span>}
                  {inStockOnly && <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">In Stock <button onClick={() => setInStockOnly(false)}>×</button></span>}
                  {onSaleOnly && <span className="flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">On Sale <button onClick={() => setOnSaleOnly(false)}>×</button></span>}
                </div>
              )}

              {/* Sort Dropdown */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-indigo-400 cursor-pointer shadow-sm"
                >
                  <option value="popularity">Popularity</option>
                  <option value="date">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-2xl font-semibold text-sm transition-all ${page === currentPage ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200" : "border-2 border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

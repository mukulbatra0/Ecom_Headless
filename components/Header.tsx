"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { formatPrice, getImageUrl } from "@/lib/utils/formatters";

interface SearchSuggestion {
  id: number;
  name: string;
  slug: string;
  price: string;
  images?: Array<{ src: string }>;
  image?: string;
  categories?: Array<{ name: string }>;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setShowDropdown(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&perPage=4`);
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setSuggestions(data.products);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Shop<span className="text-indigo-600">Zen</span>
            </span>
          </Link>

          {/* Search Bar - Center */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-auto relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                name="search"
                autoComplete="off"
                suppressHydrationWarning
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2 && suggestions.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full pl-5 pr-12 py-3 bg-[#f3f4f6] hover:bg-[#eef0f3] focus:bg-white text-slate-800 placeholder-slate-400 rounded-full text-sm font-normal border border-transparent focus:border-slate-300 focus:outline-none transition-all duration-200"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                <div className="p-3 border-b border-gray-50 flex items-center justify-between text-xs text-slate-400">
                  <span>Products matching &quot;{searchQuery}&quot;</span>
                  {searchLoading && <span className="text-indigo-600 font-semibold animate-pulse">Searching...</span>}
                </div>

                {searchLoading && suggestions.length === 0 ? (
                  <div className="p-4 space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                          <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {suggestions.map((item) => {
                      const img = item.images?.[0]?.src || item.image || "";
                      return (
                        <Link
                          key={item.id}
                          href={`/products/${item.slug}`}
                          onClick={() => {
                            setShowDropdown(false);
                            setSearchQuery("");
                          }}
                          className="p-3 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
                        >
                          <div className="relative w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                            <Image
                              src={getImageUrl(img)}
                              alt={item.name}
                              fill
                              unoptimized={true}
                              className="object-contain p-1 group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                              {item.name}
                            </h4>
                            {item.categories?.[0] && (
                              <span className="text-[10px] text-slate-400 block">
                                {item.categories[0].name}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-900 flex-shrink-0">
                            {formatPrice(item.price)}
                          </span>
                        </Link>
                      );
                    })}
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => {
                        setShowDropdown(false);
                        setSearchQuery("");
                      }}
                      className="p-3 block text-center text-xs font-bold text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      See all results for &quot;{searchQuery}&quot; →
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No products found matching &quot;{searchQuery}&quot;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account / User Avatar */}
            {mounted && user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-gray-100"
                title={`${user.first_name || user.username}`}
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {(user.first_name?.[0] || user.username?.[0] || "U").toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[80px] truncate">
                  {user.first_name || user.username}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
                aria-label="Account"
                title="Sign In"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {!mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              name="mobile-search"
              autoComplete="off"
              suppressHydrationWarning
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full pl-5 pr-10 py-2.5 bg-[#f3f4f6] text-slate-800 placeholder-slate-400 rounded-full text-sm border border-transparent focus:border-slate-300 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Secondary Category / Sub-navigation Links */}
        <div className="hidden md:flex items-center gap-8 py-2.5 border-t border-gray-100/60 text-xs font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-slate-950 font-bold border-b-2 border-slate-900"
                    : "hover:text-slate-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-2 flex gap-3 px-2">
                {mounted && user ? (
                  <Link
                    href="/account"
                    className="flex-1 text-center py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account ({user.first_name || user.username})
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex-1 text-center py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/account"
                      className="flex-1 text-center py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

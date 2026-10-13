"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPrice, getImageUrl } from "@/lib/utils/formatters";
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
  description: string;
  short_description: string;
  average_rating: string;
  rating_count: number;
  images: Array<{ id: number; src: string; alt: string; name: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{ id: number; name: string; options: string[] }>;
  related_ids: number[];
}

interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

function SkeletonDetail() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4 rounded-full" />
          <div className="skeleton h-6 w-40 rounded-full" />
          <div className="skeleton h-10 w-32 rounded-full" />
          <div className="skeleton h-24 w-full rounded-2xl" />
          <div className="skeleton h-14 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`${sizes[size]} ${i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          // Init attributes
          const attrs: Record<string, string> = {};
          data.product.attributes?.forEach((a: { name: string; options: string[] }) => {
            if (a.options.length > 0) attrs[a.name] = a.options[0];
          });
          setSelectedAttributes(attrs);
          // Fetch related
          if (data.product.related_ids?.length > 0) {
            const relRes = await fetch(`/api/products?ids=${data.product.related_ids.slice(0, 4).join(",")}`);
            const relData = await relRes.json();
            if (relData.success) setRelatedProducts(relData.products);
          }
          // Fetch reviews
          const revRes = await fetch(`/api/products/${slug}/reviews`);
          const revData = await revRes.json();
          if (revData.success) setReviews(revData.reviews);
        }
      } catch {}
      setLoading(false);
    }
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) return <SkeletonDetail />;
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <Link href="/products" className="btn-primary mt-4">Browse All Products</Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const imageUrl = getImageUrl(product.images?.[0]?.src);
  const discount = product.on_sale && product.regular_price && product.sale_price
    ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
    : 0;

  async function handleAddToCart() {
    setAddingToCart(true);
    addItem({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      regular_price: product!.regular_price,
      image: imageUrl,
      slug: product!.slug,
      quantity,
      stock_status: product!.stock_status,
      stock_quantity: product!.stock_quantity,
    });
    showToast(`${product!.name} added to cart!`, "success");
    setTimeout(() => setAddingToCart(false), 600);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-gray-400 hover:text-indigo-600 transition-colors">Home</Link>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            <Link href="/products" className="text-gray-400 hover:text-indigo-600 transition-colors">Products</Link>
            {product.categories?.[0] && (
              <>
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                <Link href={`/products?category=${product.categories[0].id}`} className="text-gray-400 hover:text-indigo-600 transition-colors">{product.categories[0].name}</Link>
              </>
            )}
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            <span className="text-gray-700 font-medium line-clamp-1 max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* ===== IMAGE GALLERY ===== */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <Image
                src={getImageUrl(product.images?.[activeImage]?.src || imageUrl)}
                alt={product.name}
                fill
                unoptimized={true}
                className="object-contain p-6 transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-rose-500 text-white text-sm font-bold rounded-full shadow-md">{discount}% OFF</span>
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 bg-amber-500 text-white text-sm font-bold rounded-full shadow-md">⭐ Featured</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-square bg-white rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-indigo-500 shadow-md shadow-indigo-100" : "border-gray-100 hover:border-indigo-200"}`}
                  >
                    <Image src={getImageUrl(img.src)} alt={img.alt || product.name} fill unoptimized={true} className="object-contain p-2" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🚚", title: "Free Shipping", sub: "On orders above ₹999" },
                { icon: "↩️", title: "7-Day Return", sub: "Easy hassle-free returns" },
                { icon: "🔒", title: "Secure Payment", sub: "100% safe & protected" },
              ].map((b) => (
                <div key={b.title} className="bg-white rounded-2xl p-3 text-center border border-gray-100">
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs font-bold text-gray-800">{b.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== PRODUCT INFO ===== */}
          <div className="space-y-5">
            {/* Category */}
            {product.categories?.[0] && (
              <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{product.categories[0].name}</p>
            )}

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={parseFloat(product.average_rating || "0")} size="md" />
                <span className="text-sm font-semibold text-gray-700">{parseFloat(product.average_rating || "0").toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.rating_count} reviews)</span>
              </div>
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${product.stock_status === "instock" ? "text-emerald-600" : "text-rose-500"}`}>
                <div className={`w-2 h-2 rounded-full ${product.stock_status === "instock" ? "bg-emerald-500" : "bg-rose-500"}`} />
                {product.stock_status === "instock" ? "In Stock" : "Out of Stock"}
                {product.stock_quantity && <span className="text-gray-400 font-normal">({product.stock_quantity} left)</span>}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
              <span className="text-3xl font-extrabold text-indigo-600">{formatPrice(product.price)}</span>
              {product.on_sale && product.regular_price && (
                <>
                  <span className="text-xl text-gray-400 line-through font-medium">{formatPrice(product.regular_price)}</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-600 font-bold rounded-full text-sm">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: product.short_description }} />
            )}

            {/* Attributes/Variants */}
            {product.attributes?.map((attr) => (
              <div key={attr.id}>
                <p className="text-sm font-bold text-gray-800 mb-2">{attr.name}: <span className="text-indigo-600">{selectedAttributes[attr.name]}</span></p>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedAttributes((prev) => ({ ...prev, [attr.name]: opt }))}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${selectedAttributes[attr.name] === opt ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-700 hover:border-indigo-300"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-800">Quantity:</span>
              <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-bold text-lg"
                >−</button>
                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 99, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-bold text-lg"
                >+</button>
              </div>
              <span className="text-sm text-gray-500">Total: <span className="text-indigo-600 font-bold">{formatPrice(String(parseFloat(product.price) * quantity))}</span></span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status === "outofstock" || addingToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-2xl text-sm transition-all duration-300 ${product.stock_status === "outofstock" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5"} ${addingToCart ? "scale-95" : ""}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {addingToCart ? "Added! ✓" : product.stock_status === "outofstock" ? "Out of Stock" : "Add to Cart"}
              </button>

              <Link
                href="/checkout"
                className="flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-2xl text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all hover:-translate-y-0.5"
                onClick={handleAddToCart}
              >
                Buy Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>

              <button
                onClick={() => {
                  toggleItem({ id: product.id, name: product.name, price: product.price, regular_price: product.regular_price, image: imageUrl, slug: product.slug, stock_status: product.stock_status });
                  showToast(inWishlist ? "Removed from wishlist" : "Added to wishlist!", inWishlist ? "info" : "success");
                }}
                className={`w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-2xl border-2 transition-all ${inWishlist ? "bg-rose-500 border-rose-500 text-white" : "border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-500"}`}
              >
                <svg className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>

            {/* SKU/Share */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
              <span>Category: <Link href={`/products?category=${product.categories?.[0]?.id}`} className="text-indigo-500 hover:underline">{product.categories?.[0]?.name}</Link></span>
              <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z" /></svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="flex border-b border-gray-100">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab === "reviews" ? `Reviews (${product.rating_count})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose prose-indigo max-w-none text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }} />
            )}
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.attributes?.length > 0 ? product.attributes.map((attr) => (
                  <div key={attr.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{attr.name}</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5">{attr.options.join(", ")}</div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 col-span-2">No specifications available.</p>
                )}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  <>
                    {/* Rating Summary */}
                    <div className="flex items-center gap-6 p-6 bg-indigo-50 rounded-2xl">
                      <div className="text-center">
                        <div className="text-5xl font-extrabold text-indigo-600">{parseFloat(product.average_rating).toFixed(1)}</div>
                        <StarRating rating={parseFloat(product.average_rating)} size="md" />
                        <div className="text-xs text-gray-500 mt-1">{product.rating_count} reviews</div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5,4,3,2,1].map((star) => {
                          const count = reviews.filter((r) => r.rating === star).length;
                          const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                              <span className="text-gray-600 w-4">{star}</span>
                              <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-gray-500 w-6">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {review.reviewer?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{review.reviewer}</div>
                              <div className="text-xs text-gray-400">{new Date(review.date_created).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
                            </div>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: review.review }} />
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
              <Link href="/products" className="text-sm font-semibold text-indigo-600 hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => {
                const rpImage = getImageUrl(rp.images?.[0]?.src);
                return (
                  <Link key={rp.id} href={`/products/${rp.slug}`}>
                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-indigo-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
                      <div className="relative aspect-square bg-gray-50 rounded-t-3xl overflow-hidden">
                        <Image src={rpImage} alt={rp.name} fill unoptimized={true} className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" sizes="200px" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">{rp.name}</p>
                        <p className="text-sm font-bold text-indigo-600">{formatPrice(rp.price)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { WooCommerceProduct } from "@/lib/woocommerce";
import { formatPrice, calculateDiscount, getImageUrl } from "@/lib/utils/formatters";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { showToast } from "@/components/ToastProvider";

interface ProductCardProps {
  product: WooCommerceProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const discount =
    product.on_sale && product.regular_price && product.sale_price
      ? calculateDiscount(product.regular_price, product.sale_price)
      : 0;

  const rawImage = product.images && product.images.length > 0 ? product.images[0].src : "";
  const imageUrl = getImageUrl(rawImage);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock_status === "outofstock") return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      regular_price: product.regular_price,
      image: imageUrl,
      slug: product.slug,
      quantity: 1,
      stock_status: product.stock_status,
      stock_quantity: product.stock_quantity,
    });
    showToast(`${product.name} added to cart!`, "success");
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      regular_price: product.regular_price,
      image: imageUrl,
      slug: product.slug,
      stock_status: product.stock_status,
    });
    showToast(
      inWishlist ? "Removed from wishlist" : "Added to wishlist!",
      inWishlist ? "info" : "success"
    );
  }

  const ratingValue = parseFloat(product.average_rating || "4.8");
  const reviewCount = product.rating_count || 120;

  return (
    <div className="group bg-white rounded-[1.75rem] border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Clickable Area for Image and Details */}
      <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
        {/* Image Container with Soft Background */}
        <div className="relative aspect-square m-3 rounded-2xl bg-[#f8fafc] overflow-hidden flex items-center justify-center p-4">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            unoptimized={true}
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges (Top Left) */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-full border border-emerald-200/60">
                {discount}% OFF
              </span>
            )}
            {product.stock_status === "outofstock" && (
              <span className="px-2 py-0.5 bg-slate-900 text-white text-[11px] font-semibold rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button (Top Right) */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Wishlist"
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
              inWishlist
                ? "bg-rose-50 text-rose-500 shadow-xs"
                : "bg-white/90 text-slate-400 hover:text-rose-500 shadow-xs hover:bg-white"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill={inWishlist ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>

        {/* Content Details */}
        <div className="px-4 pb-2 pt-1 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-base font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.regular_price && product.regular_price !== product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>

            {/* Rating Row */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {ratingValue.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-400">
                ({reviewCount})
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Add Button */}
      <div className="px-4 pb-4 pt-2">
        <button
          type="button"
          disabled={product.stock_status === "outofstock"}
          onClick={handleAddToCart}
          className={`w-full py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
            product.stock_status === "outofstock"
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 hover:bg-black text-white hover:shadow-xs"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

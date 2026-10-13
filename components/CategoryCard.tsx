"use client";

import Link from "next/link";
import Image from "next/image";
import { WooCommerceCategory } from "@/lib/woocommerce";

interface CategoryCardProps {
  category: WooCommerceCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.image?.src || "/placeholder-category.svg";

  return (
    <Link href={`/products?category=${category.id}`}>
      <div className="group relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border/50 hover:border-primary/30">
        {/* Background Image with Overlay */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Category Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              {category.name}
            </h3>
            <p className="text-white/90 text-sm font-medium">
              {category.count} {category.count === 1 ? "Product" : "Products"}
            </p>
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg transform group-hover:translate-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </div>

        {/* Description Section */}
        {category.description && (
          <div className="p-5 bg-white">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

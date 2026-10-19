import Link from "next/link";
import Image from "next/image";
import { PromotionalBanner } from "@/lib/cms";

interface PromotionalBannersProps {
  banners: PromotionalBanner[];
}

export default function PromotionalBanners({ banners }: PromotionalBannersProps) {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {banners.map((banner, index) => {
        const bgGradient = banner.bg_gradient || "from-slate-100 to-indigo-100/70";
        const tagColor = banner.tag_color || "text-slate-800";

        return (
          <div
            key={banner.id || `banner-${index}`}
            className={`relative bg-gradient-to-r ${bgGradient} rounded-[2rem] p-6 sm:p-8 md:p-10 flex items-center justify-between overflow-hidden group`}
          >
            <div className="space-y-3 z-10 max-w-[60%]">
              {banner.tag && (
                <span className={`text-xs font-bold uppercase tracking-wider ${tagColor}`}>
                  {banner.tag}
                </span>
              )}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {banner.title}
              </h3>
              {banner.description && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {banner.description}
                </p>
              )}
              {banner.button_text && (
                <div className="pt-2">
                  <Link
                    href={banner.button_link || "/products"}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <span>{banner.button_text}</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Product / Promotional Image */}
            {banner.image_url && (
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center">
                <Image
                  src={banner.image_url}
                  alt={banner.image_alt || banner.title}
                  width={200}
                  height={200}
                  unoptimized={true}
                  className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

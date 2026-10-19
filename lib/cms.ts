export interface HeroFeature {
  id?: string;
  title: string;
  description: string;
  icon?: "truck" | "refresh" | "shield" | "headphones" | string;
}

export interface HeroData {
  title: string;
  title_accent?: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_url: string;
  image_alt: string;
  features: HeroFeature[];
}

export interface PromotionalBanner {
  id: string;
  tag: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  image_url: string;
  image_alt: string;
  bg_gradient?: string;
  tag_color?: string;
}

export interface CmsCategory {
  id: number | string;
  name: string;
  slug: string;
  count?: number;
  icon?: string;
}

export interface SectionHeadings {
  featured_products: string;
  categories: string;
  new_arrivals: string;
}

export interface HomepageCmsData {
  hero: HeroData;
  promotional_banners: PromotionalBanner[];
  categories: CmsCategory[];
  section_headings: SectionHeadings;
}

export const DEFAULT_HOMEPAGE_CMS_DATA: HomepageCmsData = {
  hero: {
    title: "Upgrade Your",
    title_accent: "Everyday Fashion",
    subtitle: "Curated clothing, streetwear & timeless apparel. Premium quality, unbeatable style.",
    button_text: "Explore Collection",
    button_link: "/products",
    image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    image_alt: "Latest Fashion & Apparel Collection",
    features: [
      {
        id: "shipping",
        title: "Free Shipping",
        description: "On orders above ₹999",
        icon: "truck",
      },
      {
        id: "returns",
        title: "Easy Returns",
        description: "Within 7 days",
        icon: "refresh",
      },
      {
        id: "secure",
        title: "Secure Payments",
        description: "100% Secure",
        icon: "shield",
      },
      {
        id: "support",
        title: "24/7 Support",
        description: "Dedicated Support",
        icon: "headphones",
      },
    ],
  },
  promotional_banners: [
    {
      id: "banner-1",
      tag: "Summer Season",
      title: "Up to 50% OFF",
      description: "Breezy Linens & Casual Fits",
      button_text: "Shop Summer",
      button_link: "/products?onSale=true",
      image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80",
      image_alt: "Summer Apparel Collection",
      bg_gradient: "from-amber-50/90 to-orange-100/70",
      tag_color: "text-amber-800",
    },
    {
      id: "banner-2",
      tag: "New Arrivals",
      title: "Latest Collection",
      description: "Jackets • Denim • Urban Wear",
      button_text: "Explore Now",
      button_link: "/products?sortBy=date",
      image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      image_alt: "Denim & Streetwear Jackets",
      bg_gradient: "from-slate-100 to-indigo-100/70",
      tag_color: "text-indigo-700",
    },
  ],
  categories: [
    { id: 17, name: "Men's Collection", slug: "men", count: 6, icon: "men" },
    { id: 26, name: "Women's Collection", slug: "women", count: 5, icon: "women" },
    { id: 18, name: "T-Shirts & Tops", slug: "t-shirts", count: 3, icon: "shirt" },
    { id: 64, name: "Jackets & Outerwear", slug: "jackets", count: 1, icon: "jacket" },
    { id: 33, name: "Jeans & Denim", slug: "jeans", count: 2, icon: "jeans" },
    { id: 67, name: "Accessories & Caps", slug: "accessories", count: 2, icon: "accessories" },
  ],
  section_headings: {
    featured_products: "Featured Products",
    categories: "Shop by Category",
    new_arrivals: "New Arrivals",
  },
};

/**
 * Fetch homepage CMS data from WordPress REST API endpoint
 * /wp-json/shopzen/v1/homepage
 */
export async function getHomepageCmsData(): Promise<HomepageCmsData> {
  const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/ecom/server";
  const url = `${wpBaseUrl}/wp-json/shopzen/v1/homepage`;

  try {
    const res = await fetch(url, {
      cache: "no-store", // Always fetch latest CMS edits
    });

    if (!res.ok) {
      console.warn(`[CMS] Failed to fetch homepage data: ${res.status} ${res.statusText}`);
      return DEFAULT_HOMEPAGE_CMS_DATA;
    }

    const json = await res.json();
    if (json?.success && json?.data) {
      return {
        hero: {
          ...DEFAULT_HOMEPAGE_CMS_DATA.hero,
          ...(json.data.hero || {}),
          features:
            json.data.hero?.features && json.data.hero.features.length > 0
              ? json.data.hero.features
              : DEFAULT_HOMEPAGE_CMS_DATA.hero.features,
        },
        promotional_banners:
          json.data.promotional_banners && json.data.promotional_banners.length > 0
            ? json.data.promotional_banners
            : DEFAULT_HOMEPAGE_CMS_DATA.promotional_banners,
        categories:
          json.data.categories && json.data.categories.length > 0
            ? json.data.categories
            : DEFAULT_HOMEPAGE_CMS_DATA.categories,
        section_headings: {
          ...DEFAULT_HOMEPAGE_CMS_DATA.section_headings,
          ...(json.data.section_headings || {}),
        },
      };
    }
  } catch (error) {
    console.error("[CMS] Error connecting to WordPress homepage endpoint:", error);
  }

  return DEFAULT_HOMEPAGE_CMS_DATA;
}

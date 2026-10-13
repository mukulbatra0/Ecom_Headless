import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

const FALLBACK_CATEGORIES = [
  { id: 1, name: "Electronics", slug: "electronics", count: 125, parent: 0, description: "Smartphones, Audio & Gadgets", image: null },
  { id: 2, name: "Fashion", slug: "fashion", count: 189, parent: 0, description: "Apparel, Footwear & Everyday style", image: null },
  { id: 3, name: "Home & Living", slug: "home-living", count: 84, parent: 0, description: "Decor, Comfort & Daily essentials", image: null },
  { id: 4, name: "Beauty", slug: "beauty", count: 52, parent: 0, description: "Skincare, Grooming & Fragrance", image: null },
  { id: 5, name: "Accessories", slug: "accessories", count: 41, parent: 0, description: "Watches, Bags & Smart Wearables", image: null },
];

export async function GET() {
  try {
    const fetchPromise = api.get("products/categories", {
      per_page: 20,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 8000)
    );

    const response = (await Promise.race([fetchPromise, timeoutPromise])) as any;

    if (response?.data && response.data.length > 0) {
      return NextResponse.json({
        success: true,
        categories: response.data,
      });
    }

    return NextResponse.json({
      success: true,
      categories: FALLBACK_CATEGORIES,
    });
  } catch {
    return NextResponse.json({
      success: true,
      categories: FALLBACK_CATEGORIES,
    });
  }
}

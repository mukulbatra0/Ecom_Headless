import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

const FALLBACK_CATEGORIES = [
  { id: 17, name: "Men's Collection", slug: "men", count: 6, parent: 0, description: "Shirts, Trousers & Everyday Menswear", image: null },
  { id: 26, name: "Women's Collection", slug: "women", count: 5, parent: 0, description: "Dresses, Skirts, Tops & Denim", image: null },
  { id: 18, name: "T-Shirts & Polos", slug: "t-shirts", count: 4, parent: 0, description: "Classic crew necks & premium tees", image: null },
  { id: 64, name: "Jackets & Outerwear", slug: "jackets", count: 2, parent: 0, description: "Denim jackets, coats & hoodies", image: null },
  { id: 33, name: "Jeans & Trousers", slug: "jeans", count: 3, parent: 0, description: "High-rise denim, chinos & bottoms", image: null },
  { id: 67, name: "Accessories & Caps", slug: "accessories", count: 2, parent: 0, description: "Baseball caps, scarves & accessories", image: null },
];

export const dynamic = "force-dynamic";

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

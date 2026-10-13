import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // First get product ID from slug
    const productRes = await api.get("products", { slug, status: "publish" });
    if (!productRes.data || productRes.data.length === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const productId = productRes.data[0].id;
    const reviewRes = await api.get(`products/${productId}/reviews`);

    return NextResponse.json({
      success: true,
      reviews: reviewRes.data || [],
    });
  } catch (error: unknown) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, reviews: [] });
  }
}

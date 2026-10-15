import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { rating, review, reviewer, reviewer_email } = body || {};

    const numericRating = parseInt(String(rating || "5"), 10);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { success: false, message: "Please provide a star rating between 1 and 5" },
        { status: 400 }
      );
    }

    if (!review || typeof review !== "string" || !review.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide review comments" },
        { status: 400 }
      );
    }

    // 1. Resolve product ID from slug
    const productRes = await api.get("products", { slug, status: "publish" });
    if (!productRes.data || productRes.data.length === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    const productId = productRes.data[0].id;

    // 2. Post review to WooCommerce REST API
    const res = await api.post("products/reviews", {
      product_id: productId,
      rating: numericRating,
      review: review.trim(),
      reviewer: (reviewer || "Verified Customer").trim(),
      reviewer_email: (reviewer_email || "shopper@shopzen.com").trim(),
      status: "approved",
    });

    return NextResponse.json({
      success: true,
      review: res.data,
      message: "Your review has been submitted successfully!",
    });
  } catch (error: unknown) {
    console.error("Error submitting review to WooCommerce:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review. Please try again later." },
      { status: 500 }
    );
  }
}

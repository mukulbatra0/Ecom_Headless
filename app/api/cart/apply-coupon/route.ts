import { NextResponse } from "next/server";

// Sample coupons for demo - in production these come from WooCommerce
const COUPONS = [
  { code: "WELCOME10", discount: 10, type: "percent", description: "10% off for new users" },
  { code: "SAVE100", discount: 100, type: "fixed", description: "₹100 flat discount" },
  { code: "FIRST50", discount: 50, type: "fixed", description: "₹50 off on first order" },
  { code: "SALE20", discount: 20, type: "percent", description: "20% off during sale" },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: "Please enter a coupon code" }, { status: 400 });
    }

    const coupon = COUPONS.find((c) => c.code === code.toUpperCase().trim());

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid or expired coupon code" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      description: coupon.description,
      message: `Coupon applied! ${coupon.description}`,
    });
  } catch (error: unknown) {
    console.error("Error applying coupon:", error);
    return NextResponse.json({ success: false, message: "Failed to apply coupon" }, { status: 500 });
  }
}

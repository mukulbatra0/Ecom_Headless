import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

// Fallback sample coupons for local development/demos
const DEMO_COUPONS = [
  { code: "WELCOME10", discount: 10, type: "percent", description: "10% off for new users" },
  { code: "SAVE100", discount: 100, type: "fixed", description: "₹100 flat discount" },
  { code: "FIRST50", discount: 50, type: "fixed", description: "₹50 off on first order" },
  { code: "SALE20", discount: 20, type: "percent", description: "20% off during sale" },
];

interface WooCommerceCoupon {
  id: number;
  code: string;
  amount: string;
  status: string;
  discount_type: string;
  description: string;
  date_expires: string | null;
  usage_count: number;
  usage_limit: number | null;
  minimum_amount: string;
  maximum_amount: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body || {};

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid coupon code" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toLowerCase();
    const cartSubtotal = typeof subtotal === "number" ? subtotal : parseFloat(String(subtotal || "0"));

    let matchedCoupon: WooCommerceCoupon | null = null;

    // 1. Check WooCommerce live coupons
    try {
      // Query by code parameter
      const wcRes = await api.get("coupons", { code: cleanCode });
      if (Array.isArray(wcRes?.data) && wcRes.data.length > 0) {
        const found = wcRes.data.find(
          (c: WooCommerceCoupon) => c.code.toLowerCase() === cleanCode
        );
        if (found) matchedCoupon = found;
      }

      // If not found directly, query published coupons list in case of search filter nuances
      if (!matchedCoupon) {
        const allCouponsRes = await api.get("coupons", { per_page: 50 });
        if (Array.isArray(allCouponsRes?.data)) {
          const found = allCouponsRes.data.find(
            (c: WooCommerceCoupon) => c.code.toLowerCase() === cleanCode
          );
          if (found) matchedCoupon = found;
        }
      }
    } catch (wcErr) {
      console.warn("Could not query WooCommerce coupons directly, falling back to local verification:", wcErr);
    }

    // 2. Validate WooCommerce coupon if found
    if (matchedCoupon) {
      // Status check
      if (matchedCoupon.status && matchedCoupon.status !== "publish") {
        return NextResponse.json(
          { success: false, message: "This coupon is currently inactive" },
          { status: 400 }
        );
      }

      // Expiry check
      if (matchedCoupon.date_expires) {
        const expiresAt = new Date(matchedCoupon.date_expires).getTime();
        if (!isNaN(expiresAt) && expiresAt < Date.now()) {
          return NextResponse.json(
            { success: false, message: "This coupon has expired" },
            { status: 400 }
          );
        }
      }

      // Usage limit check
      if (
        matchedCoupon.usage_limit &&
        matchedCoupon.usage_limit > 0 &&
        matchedCoupon.usage_count >= matchedCoupon.usage_limit
      ) {
        return NextResponse.json(
          { success: false, message: "This coupon has reached its maximum usage limit" },
          { status: 400 }
        );
      }

      // Minimum amount check
      const minAmount = parseFloat(matchedCoupon.minimum_amount || "0");
      if (minAmount > 0 && cartSubtotal > 0 && cartSubtotal < minAmount) {
        return NextResponse.json(
          {
            success: false,
            message: `Minimum order value of ₹${minAmount.toLocaleString("en-IN")} required for this coupon`,
          },
          { status: 400 }
        );
      }

      // Maximum amount check
      const maxAmount = parseFloat(matchedCoupon.maximum_amount || "0");
      if (maxAmount > 0 && cartSubtotal > 0 && cartSubtotal > maxAmount) {
        return NextResponse.json(
          {
            success: false,
            message: `Maximum order value for this coupon is ₹${maxAmount.toLocaleString("en-IN")}`,
          },
          { status: 400 }
        );
      }

      const isPercent = matchedCoupon.discount_type === "percent";
      const discountValue = parseFloat(matchedCoupon.amount || "0");
      const discountType = isPercent ? "percent" : "fixed";
      const description =
        matchedCoupon.description ||
        (isPercent ? `${discountValue}% off` : `₹${discountValue} flat discount`);

      return NextResponse.json({
        success: true,
        code: matchedCoupon.code,
        discount: discountValue,
        type: discountType,
        description,
        message: `Coupon "${matchedCoupon.code}" applied! ${description}`,
      });
    }

    // 3. Check demo/sample coupons if not found in WooCommerce
    const demo = DEMO_COUPONS.find((c) => c.code.toLowerCase() === cleanCode);
    if (demo) {
      return NextResponse.json({
        success: true,
        code: demo.code,
        discount: demo.discount,
        type: demo.type,
        description: demo.description,
        message: `Coupon "${demo.code}" applied! ${demo.description}`,
      });
    }

    // 4. Coupon not found
    return NextResponse.json(
      { success: false, message: "Invalid or expired coupon code" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Error applying coupon:", error);
    return NextResponse.json(
      { success: false, message: "Failed to apply coupon. Please try again." },
      { status: 500 }
    );
  }
}

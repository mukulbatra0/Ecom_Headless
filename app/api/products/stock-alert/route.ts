import { NextRequest, NextResponse } from "next/server";

// In-memory / persistent back-in-stock alert store
interface StockAlertRecord {
  id: string;
  productId: number;
  productName: string;
  email: string;
  createdAt: string;
}

const stockAlerts: StockAlertRecord[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, productName, email } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, message: "Product ID and Email are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = stockAlerts.find(
      (a) => a.productId === Number(productId) && a.email.toLowerCase() === email.toLowerCase()
    );

    if (!existing) {
      stockAlerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        productId: Number(productId),
        productName: productName || "Product",
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `You're all set! We will notify ${email} as soon as this item is back in stock.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to subscribe to stock alert" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    // In production, use actual Razorpay SDK
    // const Razorpay = require("razorpay");
    // const razorpay = new Razorpay({ key_id, key_secret });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR", receipt: `order_${orderId}` });

    // Demo response - replace with actual Razorpay order in production
    return NextResponse.json({
      success: true,
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      razorpayOrderId: `order_demo_${orderId}_${Date.now()}`,
      orderId,
    });
  } catch (error: unknown) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}

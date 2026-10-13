import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      billing,
      shipping,
      line_items,
      payment_method,
      shipping_method,
      customer_note,
    } = body;

    const orderData = {
      billing: {
        first_name: billing.first_name || billing.firstName || "",
        last_name: billing.last_name || billing.lastName || "",
        address_1: billing.address1 || billing.address_1 || "",
        address_2: billing.address2 || billing.address_2 || "",
        city: billing.city || "",
        state: billing.state || "",
        postcode: billing.postcode || "",
        country: billing.country || "IN",
        email: billing.email || "",
        phone: billing.phone || "",
      },
      shipping: {
        first_name: shipping.first_name || shipping.firstName || "",
        last_name: shipping.last_name || shipping.lastName || "",
        address_1: shipping.address1 || shipping.address_1 || "",
        address_2: shipping.address2 || shipping.address_2 || "",
        city: shipping.city || "",
        state: shipping.state || "",
        postcode: shipping.postcode || "",
        country: shipping.country || "IN",
      },
      line_items: line_items.map((item: { product_id: number; quantity: number }) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      payment_method: payment_method === "cod" ? "cod" : "razorpay",
      payment_method_title: payment_method === "cod" ? "Cash on Delivery" : "Razorpay",
      set_paid: payment_method === "cod",
      status: payment_method === "cod" ? "processing" : "pending",
      shipping_lines: [
        {
          method_id: shipping_method || "flat_rate",
          method_title: shipping_method === "express" ? "Express Shipping" : "Standard Shipping",
          total: shipping_method === "express" ? "199.00" : "99.00",
        },
      ],
      customer_note: customer_note || "",
    };

    const response = await api.post("orders", orderData);

    return NextResponse.json({
      success: true,
      orderId: response.data.id,
      orderNumber: response.data.number,
      status: response.data.status,
    });
  } catch (error: unknown) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}

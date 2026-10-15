import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    const response = await api.get(`orders/${id}`);
    const order = response.data;

    if (!order || !order.id) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        number: order.number || String(order.id),
        status: order.status,
        date_created: order.date_created,
        total: order.total,
        shipping_total: order.shipping_total,
        discount_total: order.discount_total,
        payment_method_title: order.payment_method_title,
        billing: order.billing,
        shipping: order.shipping,
        line_items: order.line_items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          subtotal: item.subtotal,
          total: item.total,
          price: item.price,
          sku: item.sku,
        })) || [],
      },
    });
  } catch (error: any) {
    console.error("Error fetching order receipt:", error);
    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
  }
}

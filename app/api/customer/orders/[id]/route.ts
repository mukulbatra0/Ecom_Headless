import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("shopzen_session");
    if (!session || !session.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(session.value);
    const response = await api.get(`orders/${id}`);
    const order = response.data;

    // Security check: ensure order belongs to this customer
    const matchesEmail =
      order.billing?.email?.toLowerCase() === user.email?.toLowerCase();
    const matchesCustomerId =
      user.id && user.id > 0 && order.customer_id === user.id;

    if (!matchesEmail && !matchesCustomerId) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Error fetching single order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

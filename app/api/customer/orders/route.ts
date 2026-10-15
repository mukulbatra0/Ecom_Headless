import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("shopzen_session");
    if (!session || !session.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(session.value);
    const ordersMap = new Map<number, any>();

    // 1. Fetch by customer email
    if (user.email) {
      try {
        const resByEmail = await api.get("orders", {
          search: user.email,
          per_page: 50,
        });
        if (Array.isArray(resByEmail?.data)) {
          for (const order of resByEmail.data) {
            ordersMap.set(order.id, order);
          }
        }
      } catch (err) {
        console.error("Error fetching orders by email:", err);
      }
    }

    // 2. Fetch by customer ID if customer ID is > 0
    if (user.id && user.id > 0) {
      try {
        const resById = await api.get("orders", {
          customer: user.id,
          per_page: 50,
        });
        if (Array.isArray(resById?.data)) {
          for (const order of resById.data) {
            ordersMap.set(order.id, order);
          }
        }
      } catch (err) {
        console.error("Error fetching orders by customer ID:", err);
      }
    }

    const orders = Array.from(ordersMap.values()).sort(
      (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Error in customer orders API:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

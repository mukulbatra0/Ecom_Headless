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
    const response = await api.get(`customers/${user.id}`);
    const customer = response.data;

    return NextResponse.json({
      success: true,
      billing: customer.billing,
      shipping: customer.shipping,
    });
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("shopzen_session");
    if (!session || !session.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(session.value);
    const body = await request.json();
    const { billing, shipping } = body;

    const updateData: Record<string, any> = {};
    if (billing) updateData.billing = billing;
    if (shipping) updateData.shipping = shipping;

    const response = await api.put(`customers/${user.id}`, updateData);

    return NextResponse.json({
      success: true,
      billing: response.data.billing,
      shipping: response.data.shipping,
    });
  } catch (error: any) {
    console.error("Error updating addresses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update addresses" },
      { status: 500 }
    );
  }
}

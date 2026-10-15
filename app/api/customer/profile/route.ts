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

    return NextResponse.json({
      success: true,
      customer: response.data,
    });
  } catch (error: any) {
    console.error("Error fetching customer profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
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

    const response = await api.put(`customers/${user.id}`, body);

    return NextResponse.json({
      success: true,
      customer: response.data,
    });
  } catch (error: any) {
    console.error("Error updating customer profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}

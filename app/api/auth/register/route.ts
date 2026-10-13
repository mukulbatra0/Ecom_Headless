import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    try {
      const response = await api.post("customers", {
        email,
        first_name: first_name || "",
        last_name: last_name || "",
        username: email,
        password,
        billing: {
          first_name: first_name || "",
          last_name: last_name || "",
          email,
          phone: phone || "",
        },
      });

      return NextResponse.json({
        success: true,
        customer: response.data,
      });
    } catch (apiError: any) {
      console.error("WooCommerce customer registration error:", apiError.response?.data || apiError.message);
      const errorMessage =
        apiError.response?.data?.message ||
        (apiError.response?.data?.code === "registration-error-email-exists"
          ? "An account with this email already exists"
          : "Registration failed. Please try again.");

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Registration endpoint error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

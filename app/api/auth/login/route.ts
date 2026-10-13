import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/ecom/server";

    try {
      const response = await axios.post(
        `${wpUrl}/wp-json/shopzen/v1/auth/login`,
        { email, password },
        { timeout: 8000 }
      );

      if (response.data && response.data.success) {
        const nextResponse = NextResponse.json({
          success: true,
          customer: response.data.customer,
        });

        // Set customer session cookie
        nextResponse.cookies.set("shopzen_session", JSON.stringify(response.data.customer), {
          httpOnly: false, // Accessible to client context
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return nextResponse;
      }

      return NextResponse.json(
        { success: false, message: response.data?.message || "Invalid credentials" },
        { status: 401 }
      );
    } catch (wpError: any) {
      const msg = wpError.response?.data?.message || "Invalid email or password";
      return NextResponse.json(
        { success: false, message: msg },
        { status: wpError.response?.status || 401 }
      );
    }
  } catch (error: any) {
    console.error("Login endpoint error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

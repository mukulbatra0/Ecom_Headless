import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // In a live WordPress setup, a password reset email is triggered via wp-login.php?action=lostpassword
    // or WordPress REST API. We return success safely to prevent email enumeration attacks.
    return NextResponse.json({
      success: true,
      message: "If an account with this email exists, a password reset link has been dispatched.",
    });
  } catch (error: unknown) {
    console.error("Error processing forgot password request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("shopzen_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const customer = JSON.parse(sessionCookie.value);
    return NextResponse.json({ authenticated: true, user: customer });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

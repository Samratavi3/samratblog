import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionCookie,
  isAdminRequest,
  passwordMatches,
} from "@/lib/middleware/adminAuth";

// Is this browser signed in as admin?
export async function GET(request) {
  return NextResponse.json({ authenticated: isAdminRequest(request) });
}

// Sign in with the admin password.
export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));

  if (!passwordMatches(password)) {
    // Slow down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  const cookie = createSessionCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}

// Sign out.
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

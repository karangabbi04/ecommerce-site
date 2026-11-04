import { NextRequest, NextResponse } from "next/server";

// Jin routes ko protect karna hai unka array
const protectedRoutes = ["/dashboard", "/admin/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const loginUrl = new URL("/auth/admin-login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${pathname}${request.nextUrl.search}`,
  );

  if (!accessToken || !process.env.NEXT_PUBLIC_API_BASE_URL) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const accessCheckUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")}/auth/check-access`;
    const response = await fetch(accessCheckUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Middleware sirf in routes pe apply hoga (Performance ke liye)
export const config = {
  matcher: ["/dashboard/:path*", "/admin/settings/:path*"],
};
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/admin/settings"];

function loginRedirect(request: NextRequest) {
  const loginUrl = new URL("/auth/admin-login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  const response = NextResponse.redirect(loginUrl);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    expires: new Date(0),
  };
  response.cookies.set("accessToken", "", cookieOptions);
  response.cookies.set("refreshToken", "", cookieOptions);
  return response;
}

function temporaryErrorRedirect(request: NextRequest) {
  const errorUrl = new URL("/auth/session-error", request.url);
  errorUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(errorUrl);
}

async function checkAccess(apiBaseUrl: string, accessToken: string) {
  return fetch(`${apiBaseUrl}/auth/check-access`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

  if (!apiBaseUrl) {
    return temporaryErrorRedirect(request);
  }

  let shouldRefresh = !accessToken;

  try {
    if (accessToken) {
      const accessResponse = await checkAccess(apiBaseUrl, accessToken);

      if (accessResponse.ok) {
        return NextResponse.next();
      }

      if (accessResponse.status === 401) {
        shouldRefresh = true;
      } else if (accessResponse.status === 403) {
        return loginRedirect(request);
      } else {
        return temporaryErrorRedirect(request);
      }
    }

    if (!shouldRefresh || !refreshToken) {
      return loginRedirect(request);
    }

    const refreshResponse = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      cache: "no-store",
    });

    if (refreshResponse.status === 401 || refreshResponse.status === 403) {
      return loginRedirect(request);
    }

    if (!refreshResponse.ok) {
      return temporaryErrorRedirect(request);
    }

    const refreshBody = await refreshResponse.json();
    const newAccessToken = refreshBody?.data?.accessToken;

    if (typeof newAccessToken !== "string" || !newAccessToken) {
      return loginRedirect(request);
    }

    const newAccessResponse = await checkAccess(apiBaseUrl, newAccessToken);

    if (newAccessResponse.status === 401 || newAccessResponse.status === 403) {
      return loginRedirect(request);
    }

    if (!newAccessResponse.ok) {
      return temporaryErrorRedirect(request);
    }

    const response = NextResponse.next();
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return response;
  } catch {
    return temporaryErrorRedirect(request);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/settings/:path*"],
};
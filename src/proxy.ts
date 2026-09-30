import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authSecret } from "@/lib/env";
import { routing } from "@/i18n/routing";

const handleI18n = createMiddleware(routing);

const META_PATHS = new Set([
  "/sitemap.xml",
  "/robots.txt",
  "/opengraph-image",
  "/twitter-image",
  "/icon",
  "/apple-icon",
  "/manifest.webmanifest",
  "/favicon.ico",
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (META_PATHS.has(pathname) || pathname.startsWith("/opengraph-image")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-lyne-locale", "fr");
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      const secret = authSecret();
      const token = secret ? await getToken({ req: request, secret }) : null;
      if (!token) {
        const url = new URL("/admin/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const response = handleI18n(request);
  response.headers.set("x-lyne-locale", detectLocale(pathname));
  return response;
}

function detectLocale(pathname: string) {
  const segment = pathname.split("/")[1];
  if (segment === "en" || segment === "ar") return segment;
  return "fr";
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};

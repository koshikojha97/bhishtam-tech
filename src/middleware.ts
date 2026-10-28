import { NextResponse, type NextRequest } from "next/server";

/**
 * Demo auth guard.
 * - Public: marketing site (/, /about, /features, /pricing, /contact, 404) and auth pages.
 * - Protected: /dashboard/** needs the `bd_session` cookie (set on Sign In / Sign Up).
 * - Signed-in users visiting /login or /signup are sent to /dashboard.
 * - Old URLs redirect: pre-/dashboard paths (/transactions …) and the old banking pages
 *   (/dashboard/transactions → /dashboard/threats …) go to their security equivalents.
 * Swap for NextAuth / your own session check in production.
 */
/** Old banking page → security page (same slot in the sidebar). */
const RENAMED: Record<string, string> = {
  transactions: "threats",
  accounts: "assets",
  investments: "vulnerabilities",
  "credit-cards": "devices",
  loans: "incidents",
  privileges: "access",
  services: "services",
  settings: "settings",
};

/** Resolves a legacy path to its new home, or null if it isn't one. */
function legacyTarget(pathname: string) {
  const m = pathname.match(/^(?:\/dashboard)?\/([a-z-]+)(\/.*)?$/);
  if (!m || !(m[1] in RENAMED)) return null;
  const target = `/dashboard/${RENAMED[m[1]]}${m[2] ?? ""}`;
  return target === pathname ? null : target;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get("bd_session")?.value);

  const legacy = legacyTarget(pathname);
  if (legacy) {
    const url = req.nextUrl.clone();
    url.pathname = legacy;
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/dashboard") && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  if (hasSession && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|fonts|site|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|woff2?|mp4)$).*)"],
};

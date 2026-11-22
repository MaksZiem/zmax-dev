import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "./i18n/config";

const DEFAULT_PREFIX = new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`);
const OTHER_PREFIX = new RegExp(`^/(${LOCALES.filter((l) => l !== DEFAULT_LOCALE).join("|")})(?=/|$)`);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (DEFAULT_PREFIX.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(DEFAULT_PREFIX, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  if (OTHER_PREFIX.test(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)"],
};

import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "./i18n/config";

function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";

  for (const part of header.split(",")) {
    const language = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(language)) return language;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/${preferredLocale(request)}`, request.url));
}

export const config = {
  matcher: "/",
};

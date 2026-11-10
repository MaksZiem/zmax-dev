import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "./lib/i18n";

function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";

  for (const part of header.split(",")) {
    const language = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (hasLocale(language)) return language;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/${preferredLocale(request)}`, request.url));
}

export const config = {
  matcher: "/",
};

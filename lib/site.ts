import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/config";

export const SITE_URL = "https://www.zmax-dev.pl";

export function localePath(locale: Locale, path = "") {
  if (locale === DEFAULT_LOCALE) return path || "/";
  return `/${locale}${path}`;
}

export function publicPathname(pathname: string) {
  return pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`), "") || "/";
}

export function stripLocale(pathname: string) {
  const rest = pathname.replace(new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`), "");
  return rest === "/" ? "" : rest;
}

export function localeAlternates(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(DEFAULT_LOCALE, path),
    },
  };
}

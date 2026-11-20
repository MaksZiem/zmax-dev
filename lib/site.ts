import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/config";

export const SITE_URL = "https://www.zmax-dev.pl";

export function localePath(locale: Locale, path = "") {
  return `/${locale}${path}`;
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

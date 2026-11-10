"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(pl|en)(?=\/|$)/, "");

  return (
    <nav aria-label="Language" className="flex items-center gap-1 font-mono text-xs">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${rest}`}
          hrefLang={locale}
          aria-current={locale === current ? "page" : undefined}
          className={
            locale === current
              ? "rounded px-2 py-1 bg-surface-strong text-foreground"
              : "rounded px-2 py-1 text-muted hover:text-foreground"
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}

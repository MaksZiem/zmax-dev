"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALES, type Locale } from "@/i18n/config";
import { localePath, stripLocale } from "@/lib/site";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const rest = stripLocale(pathname);

  return (
    <nav aria-label={t("language")} className="flex items-center gap-1 font-mono text-xs">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={localePath(locale, rest)}
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

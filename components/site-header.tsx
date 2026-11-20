import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { LanguageSwitcher } from "./language-switcher";
import { SiteNav, type NavItem } from "./site-nav";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");

  const items: NavItem[] = [
    { href: `${localePath(locale)}#about`, label: t("about") },
    { href: `${localePath(locale)}#contact`, label: t("contact") },
    { href: localePath(locale, "/projects"), label: t("projects") },
    { href: localePath(locale, "/cv"), label: t("cv") },
    { href: localePath(locale, "/tech-stack"), label: t("techStack") },
    { href: "https://github.com/MaksZiem", label: "GitHub", external: true },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={localePath(locale)} className="nav-logo font-mono text-sm font-medium tracking-tight">
          zmax<span className="text-accent">.dev</span>
        </Link>
        <SiteNav items={items} labels={{ main: t("main"), open: t("openMenu"), close: t("closeMenu") }}>
          <LanguageSwitcher current={locale} />
        </SiteNav>
      </div>
    </header>
  );
}

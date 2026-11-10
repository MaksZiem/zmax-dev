import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={`/${locale}`} className="font-mono text-sm font-medium tracking-tight">
          zmax<span className="text-accent">.dev</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href={`/${locale}#projects`} className="text-sm text-muted hover:text-foreground">
            {dict.projects}
          </Link>
          <a
            href="https://github.com/MaksZiem"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted hover:text-foreground"
          >
            GitHub
          </a>
          <LanguageSwitcher current={locale} />
        </div>
      </div>
    </header>
  );
}

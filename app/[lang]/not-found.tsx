import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { localePath } from "@/lib/site";

export default async function NotFound() {
  const requested = await getLocale();
  const lang = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const t = await getTranslations({ locale: lang, namespace: "notFound" });

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-muted">{t("lead")}</p>
      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link
          href={localePath(lang)}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
        >
          ← {t("home")}
        </Link>
        <Link
          href={localePath(lang, "/projects")}
          className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2 font-medium hover:bg-surface"
        >
          {t("projects")}
        </Link>
      </div>
    </div>
  );
}

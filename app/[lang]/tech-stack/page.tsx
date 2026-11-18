import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ComingSoonHeader, SkeletonLine } from "@/components/coming-soon";
import { isLocale } from "@/i18n/config";

const GROUPS = ["backend", "frontend", "database", "infra", "ai", "tools"] as const;

export async function generateMetadata({ params }: PageProps<"/[lang]/tech-stack">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getTranslations({ locale: lang, namespace: "techStack" });
  return { title: t("title"), description: t("lead") };
}

// Mocked for now: shows the planned grouping of the tech stack page.
export default async function TechStackPage({ params }: PageProps<"/[lang]/tech-stack">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  const t = await getTranslations("techStack");
  const tProjects = await getTranslations("projects");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <ComingSoonHeader
        homeHref={`/${lang}`}
        homeLabel={tProjects("home")}
        title={t("title")}
        lead={t("lead")}
        badge={t("soon")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((group) => (
          <section key={group} className="rounded-xl border border-line p-5" aria-labelledby={`stack-${group}`}>
            <h2 id={`stack-${group}`} className="font-mono text-xs uppercase tracking-widest text-accent">
              {t(`groups.${group}`)}
            </h2>
            <ul className="mt-4 space-y-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="h-8 w-8 shrink-0 rounded-lg bg-surface-strong" />
                  <span className="flex-1 space-y-1.5">
                    <SkeletonLine className="w-1/2" />
                    <SkeletonLine className="h-2 w-3/4 opacity-60" />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

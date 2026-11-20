import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ComingSoonHeader, SkeletonLine } from "@/components/coming-soon";
import { isLocale } from "@/i18n/config";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/cv">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getTranslations({ locale: lang, namespace: "cv" });
  return {
    title: t("title"),
    description: t("lead"),
    alternates: localeAlternates(lang, "/cv"),
    robots: { index: false, follow: true },
  };
}

// Mocked for now: shows the planned structure of the CV page.
export default async function CvPage({ params }: PageProps<"/[lang]/cv">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  const t = await getTranslations("cv");
  const tProjects = await getTranslations("projects");

  const sections = [
    { key: "experience", rows: 3 },
    { key: "education", rows: 2 },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <ComingSoonHeader
        homeHref={`/${lang}`}
        homeLabel={tProjects("home")}
        title={t("title")}
        lead={t("lead")}
        badge={t("soon")}
      />

      <button
        type="button"
        disabled
        className="mb-12 rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-muted opacity-60"
      >
        {t("download")} ↓
      </button>

      <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.key} aria-labelledby={`cv-${section.key}`}>
              <h2 id={`cv-${section.key}`} className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
                {t(`sections.${section.key}`)}
              </h2>
              <ol className="space-y-4 border-l border-line pl-6">
                {Array.from({ length: section.rows }, (_, i) => (
                  <li key={i} className="space-y-2 rounded-xl border border-line p-4">
                    <SkeletonLine className="w-24" />
                    <SkeletonLine className="h-4 w-2/3" />
                    <SkeletonLine className="w-5/6" />
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <section aria-labelledby="cv-skills">
          <h2 id="cv-skills" className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
            {t("sections.skills")}
          </h2>
          <div className="flex flex-wrap gap-2 rounded-xl border border-line p-4">
            {[16, 20, 12, 24, 14, 18, 22, 10, 16].map((w, i) => (
              <span key={i} aria-hidden="true" className="h-6 rounded-md bg-surface-strong" style={{ width: `${w * 4}px` }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

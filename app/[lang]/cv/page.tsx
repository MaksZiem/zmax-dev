import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { ProjectActions } from "@/components/project-actions";
import { getProjects } from "@/lib/projects";
import { localeAlternates, localePath } from "@/lib/site";

const CV_PDF = "/cv/Maksymilian_Ziembicki_CV.pdf";

const JOBS = [
  {
    key: "ebi",
    points: [
      "experience.ebi.points.ui",
      "experience.ebi.points.clients",
      "experience.ebi.points.standards",
      "experience.ebi.points.backend",
      "experience.ebi.points.spfx",
      "experience.ebi.points.performance",
    ],
  },
  { key: "helpdesk", points: ["experience.helpdesk.points.hardware", "experience.helpdesk.points.support"] },
] as const;

const SCHOOLS = ["pw", "ur", "zse"] as const;

const CV_PROJECTS = ["ai-agents-platform", "ai-observability", "ai-notes", "workout-tracker"];

const SKILLS = [
  { group: "frontend", items: ["TypeScript", "React", "Angular", "Next.js", "SharePoint Framework"] },
  { group: "backend", items: ["Node.js", "NestJS", "Express.js"] },
  { group: "database", items: ["MongoDB", "PostgreSQL"] },
  { group: "infra", items: ["Docker", "CI/CD", "Git", "GitHub"] },
  { group: "ai", items: ["Claude Code", "Cursor", "Google GenAI (Gemini)"] },
] as const;

const LANGUAGES = ["pl", "en"] as const;

const sectionTitle = "mb-5 font-mono text-xs uppercase tracking-widest text-accent";

export async function generateMetadata(
  { params }: PageProps<"/[lang]/cv">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getTranslations({ locale: lang, namespace: "cv" });
  return {
    title: t("title"),
    description: t("lead"),
    alternates: localeAlternates(lang, "/cv"),
    openGraph: { url: localePath(lang, "/cv"), images: (await parent).openGraph?.images },
    robots: { index: false, follow: true },
  };
}

export default async function CvPage({ params }: PageProps<"/[lang]/cv">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  const t = await getTranslations("cv");
  const tProjects = await getTranslations("projects");
  const projects = CV_PROJECTS.flatMap((slug) => getProjects(lang).filter((project) => project.slug === slug));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <Link href={localePath(lang)} className="text-sm text-muted hover:text-foreground">
        ← {tProjects("home")}
      </Link>

      <div className="mb-12 mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{t("lead")}</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
          <a
            href={CV_PDF}
            download
            className="group inline-flex items-center gap-3 rounded-lg bg-accent px-5 py-3 font-medium text-background transition-opacity hover:opacity-90"
          >
            {t("download")}
            <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
          <span className="font-mono text-xs text-muted">{t("downloadNote")}</span>
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-14">
          <section aria-labelledby="cv-profile">
            <h2 id="cv-profile" className={sectionTitle}>
              {t("sections.profile")}
            </h2>
            <p className="text-lg leading-relaxed">{t("profile")}</p>
          </section>

          <section aria-labelledby="cv-experience">
            <h2 id="cv-experience" className={sectionTitle}>
              {t("sections.experience")}
            </h2>
            <ol className="space-y-6 border-l border-line pl-6">
              {JOBS.map((job) => (
                <li key={job.key} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent"
                  />
                  <p className="font-mono text-xs text-muted">{t(`experience.${job.key}.period`)}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">
                    {t(`experience.${job.key}.role`)}
                    <span className="font-normal text-muted"> · {t(`experience.${job.key}.company`)}</span>
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-muted">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span aria-hidden="true" className="text-accent">
                          –
                        </span>
                        <span>{t(point)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="cv-projects">
            <h2 id="cv-projects" className={sectionTitle}>
              {t("sections.projects")}
            </h2>
            <ul className="grid gap-4">
              {projects.map((project) => (
                <li key={project.slug} className="flex flex-col rounded-xl border border-line p-5">
                  <h3 className="font-semibold tracking-tight">{project.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.tagline}</p>
                  <ProjectActions project={project} locale={lang} className="mt-5" />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cv-education">
            <h2 id="cv-education" className={sectionTitle}>
              {t("sections.education")}
            </h2>
            <ol className="divide-y divide-line rounded-xl border border-line">
              {SCHOOLS.map((school) => (
                <li key={school} className="grid gap-1 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
                  <div>
                    <h3 className="font-semibold tracking-tight">{t(`education.${school}.school`)}</h3>
                    <p className="mt-1 text-sm text-muted">{t(`education.${school}.field`)}</p>
                  </div>
                  <p className="font-mono text-xs text-muted sm:pt-1">{t(`education.${school}.period`)}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-10 md:sticky md:top-24 md:self-start">
          <section aria-labelledby="cv-skills">
            <h2 id="cv-skills" className={sectionTitle}>
              {t("sections.skills")}
            </h2>
            <dl className="space-y-5 rounded-xl border border-line p-5">
              {SKILLS.map(({ group, items }) => (
                <div key={group}>
                  <dt className="text-sm font-semibold">{t(`skillGroups.${group}`)}</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span key={item} className="rounded-md bg-surface-strong px-2 py-0.5 text-xs">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="cv-languages">
            <h2 id="cv-languages" className={sectionTitle}>
              {t("sections.languages")}
            </h2>
            <ul className="space-y-2 rounded-xl border border-line p-5 text-sm">
              {LANGUAGES.map((language) => (
                <li key={language}>{t(`languages.${language}`)}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

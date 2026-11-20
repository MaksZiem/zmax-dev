import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { getProjects } from "@/lib/projects";
import { localeAlternates, localePath } from "@/lib/site";
import { buildTechStack } from "@/lib/tech-stack";

export async function generateMetadata({ params }: PageProps<"/[lang]/tech-stack">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getTranslations({ locale: lang, namespace: "techStack" });
  return {
    title: t("title"),
    description: t("lead"),
    alternates: localeAlternates(lang, "/tech-stack"),
    openGraph: { url: localePath(lang, "/tech-stack") },
  };
}

export default async function TechStackPage({ params }: PageProps<"/[lang]/tech-stack">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  const t = await getTranslations("techStack");
  const tProjects = await getTranslations("projects");
  const stack = buildTechStack(getProjects(lang));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <Link href={`/${lang}`} className="text-sm text-muted hover:text-foreground">
        ← {tProjects("home")}
      </Link>

      <div className="mb-12 mt-8 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{t("lead")}</p>
      </div>

      <div className="gap-6 lg:columns-2">
        {stack.map(({ group, techs }) => (
          <section
            key={group}
            aria-labelledby={`stack-${group}`}
            className="mb-6 break-inside-avoid rounded-xl border border-line p-5 sm:p-6"
          >
            <h2 id={`stack-${group}`} className="font-mono text-xs uppercase tracking-widest text-accent">
              {t(`groups.${group}`)}
            </h2>
            <ul className="mt-4 divide-y divide-line">
              {techs.map((tech) => (
                <li
                  key={tech.name}
                  className="grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:items-baseline sm:gap-4"
                >
                  <span className="font-semibold tracking-tight">{tech.name}</span>
                  <span className="flex flex-wrap gap-1.5">
                    <span className="sr-only">{t("usedIn")}:</span>
                    {tech.projects.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/${lang}/projects/${project.slug}`}
                        className="rounded-md border border-line px-2 py-0.5 text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
                      >
                        {project.title}
                      </Link>
                    ))}
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

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { getProjects } from "@/lib/projects";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getTranslations({ locale: lang, namespace: "projects" });
  return { title: t("all"), description: t("lead") };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  const t = await getTranslations("projects");
  const projects = getProjects(lang);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <Link href={`/${lang}`} className="text-sm text-muted hover:text-foreground">
        ← {t("home")}
      </Link>

      <div className="mb-12 mt-8 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("all")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{t("lead")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={lang} />
        ))}
      </div>
    </div>
  );
}

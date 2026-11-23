import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Project } from "@/lib/projects";
import { localePath } from "@/lib/site";

export const secondaryAction =
  "relative z-10 rounded-lg border border-line-strong px-4 py-2 font-medium hover:bg-surface";

export function ProjectActions({
  project,
  locale,
  className = "",
  children,
}: {
  project: Pick<Project, "slug" | "repo" | "demo">;
  locale: Locale;
  className?: string;
  children?: ReactNode;
}) {
  const t = useTranslations("projects");

  return (
    <div className={`flex flex-wrap items-center gap-3 text-sm ${className}`}>
      <Link
        href={localePath(locale, `/projects/${project.slug}`)}
        className="group/details relative z-10 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
      >
        {t("details")}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover/details:translate-x-0.5">
          →
        </span>
      </Link>
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noreferrer" className={secondaryAction}>
          {t("demo")} ↗
        </a>
      )}
      {project.repo && (
        <a href={project.repo} target="_blank" rel="noreferrer" className={secondaryAction}>
          {t("source")} ↗
        </a>
      )}
      {children}
    </div>
  );
}

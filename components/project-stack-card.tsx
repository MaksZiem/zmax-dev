import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import type { Project, StackGroup } from "@/lib/projects";
import { stackHighlights } from "./project-card";
import { getTerminalDemo, REPO_DIRS } from "@/lib/terminal-demos";
import { ProjectTerminal } from "./project-terminal";
import { TestsChip } from "./project-quality";

const GLOWS = ["#8b6cff", "#4c9fff", "#3ccf91"];
const GROUP_ORDER: StackGroup[] = ["backend", "frontend", "database", "ai"];

// One screenshot per project for the home page card; the full gallery stays on the project page.
const HOME_SHOTS: Record<string, string> = {
  "ai-agents-platform": "dashboard.webp",
  "ai-observability": "incident.webp",
  "ai-notes": "agent.webp",
};

function homeShot(project: Project) {
  const file = HOME_SHOTS[project.slug];
  if (!file) return project.cover;
  return project.screenshots.find((s) => s.src.endsWith(`/${file}`))?.src ?? project.cover;
}

function shortName(item: string) {
  return item.replace(/\s*\(.*$/, "").trim();
}

export function ProjectStackCard({
  project,
  index,
  locale,
}: {
  project: Project;
  index: number;
  locale: Locale;
}) {
  const t = useTranslations();
  const href = `/${locale}/projects/${project.slug}`;
  const style = { "--i": index, "--glow": GLOWS[index % GLOWS.length] } as CSSProperties;
  const shot = homeShot(project);

  return (
    <div data-stack-card className="stack-card" style={style}>
      <div data-fog="slow" className="h-full">
        <article className="stack-inner relative h-full overflow-hidden rounded-[1.75rem] border border-line-strong md:rounded-[2.25rem]">
          <div className="stack-glow" aria-hidden="true" />

          <div className="relative grid h-full gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10 md:p-12">
            <div className="flex min-h-0 flex-col">
              <h3 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                <Link href={href} className="after:absolute after:inset-0">
                  {project.title}
                </Link>
              </h3>
              <p className="mt-4 line-clamp-3 max-w-xl text-base leading-relaxed text-muted">{project.tagline}</p>

              {shot && (
                <div className="group/shot relative mt-6 min-h-24 flex-1 overflow-hidden rounded-xl border border-line">
                  <Image
                    src={shot}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover object-top opacity-90 brightness-90 saturate-[.65] transition duration-500 group-hover/shot:opacity-100 group-hover/shot:brightness-100 group-hover/shot:saturate-100"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[var(--glow)] opacity-20 mix-blend-color transition-opacity duration-500 group-hover/shot:opacity-10"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
                  />
                </div>
              )}

              <div className={shot ? "pt-5" : "mt-auto pt-8"}>
                <ul className="flex flex-wrap gap-1.5">
                  {project.quality && <TestsChip tests={project.quality.tests} />}
                  {stackHighlights(project).map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                  <Link
                    href={href}
                    className="group/details relative z-10 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
                  >
                    {t("projects.details")}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover/details:translate-x-0.5">
                      →
                    </span>
                  </Link>
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 rounded-lg border border-line-strong px-4 py-2 font-medium hover:bg-surface"
                    >
                      {t("projects.source")} ↗
                    </a>
                  )}
                  {project.apiDocs && (
                    <a
                      href={project.apiDocs}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 rounded-lg border border-line-strong px-4 py-2 font-medium hover:bg-surface"
                    >
                      {t("projects.apiDocs")} ↗
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-0 md:block">
              <ProjectTerminal
                slug={project.slug}
                stack={GROUP_ORDER.filter((g) => project.stack[g]?.length).map((g) => [
                  t(`projects.stackGroups.${g}`).toLowerCase(),
                  project.stack[g]!.slice(0, 3).map(shortName).join(", "),
                ])}
                demo={getTerminalDemo(project.slug, locale)}
                repo={project.repo}
                dirs={REPO_DIRS[project.slug] ?? null}
                labels={{
                  hint: t("terminal.hint"),
                  help: t("terminal.help"),
                  notFound: t("terminal.notFound"),
                  opening: t("terminal.opening"),
                  noRepo: t("terminal.noRepo"),
                }}
              />
            </div>
          </div>

          <span className="stack-dim" aria-hidden="true" />
        </article>
      </div>
    </div>
  );
}

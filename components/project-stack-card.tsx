import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Project, StackGroup } from "@/lib/projects";
import { stackHighlights } from "./project-card";
import { getTerminalDemo, REPO_DIRS } from "@/lib/terminal-demos";
import { ProjectTerminal } from "./project-terminal";
import { StatusBadge } from "./status-badge";

// one smoke tint per card, matching the background palette
const GLOWS = ["#8b6cff", "#4c9fff", "#3ccf91"];
const GROUP_ORDER: StackGroup[] = ["backend", "frontend", "database", "ai"];

function shortName(item: string) {
  return item.replace(/\s*\(.*$/, "").trim();
}

export function ProjectStackCard({
  project,
  index,
  total,
  locale,
  dict,
}: {
  project: Project;
  index: number;
  total: number;
  locale: Locale;
  dict: Dictionary;
}) {
  const href = `/${locale}/projects/${project.slug}`;
  const style = { "--i": index, "--glow": GLOWS[index % GLOWS.length] } as CSSProperties;

  return (
    <div data-stack-card className="stack-card" style={style}>
      <div data-fog="slow" className="h-full">
        <article className="stack-inner relative h-full overflow-hidden rounded-[1.75rem] border border-line-strong md:rounded-[2.25rem]">
          <div className="stack-glow" aria-hidden="true" />

          <div className="relative grid h-full gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10 md:p-12">
            <div className="flex min-h-0 flex-col">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="font-mono text-sm text-accent">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <StatusBadge status={project.status} dict={dict} />
                <span className="font-mono">{project.period}</span>
              </div>

              <h3 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                <Link href={href} className="after:absolute after:inset-0">
                  {project.title}
                </Link>
              </h3>
              <p className="mt-5 line-clamp-4 max-w-xl text-lg leading-relaxed text-muted">{project.tagline}</p>

              <div className="mt-auto pt-8">
                <ul className="flex flex-wrap gap-1.5">
                  {stackHighlights(project).map((item) => (
                    <li key={item} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-5 text-sm">
                  <span className="font-medium text-foreground">{dict.details} →</span>
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 text-muted hover:text-foreground"
                    >
                      {dict.source}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-0 md:block">
              {project.cover ? (
                <div className="relative h-full overflow-hidden rounded-2xl border border-line">
                  <Image src={project.cover} alt="" fill sizes="50vw" className="object-cover object-top" />
                </div>
              ) : (
                <ProjectTerminal
                  slug={project.slug}
                  stack={GROUP_ORDER.filter((g) => project.stack[g]?.length).map((g) => [
                    dict.stackGroups[g].toLowerCase(),
                    project.stack[g]!.slice(0, 3).map(shortName).join(", "),
                  ])}
                  demo={getTerminalDemo(project.slug, locale)}
                  repo={project.repo}
                  dirs={REPO_DIRS[project.slug] ?? null}
                  labels={dict.terminal}
                />
              )}
            </div>
          </div>

          <span className="stack-dim" aria-hidden="true" />
        </article>
      </div>
    </div>
  );
}

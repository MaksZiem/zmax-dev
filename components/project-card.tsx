import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { StatusBadge } from "./status-badge";

const MAX_CHIPS = 6;

// "Next.js 16 (App Router)" -> "Next.js 16": the card only needs the name.
// Also cuts an unclosed "(" — YAML splits "Gemini (text, function calling)" at the comma.
function shortName(item: string) {
  return item.replace(/\s*\(.*$/, "").trim();
}

export function stackHighlights(project: Project) {
  const groups = [project.stack.backend, project.stack.frontend, project.stack.database, project.stack.ai];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const group of groups) {
    const first = group?.[0];
    if (first && !seen.has(shortName(first))) {
      seen.add(shortName(first));
      result.push(shortName(first));
    }
  }

  for (const item of Object.values(project.stack).flat()) {
    if (result.length >= MAX_CHIPS) break;
    const name = shortName(item ?? "");
    if (name && !seen.has(name)) {
      seen.add(name);
      result.push(name);
    }
  }

  return result.slice(0, MAX_CHIPS);
}

export function CoverPlaceholder({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-surface p-5 font-mono text-xs text-muted">
      <span>~/{project.slug}</span>
      <div className="space-y-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <div key={tag}>
            <span className="text-accent">$</span> {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectCard({ project, locale, dict }: { project: Project; locale: Locale; dict: Dictionary }) {
  const href = `/${locale}/projects/${project.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-background transition-colors hover:border-line-strong">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
        {project.cover ? (
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <CoverPlaceholder project={project} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-3 text-xs text-muted">
          <StatusBadge status={project.status} dict={dict} />
          <span className="font-mono">{project.period}</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">
            <Link href={href} className="after:absolute after:inset-0">
              {project.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>
        </div>

        <ul className="mt-auto flex flex-wrap gap-1.5">
          {stackHighlights(project).map((item) => (
            <li key={item} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
              {item}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 pt-1 text-sm">
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
    </article>
  );
}

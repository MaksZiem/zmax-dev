import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { StatusBadge } from "@/components/status-badge";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getProject, getProjectSlugs, type StackGroup } from "@/lib/projects";

const stackOrder: StackGroup[] = ["frontend", "backend", "database", "infra", "ai"];

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const project = getProject(lang, slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.tagline,
    alternates: { languages: { pl: `/pl/projects/${slug}`, en: `/en/projects/${slug}` } },
    openGraph: project.cover ? { images: [project.cover] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const project = getProject(lang, slug);
  if (!project) notFound();
  const dict = getDictionary(lang);

  return (
    <article className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <header className="border-b border-line pb-10 pt-10 sm:pt-14">
        <Link href={`/${lang}#projects`} className="text-sm text-muted hover:text-foreground">
          ← {dict.back}
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{project.tagline}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <StatusBadge status={project.status} dict={dict} />
          <span>
            <span className="text-muted">{dict.period_label}: </span>
            <span className="font-mono">{project.period}</span>
          </span>
          <span>
            <span className="text-muted">{dict.role_label}: </span>
            {project.role}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              {dict.source} ↗
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium hover:bg-surface"
            >
              {dict.demo} ↗
            </a>
          )}
        </div>
      </header>

      <section aria-labelledby="stack" className="border-b border-line py-10">
        <h2 id="stack" className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">
          {dict.stack}
        </h2>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {stackOrder
            .filter((group) => project.stack[group]?.length)
            .map((group) => (
              <div key={group}>
                <dt className="mb-2 text-sm font-medium">{dict.stackGroups[group]}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.stack[group]!.map((item) => (
                    <span key={item} className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-muted">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
        </dl>
      </section>

      {project.screenshots.length > 0 && (
        <section aria-labelledby="screenshots" className="border-b border-line py-10">
          <h2 id="screenshots" className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">
            {dict.screenshots}
          </h2>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {project.screenshots.map((shot) => (
              <figure key={shot.src} className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[45%]">
                <a href={shot.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-line">
                  <Image src={shot.src} alt={shot.caption} width={1600} height={1000} className="h-auto w-full" />
                </a>
                <figcaption className="mt-2 text-sm text-muted">{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <div className="gap-12 pt-10 lg:grid lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label={dict.contents} className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">{dict.contents}</p>
            <ol className="space-y-2 border-l border-line text-sm">
              {project.toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="-ml-px block border-l border-transparent pl-3 text-muted hover:border-foreground hover:text-foreground">
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <Markdown source={project.body} dict={dict} />
      </div>
    </article>
  );
}

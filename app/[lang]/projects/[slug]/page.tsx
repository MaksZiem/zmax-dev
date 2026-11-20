import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { ProjectQuality } from "@/components/project-quality";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { TableOfContents } from "@/components/table-of-contents";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { getProject, getProjectSlugs, splitAfterTesting, type StackGroup } from "@/lib/projects";
import { localeAlternates, localePath } from "@/lib/site";

const stackOrder: StackGroup[] = [
  "frontend",
  "backend",
  "database",
  "infra",
  "ai",
];

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = getProject(lang, slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.tagline,
    alternates: localeAlternates(lang, `/projects/${slug}`),
    openGraph: {
      type: "article",
      url: localePath(lang, `/projects/${slug}`),
      title: project.title,
      description: project.tagline,
      ...(project.cover && { images: [project.cover] }),
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  const project = getProject(lang, slug);
  if (!project) notFound();
  const t = await getTranslations("projects");
  const tMarkdown = await getTranslations("markdown");
  const body = splitAfterTesting(project.body);

  return (
    <div className="relative overflow-x-clip">
      <div className="dot-field" aria-hidden="true" />
      <article className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <header className="border-b border-line pb-10 pt-10 sm:pt-14">
          <Link
            href={localePath(lang, "/projects")}
            className="text-sm text-muted hover:text-foreground"
          >
            ← {t("back")}
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
            {project.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                {t("source")} ↗
              </a>
            )}
            {project.apiDocs && (
              <a
                href={project.apiDocs}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium hover:bg-surface"
              >
                {t("apiDocs")} ↗
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium hover:bg-surface"
              >
                {t("demo")} ↗
              </a>
            )}
          </div>
        </header>

        <section aria-labelledby="stack" className="border-b border-line py-10">
          <h2
            id="stack"
            className="mb-6 text-sm font-medium uppercase tracking-wider text-muted"
          >
            {t("stack")}
          </h2>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {stackOrder
              .filter((group) => project.stack[group]?.length)
              .map((group) => (
                <div key={group}>
                  <dt className="mb-2 text-sm font-medium">
                    {t(`stackGroups.${group}`)}
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {project.stack[group]!.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
          </dl>
        </section>

        {project.screenshots.length > 0 && (
          <section
            aria-labelledby="screenshots"
            className="border-b border-line py-10"
          >
            <h2
              id="screenshots"
              className="mb-6 text-sm font-medium uppercase tracking-wider text-muted"
            >
              {t("screenshots")}
            </h2>
            <ScreenshotGallery
              shots={project.screenshots}
              closeLabel={tMarkdown("close")}
              prevLabel={t("previousScreenshot")}
              nextLabel={t("nextScreenshot")}
            />
          </section>
        )}

        <div className="gap-12 pt-10 lg:grid lg:grid-cols-[200px_minmax(0,1fr)]">
          <TableOfContents items={project.toc} label={t("contents")} />
          <div className="min-w-0">
            {project.quality && body ? (
              <>
                <Markdown source={body[0]} />
                <ProjectQuality quality={project.quality} />
                {body[1] && <Markdown source={body[1]} />}
              </>
            ) : (
              <Markdown source={project.body} />
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

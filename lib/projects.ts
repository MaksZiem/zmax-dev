import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/config";
import { slugify } from "./slugify";

const contentDir = path.join(process.cwd(), "content/projects");
const publicDir = path.join(process.cwd(), "public");

export type StackGroup = "frontend" | "backend" | "database" | "infra" | "ai";

export interface Screenshot {
  src: string;
  caption: string;
}

export type TestKind = "unit" | "e2e" | "frontend";

export interface Quality {
  tests: number;
  kinds: TestKind[];
  framework: string;
  ci: string | null;
  ciBadge: string | null;
  covered: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  status: string;
  period: string;
  role: string;
  stack: Partial<Record<StackGroup, string[]>>;
  tags: string[];
  repo: string | null;
  demo: string | null;
  apiDocs: string | null;
  cover: string | null;
  screenshots: Screenshot[];
  quality: Quality | null;
  featured: boolean;
  order: number;
}

export interface ProjectDetail extends Project {
  body: string;
  toc: { id: string; title: string }[];
}

interface Frontmatter extends Omit<Project, "cover" | "screenshots" | "quality"> {
  cover?: string;
  screenshots?: { file: string; caption: string }[];
  quality?: Partial<Omit<Quality, "ciBadge">>;
}

const WORKFLOW_URL = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/actions\/workflows\/([\w.-]+)$/;

function ciBadge(workflow: string | null): string | null {
  const match = workflow?.match(WORKFLOW_URL);
  if (!match) return null;
  const [, owner, repo, file] = match;
  return `https://img.shields.io/github/actions/workflow/status/${owner}/${repo}/${file}?branch=main&style=flat-square&label=CI&logo=githubactions&logoColor=white`;
}

function toQuality(data: Frontmatter["quality"]): Quality | null {
  if (!data?.tests) return null;
  const ci = data.ci ?? null;
  return {
    tests: data.tests,
    kinds: data.kinds ?? [],
    framework: data.framework ?? "",
    ci,
    ciBadge: ciBadge(ci),
    covered: data.covered ?? [],
  };
}

function publicImage(slug: string, file: string | undefined): string | null {
  if (!file) return null;
  const src = `/projects/${slug}/${path.basename(file)}`;
  return existsSync(path.join(publicDir, src)) ? src : null;
}

function readProject(slug: string, locale: Locale): { data: Frontmatter; body: string } | null {
  const file = path.join(contentDir, slug, `${locale}.md`);
  if (!existsSync(file)) return null;
  const { data, content } = matter(readFileSync(file, "utf8"));
  return { data: data as Frontmatter, body: content };
}

function toProject(slug: string, data: Frontmatter): Project {
  return {
    slug,
    title: data.title,
    tagline: data.tagline,
    status: data.status,
    period: String(data.period ?? ""),
    role: data.role,
    stack: data.stack ?? {},
    tags: data.tags ?? [],
    repo: data.repo ?? null,
    demo: data.demo ?? null,
    apiDocs: data.apiDocs ?? null,
    cover: publicImage(slug, data.cover),
    screenshots: (data.screenshots ?? []).flatMap(({ file, caption }) => {
      const src = publicImage(slug, file);
      return src ? [{ src, caption }] : [];
    }),
    quality: toQuality(data.quality),
    featured: data.featured ?? false,
    order: data.order ?? 99,
  };
}

export function getProjectSlugs(): string[] {
  if (!existsSync(contentDir)) return [];
  return readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getProjects(locale: Locale): Project[] {
  return getProjectSlugs()
    .flatMap((slug) => {
      const project = readProject(slug, locale);
      return project ? [toProject(slug, project.data)] : [];
    })
    .sort((a, b) => a.order - b.order);
}

export function getProject(locale: Locale, slug: string): ProjectDetail | null {
  const project = readProject(slug, locale);
  if (!project) return null;

  const body = project.body
    .replace(/^\s*# .+\n/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\s*[-*]\s*$/gm, "");

  return { ...toProject(slug, project.data), body, toc: tableOfContents(body) };
}

const TESTING_HEADINGS = ["## Testing & quality", "## Testy i jakość"];

export function splitAfterTesting(markdown: string): [string, string] | null {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => TESTING_HEADINGS.includes(line.trim()));
  if (start === -1) return null;

  let inFence = false;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("```")) inFence = !inFence;
    if (!inFence && lines[i].startsWith("## ")) {
      return [lines.slice(0, i).join("\n"), lines.slice(i).join("\n")];
    }
  }
  return [markdown, ""];
}

function tableOfContents(markdown: string) {
  const toc: { id: string; title: string }[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence || !line.startsWith("## ")) continue;
    const title = line.slice(3).trim();
    toc.push({ id: slugify(title), title });
  }

  return toc;
}

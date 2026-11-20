import "server-only";
import type { Project } from "./projects";

export const TECH_GROUPS = ["languages", "backend", "frontend", "database", "realtime", "ai", "tools"] as const;
export type TechGroup = (typeof TECH_GROUPS)[number];

interface TechDef {
  name: string;
  group: TechGroup;
  // Matched line by line against a project's stack entries, tags and quality/tooling markers (see corpus()).
  match: RegExp;
}

const TECHS: TechDef[] = [
  { name: "TypeScript", group: "languages", match: /^TypeScript/m },
  { name: "Node.js", group: "languages", match: /^NestJS/m },

  { name: "NestJS", group: "backend", match: /^NestJS/m },
  { name: "TypeORM", group: "backend", match: /^TypeORM$/m },
  { name: "Zod", group: "backend", match: /^Zod$/m },
  { name: "class-validator", group: "backend", match: /^class-validator$/m },
  { name: "BullMQ", group: "backend", match: /^BullMQ/m },
  { name: "Hocuspocus", group: "backend", match: /^Hocuspocus/m },

  { name: "Next.js", group: "frontend", match: /^Next\.js/m },
  { name: "React", group: "frontend", match: /^React \d/m },
  { name: "Tailwind CSS", group: "frontend", match: /^Tailwind CSS/m },
  { name: "Vite", group: "frontend", match: /^Vite$/m },
  { name: "TanStack Query", group: "frontend", match: /^TanStack Query$/m },
  { name: "React Router", group: "frontend", match: /^React Router$/m },
  { name: "MUI", group: "frontend", match: /^MUI$/m },
  { name: "Tiptap", group: "frontend", match: /^Tiptap/m },
  { name: "next-intl", group: "frontend", match: /^next-intl$/m },
  { name: "openapi-fetch", group: "frontend", match: /^openapi-fetch$/m },

  { name: "PostgreSQL", group: "database", match: /^PostgreSQL$/m },
  { name: "Redis", group: "database", match: /^Redis$/m },

  { name: "Socket.IO", group: "realtime", match: /^Socket\.IO/m },
  { name: "Server-Sent Events", group: "realtime", match: /^(Server-Sent Events|SSE)$/m },
  { name: "Yjs (CRDT)", group: "realtime", match: /^Yjs/m },
  { name: "Resend", group: "realtime", match: /^Resend/m },

  { name: "Google Gemini", group: "ai", match: /^Google Gemini/m },
  { name: "Function calling", group: "ai", match: /function calling/im },
  { name: "Structured output", group: "ai", match: /structured JSON|JSON schema output/im },
  { name: "RAG / embeddings", group: "ai", match: /^rag$|embeddings/im },

  { name: "GitHub Actions", group: "tools", match: /^ci:github-actions$/m },
  { name: "Swagger / OpenAPI", group: "tools", match: /^api-docs$/m },
  { name: "Vitest", group: "tools", match: /^test:Vitest$/m },
  { name: "Jest", group: "tools", match: /^test:Jest$/m },
];

export interface TechUsage {
  name: string;
  projects: Pick<Project, "slug" | "title">[];
}

export type TechStack = { group: TechGroup; techs: TechUsage[] }[];

function corpus(project: Project): string {
  return [
    ...Object.values(project.stack).flat(),
    ...project.tags,
    project.quality ? `test:${project.quality.framework}` : "",
    project.quality?.ci?.startsWith("https://github.com/") ? "ci:github-actions" : "",
    project.apiDocs ? "api-docs" : "",
  ].join("\n");
}

export function buildTechStack(projects: Project[]): TechStack {
  const texts = projects.map((p) => [p, corpus(p)] as const);

  const usages = TECHS.map((tech) => ({
    ...tech,
    projects: texts.filter(([, text]) => tech.match.test(text)).map(([p]) => ({ slug: p.slug, title: p.title })),
  })).filter((tech) => tech.projects.length > 0);

  return TECH_GROUPS.map((group) => ({
    group,
    // Most used first; ties keep the catalog order above.
    techs: usages
      .filter((t) => t.group === group)
      .sort((a, b) => b.projects.length - a.projects.length)
      .map(({ name, projects }) => ({ name, projects })),
  })).filter((g) => g.techs.length > 0);
}

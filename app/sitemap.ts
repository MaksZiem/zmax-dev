import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { getProjectSlugs } from "@/lib/projects";
import { localePath, SITE_URL } from "@/lib/site";

function entry(path: string, priority: number): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${localePath(l, path)}`]));

  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${localePath(locale, path)}`,
    lastModified: new Date(),
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("", 1),
    ...entry("/projects", 0.8),
    ...entry("/tech-stack", 0.6),
    ...getProjectSlugs().flatMap((slug) => entry(`/projects/${slug}`, 0.7)),
  ];
}

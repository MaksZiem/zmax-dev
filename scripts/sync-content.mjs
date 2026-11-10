// Copies portfolio descriptions and screenshots from the project repos into this site.
// Run with `npm run sync` after editing any project's portfolio/ folder.
import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const projectsDir = path.resolve(root, process.env.PROJECTS_DIR ?? "../..");

const sources = [
  "ai-agents-platform",
  "ai-observability-incident-response",
  "workout tracker",
  "ai-notes",
];

const contentDir = path.join(root, "content/projects");
const publicDir = path.join(root, "public/projects");
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

await rm(contentDir, { recursive: true, force: true });
await rm(publicDir, { recursive: true, force: true });

for (const source of sources) {
  const portfolio = path.join(projectsDir, source, "portfolio");

  if (!existsSync(portfolio)) {
    console.warn(`skip ${source}: no portfolio/ folder`);
    continue;
  }

  const { data } = matter(await readFile(path.join(portfolio, "PORTFOLIO.en.md"), "utf8"));
  const slug = data.slug;
  const targetContent = path.join(contentDir, slug);
  await mkdir(targetContent, { recursive: true });

  for (const lang of ["en", "pl"]) {
    const file = path.join(portfolio, `PORTFOLIO.${lang}.md`);
    if (existsSync(file)) {
      await cp(file, path.join(targetContent, `${lang}.md`));
    }
  }

  const screenshots = path.join(portfolio, "screenshots");
  let copied = 0;

  if (existsSync(screenshots)) {
    for (const name of await readdir(screenshots)) {
      if (!imageExtensions.has(path.extname(name).toLowerCase())) continue;
      await mkdir(path.join(publicDir, slug), { recursive: true });
      await cp(path.join(screenshots, name), path.join(publicDir, slug, name));
      copied++;
    }
  }

  console.log(`${slug}: descriptions copied, ${copied} screenshot(s)`);
}

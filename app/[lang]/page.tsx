import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const projects = getProjects(lang);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <p className="font-mono text-sm text-accent">{dict.role}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Maksymilian Ziembicki</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{dict.intro}</p>
      </section>

      <section id="projects" className="scroll-mt-20 border-t border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">{dict.projects}</h2>
            <p className="mt-2 text-muted">{dict.projectsLead}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={lang} dict={dict} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

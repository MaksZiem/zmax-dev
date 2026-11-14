import { notFound } from "next/navigation";
import { HeroBackground } from "@/components/hero-background";
import { ProjectCard } from "@/components/project-card";
import { ProjectStack } from "@/components/project-stack";
import { ProjectStackCard } from "@/components/project-stack-card";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";

// shown as the stacked showcase, in this order; the rest go to "More projects"
const FEATURED = ["ai-agents-platform", "ai-observability-incident-response", "ai-notes"];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const projects = getProjects(lang);
  const featured = FEATURED.flatMap((slug) => projects.filter((p) => p.slug === slug));
  const others = projects.filter((p) => !FEATURED.includes(p.slug));

  return (
    <>
      {/* one stage for hero + about: the galaxy canvas stays pinned behind both */}
      <div className="relative">
        <HeroBackground />

        {/* tall track: the hero stays pinned while the galaxy flows down into fog */}
        <div data-hero-track className="relative h-[140vh]">
          <section className="sticky top-14 h-[calc(100svh-3.5rem)]">
            <div className="hero-content mx-auto flex h-full max-w-6xl flex-col justify-center px-4 sm:px-6">
              <p className="font-mono text-sm text-accent">{dict.role}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Maksymilian Ziembicki</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{dict.intro}</p>
              <a
                href="#about"
                className="mt-12 inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground"
              >
                <span className="scroll-cue-line" aria-hidden="true" />
                {dict.scroll}
              </a>
            </div>
          </section>
        </div>

        <section id="about" className="relative scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 pb-40 pt-20 sm:px-6 md:pt-28">
            <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end md:gap-16">
              <div data-fog>
                <p className="font-mono text-sm text-accent">01 /</p>
                <h2 className="mt-3 text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">{dict.about}</h2>
              </div>
              <p data-fog className="text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus,
                posuere velit aliquet.
              </p>
            </div>

            <div className="mt-20 grid gap-6 text-lg leading-relaxed text-muted md:grid-cols-2 md:gap-x-16">
              <p data-fog>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Curabitur blandit tempus porttitor.
              </p>
              <p data-fog>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum. Maecenas faucibus mollis interdum.
              </p>
              <p data-fog>
                Nullam quis risus eget urna mollis ornare vel eu leo. Cras mattis consectetur purus sit amet fermentum.
                Vestibulum id ligula porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur. Donec
                ullamcorper nulla non metus auctor fringilla.
              </p>
              <p data-fog>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Morbi leo risus, porta ac
                consectetur ac, vestibulum at eros. Etiam porta sem malesuada magna mollis euismod.
              </p>
            </div>

            <dl className="mt-20 grid gap-10 border-t border-line pt-12 sm:grid-cols-3">
              {["01", "02", "03"].map((n) => (
                <div key={n} data-fog>
                  <dt className="font-mono text-sm text-accent">{n}</dt>
                  <dd className="mt-3">
                    <span className="block text-xl font-semibold">Lorem ipsum</span>
                    <span className="mt-2 block leading-relaxed text-muted">
                      Sed posuere consectetur est at lobortis. Nulla vitae elit libero, a pharetra augue. Donec sed odio
                      dui.
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-20 grid gap-6 text-lg leading-relaxed text-muted md:grid-cols-2 md:gap-x-16">
              <p data-fog>
                Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit
                amet risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
              </p>
              <p data-fog>
                Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean eu leo quam. Pellentesque
                ornare sem lacinia quam venenatis vestibulum. Cras justo odio, dapibus ac facilisis in, egestas eget
                quam.
              </p>
            </div>
          </div>
        </section>

        {/* featured projects: cards rise out of the smoke and stack on top of each other */}
        <section id="projects" className="relative scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24">
            <ProjectStack>
              <div className="flex flex-wrap items-end justify-between gap-8">
                <div>
                  <p data-fog className="font-mono text-sm text-accent">
                    02 / {dict.projects}
                  </p>
                  <h2
                    data-reveal-lines
                    className="mt-3 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
                  >
                    <span className="reveal-line">
                      <span className="reveal-line-in">{dict.workTitle[0]}</span>
                    </span>
                    <span className="reveal-line">
                      <span className="reveal-line-in text-muted">{dict.workTitle[1]}</span>
                    </span>
                  </h2>
                </div>
                <p data-fog className="max-w-sm leading-relaxed text-muted">
                  {dict.projectsLead}
                </p>
              </div>

              <div className="stack mt-16">
                {featured.map((project, i) => (
                  <ProjectStackCard
                    key={project.slug}
                    project={project}
                    index={i}
                    total={featured.length}
                    locale={lang}
                    dict={dict}
                  />
                ))}
              </div>
            </ProjectStack>
          </div>
        </section>
      </div>

      {others.length > 0 && (
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight">{dict.moreProjects}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {others.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={lang} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

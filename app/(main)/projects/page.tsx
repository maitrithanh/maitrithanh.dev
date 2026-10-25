import Image from "next/image";
import { getModules, getProjects } from "@/lib/data";
import { moduleVisibility } from "@/app/utils/moduleVisibility";
import { PageIntro } from "@/app/components/PageIntro";

const ProjectsPage = async () => {
  const [projects, rows] = await Promise.all([getProjects(), getModules("projects")]);
  const modules = moduleVisibility(rows);

  return (
    modules.isVisible("content") && (
      <>
        <PageIntro title="Projects">
          Products and experiments I&apos;ve built, from storefronts to developer tools. Each one links to a live preview and its source.
        </PageIntro>

        <div className="mb-8 flex items-center justify-between border-b pb-4 text-sm text-muted-foreground">
          <span>Selected work</span>
          <span className="tabular-nums">{String(projects.length).padStart(2, "0")} projects</span>
        </div>

        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {projects.map((project, i) => (
            <li key={project.name} className="flex flex-col">
              {/* Screenshot sits inset in a soft panel, like a browser window peeking up; it rises on hover. */}
              <a
                href={project.preview}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} live preview`}
                className="group relative block overflow-hidden rounded-3xl border bg-card px-6 pt-6 sm:px-10 sm:pt-10"
              >
                <div className="overflow-hidden rounded-t-xl shadow-[0_-8px_40px_-12px_hsl(231_52%_18%/0.35)] ring-1 ring-black/5 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
                  <div className="flex gap-1.5 bg-muted px-3 py-2.5">
                    {[0, 1, 2].map((d) => <span key={d} className="size-2 rounded-full bg-foreground/15" />)}
                  </div>
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={project.image}
                      alt={`${project.name} screenshot`}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <span aria-hidden className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-background text-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">↗</span>
              </a>

              <div className="mt-5 flex items-center gap-3 text-sm tabular-nums text-muted-foreground">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px w-6 bg-border" />
                <span>{project.date}</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                <a href={project.preview} target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground">{project.name}</a>
              </h2>
              {project.description && <p className="mt-2 leading-7 text-muted-foreground">{project.description}</p>}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
                <ul className="flex flex-wrap gap-1.5">
                  {project.tag.map((item) => (
                    <li key={item.tagName} className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{item.tagName}</li>
                  ))}
                </ul>
                <a href={project.linkSource} target="_blank" rel="noopener noreferrer" className="link-sweep text-sm font-medium">
                  Source code ↗
                </a>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  );
};

export default ProjectsPage;

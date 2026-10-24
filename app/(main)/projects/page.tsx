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

        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {projects.map((project, i) => (
            <li key={project.name} className={i % 2 ? "md:mt-24" : ""}>
              <a href={project.preview} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={project.image}
                    alt={`${project.name} screenshot`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h2>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{project.date}</span>
                </div>
              </a>
              {project.description && <p className="mt-2 leading-7 text-muted-foreground">{project.description}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
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

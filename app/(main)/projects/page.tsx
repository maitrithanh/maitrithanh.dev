import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getModules, getProjects } from "@/lib/data";
import { ExportSquare } from "iconsax-reactjs";
import { moduleVisibility } from "@/app/utils/moduleVisibility";

const ProjectsPage = async () => {
  const [projects, rows] = await Promise.all([getProjects(), getModules("projects")]);
  const modules = moduleVisibility(rows);

  return (
    modules.isVisible("content") && (
    <div className="space-y-12">
      <header className="space-y-3">
        <Badge variant="secondary" className="w-fit font-normal text-muted-foreground">Portfolio</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="max-w-xl leading-7 text-muted-foreground">A curated selection of products and experiments focused on clean UX and practical engineering.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.name} className="group flex h-full flex-col overflow-hidden bg-muted/40 transition-colors hover:bg-muted/70">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image src={project.image} alt={project.name} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            </div>
            <CardContent className="flex flex-1 flex-col p-5">
              <p className="text-xs text-muted-foreground">{project.date}</p>
              <h3 className="mt-0.5 font-medium text-foreground">{project.name}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tag.map((item) => (
                  <span key={item.tagName} className="rounded-md bg-background/70 px-2 py-0.5 text-xs text-foreground/60">
                    {item.tagName}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex gap-3 pt-4">
                <Link href={project.preview} target="_blank" className="inline-flex items-center gap-1 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
                  Preview <ExportSquare variant="Outline" size={12} />
                </Link>
                <Link href={project.linkSource} target="_blank" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Source <ExportSquare variant="Outline" size={12} />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    )
  );
};

export default ProjectsPage;

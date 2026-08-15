import { BadgeCheck, Building2, CalendarClock, MapPin } from "lucide-react";
import type { Project } from "@/lib/gb/types";
import { Reveal } from "./Reveal";
import { EmptyState } from "./EmptyState";
import { PropertyGridSkeleton } from "./Skeletons";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";

const statusLabel: Record<Project["status"], string> = {
  "pre-launch": "Pre-launch",
  "under-construction": "Under construction",
  "ready-to-move": "Ready to move",
};

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.images[0];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {cover && (
          <img
            src={cover.url}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        )}
        {project.reraNumber && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-[11px] font-semibold text-success backdrop-blur">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            RERA {project.reraNumber}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-md bg-background/85 px-2 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
          {statusLabel[project.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="size-3.5" aria-hidden="true" />
          {project.developer}
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden="true" />
          {project.location.locality}, {project.location.city}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-3">
          <div>
            <p className="text-xs text-muted-foreground">{project.configurations.join(", ")}</p>
            {project.startingPriceLabel && (
              <p className="text-base font-semibold text-primary">Starting {project.startingPriceLabel}</p>
            )}
          </div>
          {project.possession && (
            <p className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="size-3.5" aria-hidden="true" />
              {project.possession}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function NewProjects() {
  const { data, loading, error, reload } = useAsync(() => dataSource.listProjects(3), []);
  const projects = data ?? [];

  return (
    <section id="new-projects" className="container-page scroll-mt-24 py-14 sm:py-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">New Projects</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Newly launched and under-construction developments from trusted builders.
            </p>
          </div>
          <a href="#cta" className="text-sm font-semibold text-primary hover:text-primary-soft">
            Browse all projects →
          </a>
        </div>
      </Reveal>

      {loading && <PropertyGridSkeleton count={3} />}

      {!loading && error && (
        <EmptyState
          title="Couldn't load projects"
          description="New project listings will be back shortly."
          action={
            <button
              type="button"
              onClick={reload}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-soft"
            >
              Retry
            </button>
          }
        />
      )}

      {!loading && !error && projects.length === 0 && (
        <EmptyState
          title="No new projects yet"
          description="Builder launches appear here as soon as they are published."
        />
      )}

      {!loading && !error && projects.length > 0 && (
        <ul className="mt-7 grid gap-4 md:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.id} delay={i * 90}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}

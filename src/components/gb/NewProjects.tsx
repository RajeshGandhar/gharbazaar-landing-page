import { BadgeCheck, Building2, CalendarClock, MapPin } from "lucide-react";
import type { Project } from "@/data/properties";
import { projects } from "@/data/properties";
import { Reveal } from "./Reveal";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.image}
          alt={`${project.name} by ${project.builder}`}
          width={1024}
          height={768}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        {project.reraApproved && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-[11px] font-semibold text-success backdrop-blur">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            RERA Approved
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="size-3.5" aria-hidden="true" />
          {project.builder}
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden="true" />
          {project.locality}, {project.city}
        </p>
        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-xs text-muted-foreground">{project.configuration}</p>
            <p className="text-base font-semibold text-primary">
              Starting {project.startingPriceLabel}
            </p>
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            {project.possession}
          </p>
        </div>
      </div>
    </article>
  );
}

export function NewProjects() {
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
      <ul className="mt-7 grid gap-4 md:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.id} delay={i * 90}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
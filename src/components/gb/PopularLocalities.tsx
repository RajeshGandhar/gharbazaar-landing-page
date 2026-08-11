import type { Locality } from "@/data/properties";
import { localities } from "@/data/properties";
import { Reveal } from "./Reveal";

export function LocalityCard({ locality }: { locality: Locality }) {
  return (
    <a
      href="#featured"
      className="group relative block aspect-[5/4] overflow-hidden rounded-lg border border-border"
    >
      <img
        src={locality.image}
        alt={`Properties in ${locality.name}`}
        width={1024}
        height={768}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-4">
        <span className="block text-base font-semibold text-foreground">{locality.name}</span>
        <span className="block text-xs text-muted-foreground">{locality.count}</span>
      </span>
    </a>
  );
}

export function PopularLocalities() {
  return (
    <section id="localities" className="border-y border-border bg-surface/30 scroll-mt-24">
      <div className="container-page py-14 sm:py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Explore Popular Localities
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Discover where home seekers are searching the most.
          </p>
        </Reveal>
        <ul className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          {localities.map((locality, i) => (
            <Reveal as="li" key={locality.id} delay={(i % 4) * 70}>
              <LocalityCard locality={locality} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
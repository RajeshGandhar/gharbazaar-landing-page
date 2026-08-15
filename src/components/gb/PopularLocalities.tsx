import type { Locality } from "@/lib/gb/types";
import { Reveal } from "./Reveal";
import { EmptyState } from "./EmptyState";
import { MediaGridSkeleton } from "./Skeletons";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";

export function LocalityCard({ locality }: { locality: Locality }) {
  return (
    <a
      href="#featured"
      className="group relative block aspect-[5/4] overflow-hidden rounded-lg border border-border bg-surface-2"
    >
      {locality.image && (
        <img
          src={locality.image}
          alt={`Properties in ${locality.name}`}
          width={1024}
          height={768}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-4">
        <span className="block text-base font-semibold text-foreground">{locality.name}</span>
        <span className="block text-xs text-muted-foreground">
          {locality.propertyCount !== null
            ? `${locality.propertyCount.toLocaleString("en-IN")} properties`
            : `${locality.city}, ${locality.state}`}
        </span>
      </span>
    </a>
  );
}

export function PopularLocalities() {
  const { data, loading, error, reload } = useAsync(() => dataSource.listLocalities(8), []);
  const localities = data ?? [];

  return (
    <section id="localities" className="border-y border-border bg-surface/30 scroll-mt-24">
      <div className="container-page py-14 sm:py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Explore Popular Localities</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Discover where home seekers are searching the most.
          </p>
        </Reveal>

        {loading && <MediaGridSkeleton count={8} />}

        {!loading && error && (
          <EmptyState
            title="Couldn't load localities"
            description="We couldn't reach the locality index just now."
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

        {!loading && !error && localities.length === 0 && (
          <EmptyState
            title="No localities yet"
            description="Localities appear here as listings are published across cities."
          />
        )}

        {!loading && !error && localities.length > 0 && (
          <ul className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            {localities.map((locality, i) => (
              <Reveal as="li" key={locality.id} delay={(i % 4) * 70}>
                <LocalityCard locality={locality} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

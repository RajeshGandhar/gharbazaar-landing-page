import { PropertyCard } from "./PropertyCard";
import { Reveal } from "./Reveal";
import { CompareTray } from "./CompareTray";
import { EmptyState } from "./EmptyState";
import { PropertyGridSkeleton } from "./Skeletons";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";
import { useCompare, useRecentlyViewed, useShortlist } from "@/lib/gb/local-store";

export function FeaturedProperties() {
  const shortlist = useShortlist();
  const compare = useCompare();
  const recentlyViewed = useRecentlyViewed();

  const { data, loading, error, reload } = useAsync(
    () => dataSource.listProperties({ featuredOnly: true, limit: 6 }),
    [],
  );
  const compared = useAsync(() => dataSource.getPropertiesByIds(compare.ids), [compare.ids.join(",")]);
  const properties = data?.items ?? [];

  return (
    <section id="featured" className="container-page scroll-mt-24 py-14 sm:py-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Featured Properties</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Hand-picked homes from verified owners, agents and builders.
            </p>
          </div>
          <a href="#categories" className="text-sm font-semibold text-primary hover:text-primary-soft">
            View all properties →
          </a>
        </div>
      </Reveal>

      {loading && <PropertyGridSkeleton count={6} />}

      {!loading && error && (
        <EmptyState
          title="Couldn't load properties"
          description="Something went wrong while fetching listings. Please try again."
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

      {!loading && !error && properties.length === 0 && (
        <EmptyState
          title="No featured properties yet"
          description="Featured listings appear here as soon as owners and agents publish them."
        />
      )}

      {!loading && !error && properties.length > 0 && (
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, i) => (
            <Reveal as="li" key={property.id} delay={(i % 3) * 90}>
              <PropertyCard
                property={property}
                eagerImage={i === 0}
                shortlisted={shortlist.has(property.id)}
                onToggleShortlist={shortlist.toggle}
                comparing={compare.has(property.id)}
                compareDisabled={compare.isFull}
                onToggleCompare={compare.toggle}
                onView={recentlyViewed.record}
              />
            </Reveal>
          ))}
        </ul>
      )}

      <CompareTray properties={compared.data ?? []} onRemove={compare.remove} onClear={compare.clear} />
    </section>
  );
}

import { PropertyCard } from "./PropertyCard";
import { Reveal } from "./Reveal";
import { PropertyGridSkeleton } from "./Skeletons";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";
import { useCompare, useRecentlyViewed, useShortlist } from "@/lib/gb/local-store";

export function RecentlyViewed() {
  const recentlyViewed = useRecentlyViewed();
  const shortlist = useShortlist();
  const compare = useCompare();
  const key = recentlyViewed.ids.join(",");

  const { data, loading } = useAsync(
    () => dataSource.getPropertiesByIds(recentlyViewed.ids),
    [key],
  );
  const properties = (data ?? []).slice(0, 3);

  if (recentlyViewed.ids.length === 0) return null;

  return (
    <section id="recently-viewed" className="container-page scroll-mt-24 py-14 sm:py-16">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Recently Viewed</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick up where you left off — synced to your device today, to your account later.
            </p>
          </div>
          <button
            type="button"
            onClick={recentlyViewed.clear}
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear history
          </button>
        </div>
      </Reveal>

      {loading && <PropertyGridSkeleton count={Math.min(recentlyViewed.ids.length, 3)} />}

      {!loading && properties.length > 0 && (
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, i) => (
            <Reveal as="li" key={property.id} delay={(i % 3) * 90}>
              <PropertyCard
                property={property}
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
    </section>
  );
}

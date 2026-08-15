import { Reveal } from "./Reveal";
import { TileRowSkeleton } from "./Skeletons";
import { EmptyState } from "./EmptyState";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";

export function PropertyCategories() {
  const { data, loading, error, reload } = useAsync(() => dataSource.listPropertyTypes(), []);
  const types = data ?? [];

  return (
    <section id="categories" className="border-y border-border bg-surface/40 scroll-mt-24">
      <div className="container-page py-6 sm:py-8">
        <Reveal>
          {loading && <TileRowSkeleton count={6} />}

          {!loading && error && (
            <EmptyState
              title="Couldn't load categories"
              description="Property categories will appear here once the connection recovers."
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

          {!loading && !error && types.length > 0 && (
            <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6">
              {types.slice(0, 12).map((type) => (
                <li key={type.id} className="w-[210px] shrink-0 md:w-auto">
                  <a
                    href="#featured"
                    className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5 transition-colors hover:border-primary/40"
                  >
                    <span className="size-12 shrink-0 overflow-hidden rounded-md bg-surface-2">
                      {type.image && (
                        <img
                          src={type.image}
                          alt=""
                          width={1024}
                          height={768}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{type.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {type.count !== null ? `${type.count.toLocaleString("en-IN")} listings` : "Explore"}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}

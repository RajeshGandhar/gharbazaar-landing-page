import { Reveal } from "./Reveal";
import { Skeleton } from "./Skeletons";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";

/**
 * Platform aggregates come from the data source. Stats without a real value are
 * hidden rather than filled with invented numbers.
 */
export function Stats() {
  const { data, loading, error } = useAsync(() => dataSource.getPlatformStats(), []);
  const items = (data ?? []).filter((s) => s.value !== null);

  if (!loading && (error || items.length === 0)) return null;

  return (
    <section className="border-y border-border bg-surface/40">
      <div className="container-page py-10 sm:py-12">
        {loading ? (
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i} className="space-y-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-3.5 w-28" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {items.map((stat, i) => (
              <Reveal as="li" key={stat.id} delay={i * 60}>
                <p className="font-display text-3xl font-semibold text-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

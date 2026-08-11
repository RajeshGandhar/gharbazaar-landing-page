import { stats as defaultStats, type Stat } from "@/data/properties";
import { Reveal } from "./Reveal";

/** Values are configurable demo placeholders — pass real aggregates via `items`. */
export function Stats({ items = defaultStats }: { items?: Stat[] }) {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="container-page py-10 sm:py-12">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((stat, i) => (
            <Reveal as="li" key={stat.id} delay={i * 60}>
              <p className="font-display text-3xl font-semibold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground/70">
          Indicative platform figures shown for demonstration.
        </p>
      </div>
    </section>
  );
}
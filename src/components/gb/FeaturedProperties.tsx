import { properties } from "@/data/properties";
import { PropertyCard } from "./PropertyCard";
import { Reveal } from "./Reveal";
import { useShortlist } from "./useShortlist";

export function FeaturedProperties() {
  const { has, toggle } = useShortlist();
  const featured = properties.filter((p) => p.featured);

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
          <a
            href="#categories"
            className="text-sm font-semibold text-primary hover:text-primary-soft"
          >
            View all properties →
          </a>
        </div>
      </Reveal>

      <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((property, i) => (
          <Reveal as="li" key={property.id} delay={(i % 3) * 90}>
            <PropertyCard property={property} shortlisted={has(property.id)} onToggleShortlist={toggle} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
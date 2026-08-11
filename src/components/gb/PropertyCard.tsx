import { BadgeCheck, Bath, BedDouble, Heart, Maximize, MapPin } from "lucide-react";
import type { Property } from "@/data/properties";
import { cn } from "@/lib/utils";

export function PropertyCard({
  property,
  shortlisted,
  onToggleShortlist,
}: {
  property: Property;
  shortlisted: boolean;
  onToggleShortlist: (id: string) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-card)] transition-colors hover:border-primary/40">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={`${property.title} in ${property.locality}, ${property.city}`}
          width={1024}
          height={768}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {property.verified ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-[11px] font-semibold text-success backdrop-blur">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => onToggleShortlist(property.id)}
            aria-pressed={shortlisted}
            aria-label={
              shortlisted ? `Remove ${property.title} from shortlist` : `Shortlist ${property.title}`
            }
            className="grid size-9 place-items-center rounded-md bg-background/85 text-foreground backdrop-blur transition-colors hover:text-primary"
          >
            <Heart
              className={cn("size-4.5", shortlisted && "fill-primary text-primary")}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-base font-semibold text-foreground">{property.title}</h3>
          <span className="shrink-0 text-base font-semibold text-primary">{property.priceLabel}</span>
        </div>

        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {property.bedrooms !== null && (
            <li className="inline-flex items-center gap-1.5">
              <BedDouble className="size-3.5" aria-hidden="true" />
              {property.bedrooms} BHK
            </li>
          )}
          {property.bathrooms !== null && (
            <li className="inline-flex items-center gap-1.5">
              <Bath className="size-3.5" aria-hidden="true" />
              {property.bathrooms} Bath
            </li>
          )}
          <li className="inline-flex items-center gap-1.5">
            <Maximize className="size-3.5" aria-hidden="true" />
            {property.area.toLocaleString("en-IN")} sq.ft.
          </li>
        </ul>

        <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {property.locality}, {property.city}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {property.propertyType}
          </span>
          <a
            href="#cta"
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}
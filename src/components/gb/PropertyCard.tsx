import { Bath, BedDouble, GitCompareArrows, Heart, Maximize, MapPin } from "lucide-react";
import type { Property } from "@/lib/gb/types";
import { formatArea, timeAgo } from "@/lib/gb/format";
import { FlagBadge, VerificationBadge } from "./PropertyBadges";
import { PropertyImageCarousel } from "./PropertyImageCarousel";
import { cn } from "@/lib/utils";

export function PropertyCard({
  property,
  shortlisted,
  onToggleShortlist,
  comparing = false,
  compareDisabled = false,
  onToggleCompare,
  onView,
  eagerImage = false,
}: {
  property: Property;
  shortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  comparing?: boolean;
  compareDisabled?: boolean;
  onToggleCompare?: (id: string) => void;
  onView?: (id: string) => void;
  eagerImage?: boolean;
}) {
  const flag = property.flags.find((f) => f === "premium" || f === "new");
  const area = formatArea(property.areaSqft);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
      <div className="relative">
        <PropertyImageCarousel images={property.images} eager={eagerImage} />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="pointer-events-auto flex flex-wrap gap-1.5">
            <VerificationBadge status={property.verificationStatus} />
            {flag && <FlagBadge flag={flag} />}
          </span>
          <span className="pointer-events-auto flex gap-1.5">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(property.id)}
                disabled={compareDisabled && !comparing}
                aria-pressed={comparing}
                aria-label={comparing ? `Remove ${property.title} from compare` : `Compare ${property.title}`}
                className={cn(
                  "grid size-9 place-items-center rounded-md bg-background/85 text-foreground backdrop-blur transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40",
                  comparing && "text-primary",
                )}
              >
                <GitCompareArrows className="size-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onToggleShortlist(property.id)}
              aria-pressed={shortlisted}
              aria-label={shortlisted ? `Remove ${property.title} from shortlist` : `Shortlist ${property.title}`}
              className="grid size-9 place-items-center rounded-md bg-background/85 text-foreground backdrop-blur transition-colors hover:text-primary"
            >
              <Heart className={cn("size-4", shortlisted && "fill-primary text-primary")} aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-base font-semibold text-foreground">{property.title}</h3>
          <span className="shrink-0 text-right">
            <span className="block text-base font-semibold text-primary">{property.priceLabel}</span>
            {property.priceUnitLabel && (
              <span className="block text-[11px] text-muted-foreground">{property.priceUnitLabel}</span>
            )}
          </span>
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
          {area && (
            <li className="inline-flex items-center gap-1.5">
              <Maximize className="size-3.5" aria-hidden="true" />
              {area}
            </li>
          )}
        </ul>

        <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {property.location.locality}, {property.location.city}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {property.seller.name} · <span className="capitalize">{property.seller.type}</span> · {timeAgo(property.postedAt)}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {property.propertyTypeName}
          </span>
          <a
            href="#cta"
            onClick={() => onView?.(property.id)}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}

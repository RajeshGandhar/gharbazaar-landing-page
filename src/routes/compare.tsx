import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import { Header } from "@/components/gb/Header";
import { Footer } from "@/components/gb/Footer";
import { EmptyState } from "@/components/gb/EmptyState";
import { PropertyGridSkeleton } from "@/components/gb/Skeletons";
import { VerificationBadge } from "@/components/gb/PropertyBadges";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";
import { useCompare } from "@/lib/gb/local-store";
import { formatArea, timeAgo } from "@/lib/gb/format";
import type { Property } from "@/lib/gb/types";

const title = "Compare properties — GharBazaar";
const description = "Compare shortlisted homes side by side on price, size, configuration, amenities and seller before you decide.";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComparePage,
});

const rows: { label: string; value: (p: Property) => string }[] = [
  { label: "Price", value: (p) => p.priceLabel },
  { label: "Rate", value: (p) => p.priceUnitLabel ?? "—" },
  { label: "Type", value: (p) => p.propertyTypeName },
  { label: "Configuration", value: (p) => (p.bedrooms === null ? "—" : `${p.bedrooms} BHK`) },
  { label: "Bathrooms", value: (p) => (p.bathrooms === null ? "—" : String(p.bathrooms)) },
  { label: "Area", value: (p) => formatArea(p.areaSqft) ?? "—" },
  { label: "Furnishing", value: (p) => p.furnishing ?? "—" },
  { label: "Construction", value: (p) => p.construction ?? "—" },
  { label: "Locality", value: (p) => `${p.location.locality}, ${p.location.city}` },
  { label: "Seller", value: (p) => `${p.seller.name} (${p.seller.type})` },
  { label: "Amenities", value: (p) => (p.amenities.length ? p.amenities.join(", ") : "—") },
  { label: "Listed", value: (p) => timeAgo(p.postedAt) },
];

function ComparePage() {
  const compare = useCompare();
  const { data, loading, error, reload } = useAsync(
    () => dataSource.getPropertiesByIds(compare.ids),
    [compare.ids.join(",")],
  );
  const properties = data ?? [];

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="container-page py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Compare properties</h1>
            <p className="mt-2 text-sm text-muted-foreground">Side-by-side view of everything you shortlisted for comparison.</p>
          </div>
          {compare.count > 0 && (
            <button
              type="button"
              onClick={compare.clear}
              className="rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>

        {compare.count > 0 && loading && <PropertyGridSkeleton count={compare.count} />}

        {!loading && error && (
          <EmptyState
            title="Couldn't load the comparison"
            description="Something went wrong while fetching these listings. Please try again."
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
            title="Nothing to compare yet"
            description="Add up to three properties from the listings using the compare icon on any property card."
            action={
              <Link to="/" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-soft">
                Browse properties
              </Link>
            }
          />
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="mt-7 overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th scope="col" className="w-40 border-b border-border p-4 align-top text-xs uppercase tracking-wide text-muted-foreground">
                    Details
                  </th>
                  {properties.map((p) => (
                    <th key={p.id} scope="col" className="min-w-[14rem] border-b border-l border-border p-4 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to="/property/$slug"
                          params={{ slug: p.slug }}
                          className="text-sm font-semibold text-foreground hover:text-primary"
                        >
                          {p.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => compare.remove(p.id)}
                          aria-label={`Remove ${p.title} from compare`}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <X className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <img
                        src={p.images[0]?.url}
                        alt={p.images[0]?.alt ?? p.title}
                        loading="lazy"
                        className="mt-3 aspect-[4/3] w-full rounded-md object-cover"
                      />
                      <span className="mt-3 inline-block">
                        <VerificationBadge status={p.verificationStatus} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="align-top">
                    <th scope="row" className="border-b border-border p-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </th>
                    {properties.map((p) => (
                      <td key={p.id} className="border-b border-l border-border p-4 text-foreground">
                        {row.value(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

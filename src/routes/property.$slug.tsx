import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Bath, BedDouble, GitCompareArrows, Heart, MapPin, Maximize, Phone } from "lucide-react";
import { Header } from "@/components/gb/Header";
import { Footer } from "@/components/gb/Footer";
import { EmptyState } from "@/components/gb/EmptyState";
import { PropertyCardSkeleton } from "@/components/gb/Skeletons";
import { PropertyImageCarousel } from "@/components/gb/PropertyImageCarousel";
import { FlagBadge, VerificationBadge } from "@/components/gb/PropertyBadges";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";
import { useCompare, useRecentlyViewed, useShortlist } from "@/lib/gb/local-store";
import { formatArea, timeAgo } from "@/lib/gb/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/property/$slug")({
  head: () => ({
    meta: [
      { title: "Property details — GharBazaar" },
      { name: "description", content: "Full details, photos, amenities and seller information for this GharBazaar listing." },
      { property: "og:title", content: "Property details — GharBazaar" },
      { property: "og:description", content: "Full details, photos, amenities and seller information for this GharBazaar listing." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { slug } = Route.useParams();
  const { data, loading, error, reload } = useAsync(() => dataSource.getPropertyBySlug(slug), [slug]);
  const shortlist = useShortlist();
  const compare = useCompare();
  const recentlyViewed = useRecentlyViewed();

  useEffect(() => {
    if (data) recentlyViewed.record(data.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="container-page py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
        </Link>

        {loading && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
        )}

        {!loading && error && (
          <EmptyState
            title="Couldn't load this property"
            description="Something went wrong while fetching the listing. Please try again."
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

        {!loading && !error && !data && (
          <EmptyState
            title="Property not found"
            description="This listing may have been removed or is no longer available."
            action={
              <Link to="/" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-soft">
                Browse properties
              </Link>
            }
          />
        )}

        {!loading && !error && data && (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="overflow-hidden rounded-lg border border-border bg-surface">
                <PropertyImageCarousel images={data.images} eager />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <VerificationBadge status={data.verificationStatus} />
                {data.flags.map((flag) => (
                  <FlagBadge key={flag} flag={flag} />
                ))}
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">{data.title}</h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" aria-hidden="true" />
                {data.location.address ?? `${data.location.locality}, ${data.location.city}`}
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {data.bedrooms !== null && (
                  <li className="inline-flex items-center gap-2">
                    <BedDouble className="size-4" aria-hidden="true" /> {data.bedrooms} BHK
                  </li>
                )}
                {data.bathrooms !== null && (
                  <li className="inline-flex items-center gap-2">
                    <Bath className="size-4" aria-hidden="true" /> {data.bathrooms} Bath
                  </li>
                )}
                {formatArea(data.areaSqft) && (
                  <li className="inline-flex items-center gap-2">
                    <Maximize className="size-4" aria-hidden="true" /> {formatArea(data.areaSqft)}
                  </li>
                )}
              </ul>

              <dl className="mt-6 grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2">
                <Detail label="Property type" value={data.propertyTypeName} />
                <Detail label="Listing" value={data.listingType} />
                <Detail label="Furnishing" value={data.furnishing} />
                <Detail label="Construction" value={data.construction} />
                <Detail label="Posted" value={timeAgo(data.postedAt)} />
                <Detail label="Locality" value={`${data.location.locality}, ${data.location.city}`} />
              </dl>

              {data.amenities.length > 0 && (
                <section className="mt-6">
                  <h2 className="text-lg font-semibold text-foreground">Amenities</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {data.amenities.map((a) => (
                      <li key={a} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
                        {a}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="text-2xl font-semibold text-primary">{data.priceLabel}</p>
                {data.priceUnitLabel && <p className="text-xs text-muted-foreground">{data.priceUnitLabel}</p>}

                <div className="mt-5 rounded-md border border-border bg-surface-2 p-4">
                  <p className="text-sm font-semibold text-foreground">{data.seller.name}</p>
                  <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                    {data.seller.type}
                    {data.seller.verified ? " · Verified" : ""}
                  </p>
                </div>

                <a
                  href="#cta"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-soft"
                >
                  <Phone className="size-4" aria-hidden="true" /> Contact seller
                </a>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => shortlist.toggle(data.id)}
                    aria-pressed={shortlist.has(data.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Heart className={cn("size-4", shortlist.has(data.id) && "fill-primary text-primary")} aria-hidden="true" />
                    {shortlist.has(data.id) ? "Shortlisted" : "Shortlist"}
                  </button>
                  <button
                    type="button"
                    onClick={() => compare.toggle(data.id)}
                    disabled={compare.isFull && !compare.has(data.id)}
                    aria-pressed={compare.has(data.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <GitCompareArrows className="size-4" aria-hidden="true" />
                    {compare.has(data.id) ? "In compare" : "Compare"}
                  </button>
                </div>

                {compare.count > 0 && (
                  <Link to="/compare" className="mt-3 block text-center text-xs font-semibold text-primary hover:text-primary-soft">
                    View compare ({compare.count}) →
                  </Link>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm capitalize text-foreground">{value ?? "Not specified"}</dd>
    </div>
  );
}

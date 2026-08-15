import { useEffect } from "react";
import { BellPlus, X } from "lucide-react";
import type { SearchFilters } from "@/lib/gb/types";
import { countActiveFilters } from "@/lib/gb/types";
import { dataSource } from "@/lib/gb/data-source";
import { useAsync } from "@/lib/gb/useAsync";
import { Skeleton } from "./Skeletons";
import { cn } from "@/lib/utils";

const bedroomOptions = [1, 2, 3, 4, 5];
const furnishingOptions = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const constructionOptions = ["Ready to Move", "Under Construction", "New Launch"];
const amenityOptions = ["Lift", "Parking", "Gym", "Swimming Pool", "Power Backup", "Security", "Garden"];
const preferenceOptions = [
  { value: "verified", label: "Verified only" },
  { value: "owner", label: "Owner listings" },
  { value: "dealer", label: "Dealer listings" },
];
const priceOptions = [
  { label: "Any", min: null, max: null },
  { label: "Under ₹25 L", min: null, max: 2500000 },
  { label: "₹25 – 50 L", min: 2500000, max: 5000000 },
  { label: "₹50 L – 1 Cr", min: 5000000, max: 10000000 },
  { label: "₹1 – 2 Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2 Cr", min: 20000000, max: null },
];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface-2 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-4 first:border-t-0">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FiltersDrawer({
  open,
  value,
  onChange,
  onClose,
  onApply,
  onReset,
  onSaveSearch,
  resultCount,
}: {
  open: boolean;
  value: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  onSaveSearch: () => void;
  resultCount?: number | null;
}) {
  const types = useAsync(() => dataSource.listPropertyTypes(), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const active = countActiveFilters(value);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="All filters">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-[var(--shadow-lift)]">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">All filters</h2>
            <p className="text-xs text-muted-foreground">
              {active > 0 ? `${active} filter${active > 1 ? "s" : ""} applied` : "Refine your search"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          <Group title="Budget">
            {priceOptions.map((p) => (
              <Chip
                key={p.label}
                active={value.minPrice === p.min && value.maxPrice === p.max}
                onClick={() => onChange({ ...value, minPrice: p.min, maxPrice: p.max })}
              >
                {p.label}
              </Chip>
            ))}
          </Group>

          <Group title="Property type">
            {types.loading &&
              Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-7 w-24 rounded-full" />)}
            {!types.loading &&
              (types.data ?? []).map((t) => (
                <Chip
                  key={t.id}
                  active={value.propertyTypes.includes(t.slug)}
                  onClick={() => onChange({ ...value, propertyTypes: toggleIn(value.propertyTypes, t.slug) })}
                >
                  {t.name}
                </Chip>
              ))}
          </Group>

          <Group title="Bedrooms">
            {bedroomOptions.map((b) => (
              <Chip
                key={b}
                active={value.bedrooms.includes(b)}
                onClick={() => onChange({ ...value, bedrooms: toggleIn(value.bedrooms, b) })}
              >
                {b}{b === 5 ? "+" : ""} BHK
              </Chip>
            ))}
          </Group>

          <Group title="Furnishing">
            {furnishingOptions.map((f) => (
              <Chip
                key={f}
                active={value.furnishing.includes(f)}
                onClick={() => onChange({ ...value, furnishing: toggleIn(value.furnishing, f) })}
              >
                {f}
              </Chip>
            ))}
          </Group>

          <Group title="Construction status">
            {constructionOptions.map((c) => (
              <Chip
                key={c}
                active={value.construction.includes(c)}
                onClick={() => onChange({ ...value, construction: toggleIn(value.construction, c) })}
              >
                {c}
              </Chip>
            ))}
          </Group>

          <Group title="Amenities">
            {amenityOptions.map((a) => (
              <Chip
                key={a}
                active={value.amenities.includes(a)}
                onClick={() => onChange({ ...value, amenities: toggleIn(value.amenities, a) })}
              >
                {a}
              </Chip>
            ))}
          </Group>

          <Group title="Listed by">
            {preferenceOptions.map((p) => (
              <Chip
                key={p.value}
                active={value.listingPreferences.includes(p.value)}
                onClick={() =>
                  onChange({ ...value, listingPreferences: toggleIn(value.listingPreferences, p.value) })
                }
              >
                {p.label}
              </Chip>
            ))}
          </Group>

          <div className="border-t border-border py-4">
            <button
              type="button"
              onClick={onSaveSearch}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <BellPlus className="size-4" aria-hidden="true" />
              Save this search
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Saved searches stay on this device until accounts are connected.
            </p>
          </div>
        </div>

        <footer className="flex items-center gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-soft"
          >
            {resultCount != null ? `Show ${resultCount} properties` : "Show results"}
          </button>
        </footer>
      </div>
    </div>
  );
}

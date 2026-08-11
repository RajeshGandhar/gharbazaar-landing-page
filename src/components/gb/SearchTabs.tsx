import type { ListingType } from "@/data/properties";
import { cn } from "@/lib/utils";

export const searchTabs: { id: ListingType; label: string }[] = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "commercial", label: "Commercial" },
  { id: "plots", label: "Plots" },
  { id: "projects", label: "New Projects" },
];

export function SearchTabs({
  value,
  onChange,
}: {
  value: ListingType;
  onChange: (v: ListingType) => void;
}) {
  return (
    <div role="tablist" aria-label="Listing type" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
      {searchTabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-surface-2 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary transition-opacity",
                active ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
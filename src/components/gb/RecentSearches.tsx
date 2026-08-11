import { Clock } from "lucide-react";

export interface RecentSearch {
  id: string;
  label: string;
  query: string;
  tab: string;
  bhk?: string;
}

export function RecentSearches({
  items,
  onSelect,
}: {
  items: RecentSearch[];
  onSelect: (item: RecentSearch) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Clock className="size-3.5" aria-hidden="true" />
        Recent Searches
      </span>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className="rounded-full border border-border bg-surface-2/70 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-primary/50 hover:text-foreground"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
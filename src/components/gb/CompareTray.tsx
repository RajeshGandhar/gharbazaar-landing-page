import { X } from "lucide-react";
import type { Property } from "@/lib/gb/types";
import { COMPARE_LIMIT } from "@/lib/gb/local-store";

export function CompareTray({
  properties,
  onRemove,
  onClear,
}: {
  properties: Property[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (properties.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="container-page flex flex-wrap items-center gap-3 py-3">
        <p className="text-sm font-semibold text-foreground">
          Compare <span className="text-muted-foreground">({properties.length}/{COMPARE_LIMIT})</span>
        </p>
        <ul className="flex min-w-0 flex-1 flex-wrap gap-2">
          {properties.map((property) => (
            <li
              key={property.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground"
            >
              <span className="max-w-[10rem] truncate">{property.title}</span>
              <button
                type="button"
                onClick={() => onRemove(property.id)}
                aria-label={`Remove ${property.title} from compare`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
          <a
            href="#cta"
            className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-soft"
          >
            Compare now
          </a>
        </div>
      </div>
    </div>
  );
}

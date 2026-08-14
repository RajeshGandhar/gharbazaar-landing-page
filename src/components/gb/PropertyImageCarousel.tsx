import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyImage } from "@/lib/gb/types";
import { cn } from "@/lib/utils";

/** Lightweight in-card gallery. Images come from the data source, never hardcoded. */
export function PropertyImageCarousel({
  images,
  eager = false,
  className,
}: {
  images: PropertyImage[];
  eager?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const current = images[index];

  if (!current) {
    return (
      <div className={cn("grid aspect-[4/3] place-items-center bg-surface-2 text-xs text-muted-foreground", className)}>
        Photo coming soon
      </div>
    );
  }

  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  return (
    <div className={cn("group/carousel relative aspect-[4/3] overflow-hidden bg-surface-2", className)}>
      <img
        src={current.url}
        alt={current.alt}
        width={current.width}
        height={current.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-background focus-visible:opacity-100 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-background focus-visible:opacity-100 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
            {images.map((image, i) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1} of ${total}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-primary" : "w-1.5 bg-background/70",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

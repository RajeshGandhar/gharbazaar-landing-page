import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="mt-7 grid place-items-center rounded-lg border border-dashed border-border bg-surface/60 px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-surface-2 text-muted-foreground">
        {icon ?? <SearchX className="size-5" aria-hidden="true" />}
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

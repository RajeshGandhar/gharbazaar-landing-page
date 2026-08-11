import { Home } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="GharBazaar home"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-[0_6px_18px_-8px_var(--primary)]">
        <Home className="size-5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span
        className={
          "font-display font-semibold tracking-tight text-foreground " +
          (compact ? "text-base sm:text-lg" : "text-lg")
        }
      >
        Ghar<span className="text-primary">Bazaar</span>
      </span>
    </a>
  );
}
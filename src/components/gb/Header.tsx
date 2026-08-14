import { useEffect, useState } from "react";
import { Bell, Heart, Menu, Search, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useShortlist } from "@/lib/gb/local-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Buy", href: "#featured" },
  { label: "Rent", href: "#featured" },
  { label: "New Projects", href: "#new-projects" },
  { label: "Commercial", href: "#categories" },
  { label: "Plots", href: "#categories" },
  { label: "Agents", href: "#why" },
  { label: "Guides", href: "#why" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useShortlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const focusSearch = () => {
    setOpen(false);
    const el = document.getElementById("property-search-input");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => el?.focus(), 400);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/92 backdrop-blur-md"
          : "border-transparent bg-background/60 backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 transition-all duration-300 lg:flex lg:justify-between",
          scrolled ? "h-14" : "h-16 md:h-[4.5rem]",
        )}
      >
        <div className="flex min-w-0 items-center gap-8">
          <Logo compact />
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="#featured"
            className="relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Heart className="size-4" aria-hidden="true" />
            Shortlist
            {count > 0 && (
              <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </a>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-4" aria-hidden="true" />
            Alerts
          </a>
          <a
            href="#cta"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Post Property
          </a>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            <User className="size-4" aria-hidden="true" />
            Login
          </a>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={focusSearch}
            aria-label="Search properties"
            className="grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
          <a
            href="#cta"
            aria-label="Login to GharBazaar"
            className="grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <User className="size-5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-10 place-items-center rounded-md text-foreground transition-colors hover:bg-surface"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="container-page py-3">
            <ul className="grid grid-cols-2 gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 pb-2">
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Post Property
              </a>
              <a
                href="#featured"
                onClick={() => setOpen(false)}
                aria-label="View shortlist"
                className="grid size-11 place-items-center rounded-md border border-border text-foreground"
              >
                <Heart className="size-5" aria-hidden="true" />
              </a>
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                aria-label="Property alerts"
                className="grid size-11 place-items-center rounded-md border border-border text-foreground"
              >
                <Bell className="size-5" aria-hidden="true" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
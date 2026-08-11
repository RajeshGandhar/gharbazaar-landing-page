import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Logo } from "./Logo";

const columns = [
  {
    title: "GharBazaar",
    links: ["Buy", "Rent", "New Projects", "Commercial", "Plots", "Popular Localities"],
  },
  { title: "Company", links: ["About", "Contact", "Careers", "Help"] },
  { title: "Legal", links: ["Privacy Policy", "Terms", "Cookie Policy"] },
];

const socials = [
  { label: "Instagram", Icon: Instagram },
  { label: "Facebook", Icon: Facebook },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "YouTube", Icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A simple, trustworthy place to buy, rent, discover and post properties across India.
          </p>
          <ul className="mt-5 flex gap-2">
            {socials.map(({ label, Icon }) => (
              <li key={label}>
                <a
                  href="#cta"
                  aria-label={`GharBazaar on ${label}`}
                  className="grid size-10 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <Icon className="size-4.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#cta" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5">
          <p className="text-xs text-muted-foreground">© GharBazaar</p>
          <p className="text-xs text-muted-foreground">Made for home seekers in India</p>
        </div>
      </div>
    </footer>
  );
}
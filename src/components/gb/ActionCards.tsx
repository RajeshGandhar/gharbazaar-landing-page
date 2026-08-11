import { BadgeIndianRupee, Landmark, MapPinned, Upload } from "lucide-react";
import { Reveal } from "./Reveal";

const actions = [
  {
    id: "post",
    title: "Post Property for Free",
    text: "Get maximum visibility for your property.",
    cta: "Post Now",
    href: "#cta",
    Icon: Upload,
  },
  {
    id: "loan",
    title: "Home Loan",
    text: "Check eligibility and explore competitive rates.",
    cta: "Check Now",
    href: "#why",
    Icon: Landmark,
  },
  {
    id: "valuation",
    title: "Property Valuation",
    text: "Understand your property's current market value.",
    cta: "Get Valuation",
    href: "#why",
    Icon: BadgeIndianRupee,
  },
  {
    id: "near",
    title: "Find Property Near You",
    text: "Explore properties near your preferred locations.",
    cta: "Explore Now",
    href: "#localities",
    Icon: MapPinned,
  },
];

export function ActionCards() {
  return (
    <section className="container-page py-14 sm:py-16">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(({ id, title, text, cta, href, Icon }, i) => (
          <Reveal as="li" key={id} delay={i * 70}>
            <a
              href={href}
              className="group flex h-full flex-col justify-between rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary/45"
            >
              <div>
                <span className="grid size-10 place-items-center rounded-md border border-border bg-surface-2 text-primary">
                  <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {cta}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
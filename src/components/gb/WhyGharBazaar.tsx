import { BadgeCheck, Bookmark, MapPin, PhoneCall, Search, Upload } from "lucide-react";
import { Reveal } from "./Reveal";

const benefits = [
  { Icon: BadgeCheck, title: "Verified Listings", text: "Listings reviewed before they go live." },
  { Icon: Search, title: "Smart Search", text: "Find the right home in a few taps." },
  { Icon: MapPin, title: "Local Property Discovery", text: "Explore neighbourhood by neighbourhood." },
  { Icon: Bookmark, title: "Save & Shortlist", text: "Keep your favourites in one place." },
  { Icon: PhoneCall, title: "Direct Contact", text: "Reach owners, agents and builders directly." },
  { Icon: Upload, title: "Easy Property Posting", text: "List a property in under two minutes." },
];

export function WhyGharBazaar() {
  return (
    <section id="why" className="border-y border-border bg-surface/30 scroll-mt-24">
      <div className="container-page py-14 sm:py-16">
        <Reveal>
          <h2 className="max-w-xl text-2xl font-semibold text-foreground sm:text-3xl">
            Property Search, Made Simpler.
          </h2>
        </Reveal>
        <ul className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 70}>
              <div className="flex gap-3.5">
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.6} aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
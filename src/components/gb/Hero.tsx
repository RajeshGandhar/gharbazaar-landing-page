import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-villa.jpg";
import { PropertySearch } from "./PropertySearch";

export function Hero() {
  const [offset, setOffset] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOffset(Math.min(window.scrollY * 0.12, 60)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Modern luxury Indian villa lit at dusk"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover will-change-transform"
          style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.08)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="container-page pb-10 pt-14 sm:pt-20 lg:pb-16 lg:pt-24">
        <div
          className="max-w-2xl transition-all duration-700"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)" }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            Trusted by Home Seekers
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            Find Your Perfect Home
            <span className="block">
              Where <span className="text-primary">Life</span> Happens
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            Explore verified properties across India.
          </p>
        </div>

        <div
          className="mt-8 transition-all delay-150 duration-700 lg:mt-10"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(22px)" }}
        >
          <PropertySearch />
        </div>
      </div>
    </section>
  );
}
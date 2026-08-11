import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/gb/Header";
import { Hero } from "@/components/gb/Hero";
import { PropertyCategories } from "@/components/gb/PropertyCategories";
import { ActionCards } from "@/components/gb/ActionCards";
import { FeaturedProperties } from "@/components/gb/FeaturedProperties";
import { PopularLocalities } from "@/components/gb/PopularLocalities";
import { NewProjects } from "@/components/gb/NewProjects";
import { WhyGharBazaar } from "@/components/gb/WhyGharBazaar";
import { PostPropertyCTA } from "@/components/gb/PostPropertyCTA";
import { Stats } from "@/components/gb/Stats";
import { Footer } from "@/components/gb/Footer";

const title = "GharBazaar — Buy, Rent & Post Property in India";
const description =
  "Discover verified homes, plots, commercial spaces and new projects across India. Search, shortlist and post property for free on GharBazaar.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <PropertyCategories />
        <ActionCards />
        <FeaturedProperties />
        <PopularLocalities />
        <NewProjects />
        <WhyGharBazaar />
        <PostPropertyCTA />
        <Stats />
      </main>
      <Footer />
    </div>
  );
}

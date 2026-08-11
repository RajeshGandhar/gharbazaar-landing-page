import { categories } from "@/data/properties";
import { Reveal } from "./Reveal";

export function PropertyCategories() {
  return (
    <section id="categories" className="border-y border-border bg-surface/40">
      <div className="container-page py-6 sm:py-8">
        <Reveal>
          <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6">
            {categories.map((cat) => (
              <li key={cat.id} className="w-[210px] shrink-0 md:w-auto">
                <a
                  href="#featured"
                  className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5 transition-colors hover:border-primary/40"
                >
                  <span className="size-12 shrink-0 overflow-hidden rounded-md">
                    <img
                      src={cat.image}
                      alt=""
                      width={1024}
                      height={768}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">{cat.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{cat.count}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
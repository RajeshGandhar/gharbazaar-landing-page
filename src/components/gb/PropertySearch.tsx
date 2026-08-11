import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Search, SlidersHorizontal } from "lucide-react";
import { SearchTabs } from "./SearchTabs";
import { SearchFilters, type FilterState } from "./SearchFilters";
import { RecentSearches, type RecentSearch } from "./RecentSearches";
import { demoRecentSearches, type ListingType } from "@/data/properties";
import { cn } from "@/lib/utils";

const RECENT_KEY = "gharbazaar:recent-searches";

export function PropertySearch() {
  const [tab, setTab] = useState<ListingType>("buy");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "Property Type",
    budget: "Budget",
    bhk: "BHK",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [recent, setRecent] = useState<RecentSearch[]>(demoRecentSearches);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [status, setStatus] = useState("");
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RecentSearch[];
        if (Array.isArray(parsed) && parsed.length) setRecent(parsed);
      }
    } catch {
      /* ignore */
    }
    const SR =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    setVoiceSupported(Boolean(SR));
  }, []);

  const persistRecent = useCallback((items: RecentSearch[]) => {
    setRecent(items);
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, []);

  const runSearch = useCallback(
    (term: string) => {
      const value = term.trim();
      if (!value) {
        inputRef.current?.focus();
        setStatus("Enter a locality, society, builder or city to search.");
        return;
      }
      const entry: RecentSearch = {
        id: `${Date.now()}`,
        label: value,
        query: value,
        tab,
        bhk: filters.bhk !== "BHK" ? filters.bhk : undefined,
      };
      persistRecent(
        [entry, ...recent.filter((r) => r.label.toLowerCase() !== value.toLowerCase())].slice(0, 6),
      );
      setStatus(`Showing ${tab} results for “${value}”.`);
      document.getElementById("featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [filters.bhk, persistRecent, recent, tab],
  );

  const toggleVoice = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      setStatus("Voice search isn't supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      setQuery(transcript);
      setListening(false);
      if (transcript) runSearch(transcript);
    };
    recognition.onerror = () => {
      setListening(false);
      setStatus("Couldn't hear that. Please try again.");
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setStatus("Listening…");
    setListening(true);
    recognition.start();
  }, [listening, runSearch]);

  const applyRecent = (item: RecentSearch) => {
    setQuery(item.query);
    setTab((item.tab as ListingType) ?? "buy");
    setFilters((f) => ({ ...f, bhk: item.bhk ?? "BHK" }));
    runSearch(item.query);
  };

  return (
    <section
      aria-label="Property search"
      className="rounded-xl border border-border bg-surface/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur-xl sm:p-5"
    >
      <div className="border-b border-border pb-3">
        <SearchTabs value={tab} onChange={setTab} />
      </div>

      <form
        className="pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
      >
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 focus-within:border-primary/60">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="property-search-input" className="sr-only">
            Search by locality, society, builder or city
          </label>
          <input
            id="property-search-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by locality, society, builder or city"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-base"
          />
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={listening ? "Stop voice search" : "Search by voice"}
            aria-pressed={listening}
            title={voiceSupported ? "Search by voice" : "Voice search unavailable in this browser"}
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-md border transition-colors",
              listening
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            <Mic className={cn("size-4.5", listening && "animate-pulse")} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <SearchFilters value={filters} onChange={setFilters} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-controls="advanced-filters"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
            </button>
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-soft lg:flex-none"
            >
              <Search className="size-4" aria-hidden="true" />
              Search
            </button>
          </div>
        </div>

        {showFilters && (
          <div
            id="advanced-filters"
            className="mt-3 grid gap-2 rounded-lg border border-border bg-surface-2/60 p-3 sm:grid-cols-3"
          >
            {[
              { label: "Possession", options: ["Any", "Ready to Move", "Under Construction"] },
              { label: "Furnishing", options: ["Any", "Unfurnished", "Semi-Furnished", "Fully Furnished"] },
              { label: "Listed By", options: ["Anyone", "Owner", "Agent", "Builder"] },
            ].map((f) => (
              <div key={f.label}>
                <label
                  htmlFor={`adv-${f.label}`}
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  {f.label}
                </label>
                <select
                  id={`adv-${f.label}`}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground"
                >
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </form>

      <RecentSearches items={recent} onSelect={applyRecent} />

      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </section>
  );
}
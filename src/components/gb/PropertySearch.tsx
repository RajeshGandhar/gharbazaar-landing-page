import { useCallback, useEffect, useRef, useState } from "react";
import { BellPlus, Mic, Search, SlidersHorizontal, X } from "lucide-react";
import { SearchTabs } from "./SearchTabs";
import { RecentSearches, type RecentSearch } from "./RecentSearches";
import { FiltersDrawer } from "./FiltersDrawer";
import { demoRecentSearches } from "@/data/properties";
import {
  countActiveFilters,
  emptyFilters,
  type ListingType,
  type SearchFilters,
} from "@/lib/gb/types";
import { applySearch, clearSearch, useActiveSearch } from "@/lib/gb/search-store";
import { useSavedSearches } from "@/lib/gb/local-store";
import { dataSource } from "@/lib/gb/data-source";
import { describeSearch } from "@/lib/gb/format";
import { cn } from "@/lib/utils";

const RECENT_KEY = "gharbazaar:recent-searches";

export function PropertySearch() {
  const [draft, setDraft] = useState<SearchFilters>(() => emptyFilters("buy"));
  const [showFilters, setShowFilters] = useState(false);
  const [recent, setRecent] = useState<RecentSearch[]>(demoRecentSearches);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [status, setStatus] = useState("");
  const [resultCount, setResultCount] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedSearches = useSavedSearches();
  const { isApplied } = useActiveSearch();
  const activeCount = countActiveFilters(draft);

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

  // Live result count for the drawer's primary action.
  useEffect(() => {
    if (!showFilters) return;
    let cancelled = false;
    setResultCount(null);
    dataSource
      .listProperties({ filters: draft })
      .then((page) => !cancelled && setResultCount(page.total))
      .catch(() => !cancelled && setResultCount(null));
    return () => {
      cancelled = true;
    };
  }, [showFilters, draft]);

  const runSearch = useCallback(
    (next: SearchFilters) => {
      const value = next.query.trim();
      if (!value && countActiveFilters(next) === 0) {
        inputRef.current?.focus();
        setStatus("Enter a locality, society, builder or city to search.");
        return;
      }
      applySearch(next);
      if (value) {
        const entry: RecentSearch = {
          id: `${Date.now()}`,
          label: value,
          query: value,
          tab: next.listingType,
          bhk: next.bedrooms[0] ? `${next.bedrooms[0]} BHK` : undefined,
        };
        persistRecent(
          [entry, ...recent.filter((r) => r.label.toLowerCase() !== value.toLowerCase())].slice(0, 6),
        );
      }
      setStatus(`Showing ${next.listingType} results${value ? ` for “${value}”` : ""}.`);
      document.getElementById("featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [persistRecent, recent],
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
      setListening(false);
      if (transcript) {
        setDraft((prev) => {
          const next = { ...prev, query: transcript };
          runSearch(next);
          return next;
        });
      }
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
    const bhk = item.bhk ? Number.parseInt(item.bhk, 10) : NaN;
    const next: SearchFilters = {
      ...draft,
      query: item.query,
      listingType: (item.tab as ListingType) ?? "buy",
      bedrooms: Number.isNaN(bhk) ? draft.bedrooms : [bhk],
    };
    setDraft(next);
    runSearch(next);
  };

  const handleSaveSearch = () => {
    const entry = savedSearches.save(draft);
    setStatus(`Saved search “${entry.name}”. We'll alert you when accounts are connected.`);
  };

  return (
    <section
      aria-label="Property search"
      className="rounded-xl border border-border bg-surface/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur-xl sm:p-5"
    >
      <div className="border-b border-border pb-3">
        <SearchTabs
          value={draft.listingType as never}
          onChange={(v) => setDraft((f) => ({ ...f, listingType: v as ListingType }))}
        />
      </div>

      <form
        className="pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(draft);
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
            value={draft.query}
            onChange={(e) => setDraft((f) => ({ ...f, query: e.target.value }))}
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
          <div className="min-w-0 flex-1 text-xs text-muted-foreground">
            {activeCount > 0 ? describeSearch(draft) : "Add filters to narrow down your search."}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              aria-expanded={showFilters}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[0.65rem] font-bold text-primary-foreground">
                  {activeCount}
                </span>
              )}
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
      </form>

      {isApplied && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              clearSearch();
              setDraft(emptyFilters(draft.listingType));
              setStatus("Search cleared.");
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear search
          </button>
          <button
            type="button"
            onClick={handleSaveSearch}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <BellPlus className="size-3.5" aria-hidden="true" />
            Save this search
          </button>
          {savedSearches.count > 0 && (
            <span className="text-xs text-muted-foreground">{savedSearches.count} saved</span>
          )}
        </div>
      )}

      <RecentSearches items={recent} onSelect={applyRecent} />

      <FiltersDrawer
        open={showFilters}
        value={draft}
        onChange={setDraft}
        onClose={() => setShowFilters(false)}
        onApply={() => {
          setShowFilters(false);
          runSearch(draft);
        }}
        onReset={() => setDraft(emptyFilters(draft.listingType))}
        onSaveSearch={handleSaveSearch}
        resultCount={resultCount}
      />

      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </section>
  );
}
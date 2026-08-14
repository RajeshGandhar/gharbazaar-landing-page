/**
 * Client-side persistence adapters.
 *
 * Every store here is a stand-in for a future Supabase table
 * (`shortlists`, `recently_viewed`, `saved_searches`). The hook signatures are
 * the contract the UI depends on — swapping the implementation to Supabase
 * later requires no component changes.
 */
import { useCallback, useEffect, useState } from "react";
import type { RecentlyViewedProperty, SavedSearch, SearchFilters } from "./types";
import { describeSearch } from "./format";

const CHANGE_EVENT = "gharbazaar:store-change";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    const sync = () => setValue(read(key, fallback));
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        write(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}

const SHORTLIST_KEY = "gharbazaar:shortlist";
const VIEWED_KEY = "gharbazaar:recently-viewed";
const COMPARE_KEY = "gharbazaar:compare";
const SAVED_KEY = "gharbazaar:saved-searches";

export const COMPARE_LIMIT = 3;

export function useShortlist() {
  const [ids, setIds] = usePersistentState<string[]>(SHORTLIST_KEY, []);
  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setIds],
  );
  const clear = useCallback(() => setIds([]), [setIds]);
  return { ids, toggle, clear, has: (id: string) => ids.includes(id), count: ids.length };
}

export function useRecentlyViewed() {
  const [items, setItems] = usePersistentState<RecentlyViewedProperty[]>(VIEWED_KEY, []);
  const record = useCallback(
    (propertyId: string) =>
      setItems((prev) =>
        [{ propertyId, viewedAt: new Date().toISOString() }, ...prev.filter((i) => i.propertyId !== propertyId)].slice(
          0,
          8,
        ),
      ),
    [setItems],
  );
  const clear = useCallback(() => setItems([]), [setItems]);
  return { items, ids: items.map((i) => i.propertyId), record, clear };
}

export function useCompare() {
  const [ids, setIds] = usePersistentState<string[]>(COMPARE_KEY, []);
  const toggle = useCallback(
    (id: string) =>
      setIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= COMPARE_LIMIT ? prev : [...prev, id],
      ),
    [setIds],
  );
  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), [setIds]);
  const clear = useCallback(() => setIds([]), [setIds]);
  return {
    ids,
    toggle,
    remove,
    clear,
    has: (id: string) => ids.includes(id),
    count: ids.length,
    isFull: ids.length >= COMPARE_LIMIT,
  };
}

export function useSavedSearches() {
  const [items, setItems] = usePersistentState<SavedSearch[]>(SAVED_KEY, []);
  const save = useCallback(
    (filters: SearchFilters, frequency: SavedSearch["frequency"] = "daily") => {
      const entry: SavedSearch = {
        id: `ss-${Date.now()}`,
        name: describeSearch(filters),
        filters,
        frequency,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [entry, ...prev.filter((s) => s.name !== entry.name)].slice(0, 10));
      return entry;
    },
    [setItems],
  );
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((s) => s.id !== id)), [setItems]);
  return { items, save, remove, count: items.length };
}

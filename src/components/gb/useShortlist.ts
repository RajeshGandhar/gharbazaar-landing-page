import { useCallback, useEffect, useState } from "react";

const KEY = "gharbazaar:shortlist";
const EVENT = "gharbazaar:shortlist-change";

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Local shortlist store — swap for a Supabase `shortlists` table when auth lands. */
export function useShortlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(EVENT));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { ids, toggle, has: (id: string) => ids.includes(id), count: ids.length };
}
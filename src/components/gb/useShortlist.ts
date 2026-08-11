import { useCallback, useEffect, useState } from "react";

const KEY = "gharbazaar:shortlist";

/** Local shortlist store — swap for a Supabase `shortlists` table when auth lands. */
export function useShortlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { ids, toggle, has: (id: string) => ids.includes(id), count: ids.length };
}
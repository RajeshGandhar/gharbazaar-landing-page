/**
 * Active-search store.
 *
 * Holds the `SearchFilters` currently applied on the page so the search module
 * and the results grid stay in sync. Swapping to URL-driven state or a
 * server-backed search later only changes this file.
 */
import { useSyncExternalStore } from "react";
import { emptyFilters, type SearchFilters } from "./types";

let current: SearchFilters = emptyFilters("buy");
let applied = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const snapshot = () => current;
const appliedSnapshot = () => applied;

export function applySearch(filters: SearchFilters) {
  current = filters;
  applied = true;
  emit();
}

export function clearSearch() {
  current = emptyFilters(current.listingType);
  applied = false;
  emit();
}

export function useActiveSearch() {
  const filters = useSyncExternalStore(subscribe, snapshot, snapshot);
  const isApplied = useSyncExternalStore(subscribe, appliedSnapshot, appliedSnapshot);
  return { filters, isApplied };
}
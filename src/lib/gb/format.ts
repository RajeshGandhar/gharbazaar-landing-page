import type { Property, SearchFilters } from "./types";

export function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatArea(sqft: number | null): string | null {
  return sqft === null ? null : `${sqft.toLocaleString("en-IN")} sq.ft.`;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  const months = Math.round(days / 30);
  return `Posted ${months} month${months > 1 ? "s" : ""} ago`;
}

const listingWord: Record<SearchFilters["listingType"], string> = {
  buy: "for sale",
  rent: "for rent",
  student: "student housing",
  commercial: "commercial",
  plots: "plots",
  projects: "new projects",
};

/** Human-readable name suggested for a saved search, e.g. "3 BHK in Mathura under ₹1 Cr". */
export function describeSearch(f: SearchFilters): string {
  const parts: string[] = [];
  const bhk = [...f.bedrooms].sort((a, b) => a - b)[0];
  if (bhk !== undefined) parts.push(`${bhk}+ BHK`);
  const type = f.propertyTypes[0];
  if (type) parts.push(type.replace(/-/g, " "));
  const where = f.locality ?? f.city ?? (f.query.trim() || null);
  parts.push(where ? `in ${where}` : listingWord[f.listingType]);
  if (f.maxPrice !== null) parts.push(`under ${formatINR(f.maxPrice)}`);
  const name = parts.join(" ").trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function propertyAltText(property: Property, index: number): string {
  const base = `${property.title} — ${property.location.locality}, ${property.location.city}`;
  return index === 0 ? base : `${base}, photo ${index + 1}`;
}
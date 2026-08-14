/**
 * GharBazaar data source adapter.
 *
 * The UI ONLY talks to `dataSource`. Today it is backed by mock records; when
 * the GharBazaar Supabase backend lands, implement `GharBazaarDataSource`
 * against Supabase and swap the export below — no screen changes required.
 */
import {
  mockLocalities,
  mockPlatformStats,
  mockPopularSearches,
  mockProjects,
  mockProperties,
  mockPropertyTypes,
} from "@/data/mock/gharbazaar.mock";
import type {
  Locality,
  PlatformStat,
  Project,
  Property,
  PropertyType,
  SearchFilters,
  SearchSuggestion,
} from "./types";

export interface PropertyQuery {
  filters?: Partial<SearchFilters>;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface Page<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

export interface GharBazaarDataSource {
  listProperties(query?: PropertyQuery): Promise<Page<Property>>;
  getPropertiesByIds(ids: string[]): Promise<Property[]>;
  listPropertyTypes(): Promise<PropertyType[]>;
  listLocalities(limit?: number): Promise<Locality[]>;
  listProjects(limit?: number): Promise<Project[]>;
  getPlatformStats(): Promise<PlatformStat[]>;
  suggest(term: string): Promise<SearchSuggestion[]>;
}

const LATENCY = 420;

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function matches(property: Property, filters: Partial<SearchFilters>): boolean {
  if (filters.listingType && property.listingType !== filters.listingType) return false;

  const term = filters.query?.trim().toLowerCase();
  if (term) {
    const haystack = [
      property.title,
      property.location.city,
      property.location.locality,
      property.propertyTypeName,
      property.seller.name,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(term)) return false;
  }

  if (filters.city && property.location.city !== filters.city) return false;
  if (filters.locality && property.location.locality !== filters.locality) return false;
  if (filters.propertyTypes?.length && !filters.propertyTypes.includes(property.propertyTypeSlug))
    return false;
  if (filters.bedrooms?.length && (property.bedrooms === null || !filters.bedrooms.includes(property.bedrooms)))
    return false;
  if (filters.minPrice != null && (property.price === null || property.price < filters.minPrice))
    return false;
  if (filters.maxPrice != null && (property.price === null || property.price > filters.maxPrice))
    return false;
  if (filters.furnishing?.length && !filters.furnishing.includes(property.furnishing ?? "")) return false;
  if (filters.construction?.length && !filters.construction.includes(property.construction ?? ""))
    return false;
  if (filters.amenities?.length && !filters.amenities.every((a) => property.amenities.includes(a)))
    return false;

  const prefs = filters.listingPreferences ?? [];
  if (prefs.includes("verified") && property.verificationStatus === "unverified") return false;
  if (prefs.includes("owner") && property.seller.type !== "owner") return false;
  if (prefs.includes("dealer") && property.seller.type !== "dealer") return false;
  return true;
}

export const mockDataSource: GharBazaarDataSource = {
  async listProperties(query = {}) {
    const { filters = {}, featuredOnly = false, limit, offset = 0 } = query;
    let items = mockProperties.filter((p) => matches(p, filters));
    if (featuredOnly) items = items.filter((p) => p.flags.includes("featured"));
    const total = items.length;
    const sliced = limit == null ? items.slice(offset) : items.slice(offset, offset + limit);
    return delay({ items: sliced, total, hasMore: offset + sliced.length < total });
  },
  async getPropertiesByIds(ids) {
    const set = new Set(ids);
    return delay(
      mockProperties.filter((p) => set.has(p.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)),
      200,
    );
  },
  async listPropertyTypes() {
    return delay(mockPropertyTypes, 260);
  },
  async listLocalities(limit) {
    return delay(limit ? mockLocalities.slice(0, limit) : mockLocalities, 320);
  },
  async listProjects(limit) {
    return delay(limit ? mockProjects.slice(0, limit) : mockProjects, 320);
  },
  async getPlatformStats() {
    return delay(mockPlatformStats, 240);
  },
  async suggest(term) {
    const value = term.trim().toLowerCase();
    if (!value) {
      return delay(
        mockPopularSearches.map((label) => ({
          id: `popular-${label}`,
          label,
          sublabel: "Popular search",
          kind: "query" as const,
        })),
        120,
      );
    }
    const localities: SearchSuggestion[] = mockLocalities
      .filter((l) => `${l.name} ${l.city}`.toLowerCase().includes(value))
      .map((l) => ({ id: l.id, label: l.name, sublabel: `${l.city}, ${l.state}`, kind: "locality" }));
    const projects: SearchSuggestion[] = mockProjects
      .filter((p) => p.name.toLowerCase().includes(value))
      .map((p) => ({ id: p.id, label: p.name, sublabel: p.developer, kind: "project" }));
    return delay([...localities, ...projects].slice(0, 8), 150);
  },
};

/** Swap this binding for a Supabase-backed implementation when the backend lands. */
export const dataSource: GharBazaarDataSource = mockDataSource;

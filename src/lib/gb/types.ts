/**
 * GharBazaar frontend data contract.
 *
 * These types are the ONLY shapes the UI knows about. The mock data layer and
 * the future GharBazaar backend adapter both produce these shapes, so screens
 * never learn where data came from.
 */

export type ListingType = "buy" | "rent" | "student" | "commercial" | "plots" | "projects";

export type VerificationStatus = "unverified" | "verified" | "owner-verified";

export type SellerType = "owner" | "dealer" | "builder";

export type PropertyFlag = "new" | "featured" | "premium";

export interface PropertyImage {
  id: string;
  /** Resolved URL (bundled asset today, CDN URL once the backend is connected). */
  url: string;
  alt: string;
  width: number;
  height: number;
}

/** Map-ready location contract. Coordinates stay null until the backend supplies them. */
export interface PropertyLocation {
  city: string;
  locality: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Seller {
  id: string;
  name: string;
  type: SellerType;
  verified: boolean;
}

export type PropertyTypeGroup = "residential" | "commercial" | "land" | "other";

export interface PropertyType {
  id: string;
  slug: string;
  name: string;
  group: PropertyTypeGroup;
  image: string | null;
  /** null when the backend has not supplied a real count — never invent one. */
  count: number | null;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  listingType: ListingType;
  propertyTypeSlug: string;
  propertyTypeName: string;
  price: number | null;
  priceLabel: string;
  /** e.g. "₹4,730 / sq.ft." — null when not applicable. */
  priceUnitLabel: string | null;
  location: PropertyLocation;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  furnishing: string | null;
  construction: string | null;
  amenities: string[];
  images: PropertyImage[];
  verificationStatus: VerificationStatus;
  seller: Seller;
  /** ISO timestamp. */
  postedAt: string;
  flags: PropertyFlag[];
}

export interface Locality {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  propertyCount: number | null;
  averagePriceLabel: string | null;
  image: string | null;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  developer: string;
  location: PropertyLocation;
  startingPriceLabel: string | null;
  possession: string | null;
  configurations: string[];
  amenities: string[];
  images: PropertyImage[];
  reraNumber: string | null;
  status: "pre-launch" | "under-construction" | "ready-to-move";
}

export interface SearchFilters {
  listingType: ListingType;
  query: string;
  city: string | null;
  locality: string | null;
  propertyTypes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number[];
  furnishing: string[];
  construction: string[];
  amenities: string[];
  /** verified | owner | dealer | new-projects — backend-gated, see FUTURE_FILTERS. */
  listingPreferences: string[];
}

export type AlertFrequency = "instant" | "daily" | "weekly";

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  frequency: AlertFrequency;
  createdAt: string;
}

export interface RecentlyViewedProperty {
  propertyId: string;
  viewedAt: string;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  sublabel: string | null;
  kind: "city" | "locality" | "project" | "query";
}

export interface PlatformStat {
  id: string;
  value: string | null;
  label: string;
}

export function emptyFilters(listingType: ListingType = "buy"): SearchFilters {
  return {
    listingType,
    query: "",
    city: null,
    locality: null,
    propertyTypes: [],
    minPrice: null,
    maxPrice: null,
    bedrooms: [],
    furnishing: [],
    construction: [],
    amenities: [],
    listingPreferences: [],
  };
}

export function countActiveFilters(f: SearchFilters): number {
  return (
    f.propertyTypes.length +
    f.bedrooms.length +
    f.furnishing.length +
    f.construction.length +
    f.amenities.length +
    f.listingPreferences.length +
    (f.minPrice !== null ? 1 : 0) +
    (f.maxPrice !== null ? 1 : 0)
  );
}
import apartmentImg from "@/assets/prop-apartment.jpg";
import villaImg from "@/assets/prop-villa.jpg";
import interiorImg from "@/assets/prop-interior.jpg";
import towersImg from "@/assets/proj-towers.jpg";
import plotsImg from "@/assets/cat-plots.jpg";
import commercialImg from "@/assets/cat-commercial.jpg";
import ncrImg from "@/assets/city-ncr.jpg";
import mathuraImg from "@/assets/city-mathura.jpg";
import agraImg from "@/assets/city-agra.jpg";
import jaipurImg from "@/assets/city-jaipur.jpg";
import lucknowImg from "@/assets/city-lucknow.jpg";

/**
 * Demo data layer.
 * Shapes mirror the intended Supabase tables so `properties`, `projects` and
 * `localities` below can later be swapped for query results with no UI change.
 */

export type ListingType = "buy" | "rent" | "commercial" | "plots" | "projects";

export interface Property {
  id: string;
  title: string;
  propertyType: string;
  listingType: ListingType;
  price: number; // in INR
  priceLabel: string;
  city: string;
  locality: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number; // sq.ft.
  furnishing: string;
  images: string[];
  verified: boolean;
  featured: boolean;
}

export const properties: Property[] = [
  {
    id: "gb-1001",
    title: "Modern 3 BHK Apartment",
    propertyType: "Apartment",
    listingType: "buy",
    price: 7800000,
    priceLabel: "₹78 Lakh",
    city: "Mathura",
    locality: "Vrindavan",
    bedrooms: 3,
    bathrooms: 3,
    area: 1650,
    furnishing: "Semi-Furnished",
    images: [apartmentImg],
    verified: true,
    featured: true,
  },
  {
    id: "gb-1002",
    title: "4 BHK Independent Villa",
    propertyType: "Villa",
    listingType: "buy",
    price: 21500000,
    priceLabel: "₹2.15 Cr",
    city: "Mathura",
    locality: "Krishna Nagar",
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    furnishing: "Unfurnished",
    images: [villaImg],
    verified: true,
    featured: true,
  },
  {
    id: "gb-1003",
    title: "Spacious 2 BHK in Gated Society",
    propertyType: "Apartment",
    listingType: "rent",
    price: 24000,
    priceLabel: "₹24,000 /mo",
    city: "Noida",
    locality: "Sector 137",
    bedrooms: 2,
    bathrooms: 2,
    area: 1080,
    furnishing: "Fully Furnished",
    images: [interiorImg],
    verified: true,
    featured: true,
  },
  {
    id: "gb-1004",
    title: "Premium Office Space",
    propertyType: "Office",
    listingType: "commercial",
    price: 14500000,
    priceLabel: "₹1.45 Cr",
    city: "Gurugram",
    locality: "Golf Course Ext. Road",
    bedrooms: null,
    bathrooms: 2,
    area: 1400,
    furnishing: "Bare Shell",
    images: [commercialImg],
    verified: false,
    featured: true,
  },
  {
    id: "gb-1005",
    title: "Residential Plot in Township",
    propertyType: "Plot",
    listingType: "plots",
    price: 3600000,
    priceLabel: "₹36 Lakh",
    city: "Mathura",
    locality: "Govardhan Road",
    bedrooms: null,
    bathrooms: null,
    area: 1800,
    furnishing: "NA",
    images: [plotsImg],
    verified: true,
    featured: true,
  },
  {
    id: "gb-1006",
    title: "3 BHK with Balcony Views",
    propertyType: "Apartment",
    listingType: "buy",
    price: 9200000,
    priceLabel: "₹92 Lakh",
    city: "Jaipur",
    locality: "Mansarovar",
    bedrooms: 3,
    bathrooms: 2,
    area: 1490,
    furnishing: "Semi-Furnished",
    images: [towersImg],
    verified: true,
    featured: true,
  },
];

export interface Category {
  id: string;
  name: string;
  count: string;
  image: string;
}

export const categories: Category[] = [
  { id: "new-projects", name: "New Projects", count: "1,240 projects", image: towersImg },
  { id: "luxury", name: "Luxury Homes", count: "860 homes", image: villaImg },
  { id: "ready", name: "Ready to Move", count: "3,410 homes", image: apartmentImg },
  { id: "affordable", name: "Affordable Homes", count: "2,180 homes", image: interiorImg },
  { id: "plots", name: "Plots & Land", count: "970 plots", image: plotsImg },
  { id: "commercial", name: "Commercial", count: "540 spaces", image: commercialImg },
];

export interface Locality {
  id: string;
  name: string;
  state: string;
  count: string;
  image: string;
}

export const localities: Locality[] = [
  { id: "mathura", name: "Mathura", state: "Uttar Pradesh", count: "1,240 properties", image: mathuraImg },
  { id: "vrindavan", name: "Vrindavan", state: "Uttar Pradesh", count: "860 properties", image: villaImg },
  { id: "agra", name: "Agra", state: "Uttar Pradesh", count: "1,510 properties", image: agraImg },
  { id: "delhi-ncr", name: "Delhi NCR", state: "National Capital Region", count: "12,300 properties", image: ncrImg },
  { id: "noida", name: "Noida", state: "Uttar Pradesh", count: "5,420 properties", image: apartmentImg },
  { id: "gurugram", name: "Gurugram", state: "Haryana", count: "6,180 properties", image: commercialImg },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", count: "3,240 properties", image: jaipurImg },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", count: "2,760 properties", image: lucknowImg },
];

export interface Project {
  id: string;
  name: string;
  builder: string;
  city: string;
  locality: string;
  startingPriceLabel: string;
  configuration: string;
  possession: string;
  reraApproved: boolean;
  image: string;
}

export const projects: Project[] = [
  {
    id: "pr-01",
    name: "Premium Heights",
    builder: "Yamuna Group",
    city: "Mathura",
    locality: "Vrindavan",
    startingPriceLabel: "₹45 Lakh",
    configuration: "2 & 3 BHK",
    possession: "Possession Dec 2026",
    reraApproved: true,
    image: towersImg,
  },
  {
    id: "pr-02",
    name: "Braj Residency",
    builder: "Shreeji Buildcon",
    city: "Mathura",
    locality: "Govardhan Road",
    startingPriceLabel: "₹32 Lakh",
    configuration: "1, 2 & 3 BHK",
    possession: "Ready to Move",
    reraApproved: true,
    image: apartmentImg,
  },
  {
    id: "pr-03",
    name: "Aravalli Greens",
    builder: "Northline Developers",
    city: "Gurugram",
    locality: "Sohna Road",
    startingPriceLabel: "₹1.15 Cr",
    configuration: "3 & 4 BHK",
    possession: "Possession Mar 2027",
    reraApproved: true,
    image: villaImg,
  },
];

/** Configurable marketing stats — replace with Supabase aggregates later. */
export interface Stat {
  id: string;
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { id: "listings", value: "50K+", label: "Properties Listed" },
  { id: "seekers", value: "10K+", label: "Home Seekers" },
  { id: "agents", value: "500+", label: "Verified Agents" },
  { id: "cities", value: "100+", label: "Cities" },
];

export const demoRecentSearches = [
  { id: "rs-1", label: "Mathura", query: "Mathura", tab: "buy" as ListingType },
  { id: "rs-2", label: "Vrindavan", query: "Vrindavan", tab: "buy" as ListingType },
  { id: "rs-3", label: "2 BHK in Mathura", query: "2 BHK in Mathura", tab: "buy" as ListingType, bhk: "2 BHK" },
  { id: "rs-4", label: "Gated Society", query: "Gated Society", tab: "rent" as ListingType },
];

export { apartmentImg, villaImg, interiorImg, towersImg, plotsImg, commercialImg };
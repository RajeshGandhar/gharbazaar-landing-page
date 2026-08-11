import { ChevronDown } from "lucide-react";

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function SelectField({ id, label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none truncate rounded-md border border-border bg-surface-2 px-3 py-3 pr-9 text-sm text-foreground transition-colors hover:border-primary/40"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-surface-2 text-foreground">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

export interface FilterState {
  propertyType: string;
  budget: string;
  bhk: string;
}

export const propertyTypeOptions = [
  "Property Type",
  "Apartment",
  "Independent House",
  "Villa",
  "Plot",
  "Office Space",
  "Shop / Showroom",
];
export const budgetOptions = [
  "Budget",
  "Under ₹25 Lakh",
  "₹25 – 50 Lakh",
  "₹50 Lakh – 1 Cr",
  "₹1 – 2 Cr",
  "Above ₹2 Cr",
];
export const bhkOptions = ["BHK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];

export function SearchFilters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (v: FilterState) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <SelectField
        id="filter-property-type"
        label="Property type"
        value={value.propertyType}
        options={propertyTypeOptions}
        onChange={(v) => onChange({ ...value, propertyType: v })}
      />
      <SelectField
        id="filter-budget"
        label="Budget"
        value={value.budget}
        options={budgetOptions}
        onChange={(v) => onChange({ ...value, budget: v })}
      />
      <SelectField
        id="filter-bhk"
        label="Bedrooms"
        value={value.bhk}
        options={bhkOptions}
        onChange={(v) => onChange({ ...value, bhk: v })}
      />
    </div>
  );
}
import { LOCATION_OPTIONS } from "@/constants/locations";

export type SelectOption = {
  value: string;
  label: string;
};

/** Mongoose returns [] for enumValues on plain String fields; treat that as missing. */
export function normalizeSelectOptions(
  options: SelectOption[] | undefined | null,
  fallback: SelectOption[],
): SelectOption[] {
  return options?.length ? options : fallback;
}

/** Keep edit forms working when DB has a value not in the current option list. */
export function withCurrentSelectOption(
  options: SelectOption[],
  value: string | undefined,
): SelectOption[] {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }
  const label = value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return [...options, { value, label }];
}

export const FALLBACK_PROPERTY_OPTIONS = {
  categories: [
    { value: "for_sale", label: "For Sale" },
    { value: "for_rent", label: "For Rent" },
    { value: "off_plan", label: "Off-Plan" },
    { value: "commercial", label: "Commercial" },
  ] as SelectOption[],
  propertyTypes: [
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Townhouse" },
    { value: "penthouse", label: "Penthouse" },
    { value: "office", label: "Office" },
    { value: "retail", label: "Retail" },
    { value: "warehouse", label: "Warehouse" },
  ] as SelectOption[],
  statuses: [
    { value: "available", label: "Available" },
    { value: "sold", label: "Sold" },
    { value: "rented", label: "Rented" },
    { value: "reserved", label: "Reserved" },
  ] as SelectOption[],
  amenities: [
    { value: "swimming_pool", label: "Swimming Pool" },
    { value: "gym", label: "Gym" },
    { value: "parking", label: "Parking" },
    { value: "balcony", label: "Balcony" },
    { value: "sea_view", label: "Sea View" },
    { value: "city_view", label: "City View" },
    { value: "concierge", label: "Concierge" },
    { value: "security", label: "Security" },
    { value: "garden", label: "Garden" },
    { value: "beach_access", label: "Beach Access" },
    { value: "kids_play_area", label: "Kids Play Area" },
    { value: "bbq_area", label: "BBQ Area" },
    { value: "sauna", label: "Sauna" },
    { value: "jacuzzi", label: "Jacuzzi" },
    { value: "maid_room", label: "Maid Room" },
  ] as SelectOption[],
  locations: LOCATION_OPTIONS as unknown as SelectOption[],
  inquiryTypes: [
    { value: "general", label: "General Inquiry" },
    { value: "viewing", label: "Schedule Viewing" },
    { value: "valuation", label: "Property Valuation" },
    { value: "investment", label: "Investment Advisory" },
  ] as SelectOption[],
};

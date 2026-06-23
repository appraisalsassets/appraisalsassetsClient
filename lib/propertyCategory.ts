/** Normalize category text (e.g. "Off-Plan", "off plan") to a comparable key. */
export function normalizeCategoryKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function isOffPlanCategory(value: string): boolean {
  const key = normalizeCategoryKey(value);
  return key === "off_plan" || key === "offplan" || key.includes("off_plan");
}

/** Map legacy/variant values to the canonical category used in filters and forms. */
export function normalizePropertyCategory(value = ""): string {
  const key = normalizeCategoryKey(value);
  if (!key) return "";

  if (
    key === "for_sale" ||
    key === "sale" ||
    key === "forsale" ||
    key === "buy"
  ) {
    return "for_sale";
  }

  if (
    key === "for_rent" ||
    key === "for_rental" ||
    key === "rent" ||
    key === "rental"
  ) {
    return "for_rent";
  }

  if (isOffPlanCategory(key)) {
    return "off_plan";
  }

  if (key === "commercial") {
    return "commercial";
  }

  return key;
}

export function categoryMatches(stored = "", filter = ""): boolean {
  if (!filter) return true;
  return (
    normalizePropertyCategory(stored) === normalizePropertyCategory(filter)
  );
}

export const CATEGORY_LABELS: Record<string, string> = {
  for_sale: "For Sale",
  for_rent: "For Rent",
  off_plan: "Off-Plan",
  commercial: "Commercial",
};

export function getCategoryLabel(value = ""): string {
  const canonical = normalizePropertyCategory(value);
  return (
    CATEGORY_LABELS[canonical] ||
    String(value).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export const CATEGORY_COLORS: Record<string, string> = {
  for_sale: "bg-emerald-500",
  for_rent: "bg-blue-500",
  off_plan: "bg-[#C1A06E]",
  commercial: "bg-purple-500",
};

export function getCategoryColor(value = ""): string {
  const canonical = normalizePropertyCategory(value);
  return CATEGORY_COLORS[canonical] || "bg-gray-500";
}

export function isRentalCategory(value = ""): boolean {
  return normalizePropertyCategory(value) === "for_rent";
}

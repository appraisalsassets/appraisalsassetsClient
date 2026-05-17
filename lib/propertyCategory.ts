/** Normalize category text (e.g. "Off-Plan", "off plan") to a comparable key. */
export function normalizeCategoryKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function isOffPlanCategory(value: string): boolean {
  const key = normalizeCategoryKey(value);
  return key === "off_plan" || key === "offplan" || key.includes("off_plan");
}

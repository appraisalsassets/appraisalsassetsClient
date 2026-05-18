import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** UAE dirham display for public property and mortgage UI */
export function formatAed(
  amount: number,
  options?: { maximumFractionDigits?: number },
): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(value);
}

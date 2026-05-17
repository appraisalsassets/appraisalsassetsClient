import { normalizePropertyImageUrls } from "@/lib/propertyImages";

/**
 * Map API Property documents to the shape expected by DeveloperProjectCard.
 */
export function mapPropertyToDeveloperProjectShape(
  p: Record<string, unknown>,
  slug: string,
  fallbackDeveloperName?: string,
) {
  const imgs = normalizePropertyImageUrls(
    Array.isArray(p.images) ? (p.images as Parameters<typeof normalizePropertyImageUrls>[0]) : [],
  );
  const price = p.price as { amount?: number; currency?: string } | undefined;
  return {
    _id: String(p._id ?? ""),
    title: String(p.title ?? ""),
    description: p.description || "",
    developerId: p.developerId || "",
    developerName: p.developerName || fallbackDeveloperName || "",
    developerSlug: p.developerSlug || slug,
    location: p.location,
    propertyType: p.propertyType,
    price: price && typeof price.amount === "number"
      ? { amount: price.amount, currency: price.currency || "AED" }
      : { amount: 0, currency: "AED" },
    sizeFrom: p.sizeSqft ?? p.sizeFrom ?? 0,
    sizeTo: p.sizeTo ?? p.sizeSqft ?? 0,
    bedroomsFrom: p.bedroomsFrom ?? p.bedrooms,
    bedroomsTo: p.bedroomsTo ?? p.bedrooms,
    status: p.status || "available",
    images: imgs,
    featured: p.isFeatured ?? p.featured ?? false,
    completionDate: p.completionDate,
    handoverDate: p.handoverDate,
    amenities: p.amenities || [],
    phone: p.phone,
    whatsAppNumber: p.whatsAppNumber,
    contactEmail: p.contactEmail,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// Unified Property Interface for all components
export interface Property {
  id?: string; // For frontend compatibility
  _id?: string; // For backend compatibility
  title: string;
  description?: string;
  category?: string;
  propertyType?: string;
  status?: string;
  price: {
    amount: number;
    currency: string;
  };
  sizeSqft?: number;
  sqft?: number; // Alternative field name
  referenceNumber?: string;
  bedrooms?: number;
  beds?: number; // Alternative field name
  bathrooms?: number;
  baths?: number; // Alternative field name
  amenities?: string[];
  images: Array<{
    url: string;
    isCover?: boolean;
  }>;
  documentPdf?: {
    downloadUrl?: string;
    url?: string;
    fileName?: string;
  };
  location: string;
  phone?: string;
  whatsAppNumber?: string;
  email?: string;
  developerName?: string;
  developerSlug?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// PropertyCard Props Interface
export interface PropertyCardProps {
  id?: string;
  image?: string;
  title: string;
  price: string;
  location: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  featured?: boolean;
  category?: string;
  propertyType?: string;
  amenities?: string[];
  description?: string;
  referenceNumber?: string;
  phone?: string;
  whatsAppNumber?: string;
  email?: string;
  status?: string;
  wrapInLink?: boolean;
}

// Helper function to normalize property data
export function normalizeProperty(property: Record<string, unknown>): Property {
  return {
    id: (property.id as string) || (property._id as string),
    _id: (property._id as string) || (property.id as string),
    title: (property.title as string) || "Property",
    description: property.description as string,
    category: property.category as string,
    propertyType: property.propertyType as string,
    status: property.status as string,
    price: (property.price as { amount: number; currency: string }) || {
      amount: 0,
      currency: "AED",
    },
    sizeSqft: (property.sizeSqft as number) || (property.sqft as number) || 0,
    sqft: (property.sqft as number) || (property.sizeSqft as number) || 0,
    referenceNumber: property.referenceNumber as string,
    bedrooms: (property.bedrooms as number) || (property.beds as number) || 0,
    beds: (property.beds as number) || (property.bedrooms as number) || 0,
    bathrooms:
      (property.bathrooms as number) || (property.baths as number) || 0,
    baths: (property.baths as number) || (property.bathrooms as number) || 0,
    amenities: (property.amenities as string[]) || [],
    images:
      (property.images as Array<{ url: string; isCover?: boolean }>) || [],
    documentPdf: (property.documentPdf as { url?: string; fileName?: string }) || {
      url: "",
      fileName: "",
    },
    location: (property.location as string) || "Dubai",
    phone: property.phone as string,
    whatsAppNumber: property.whatsAppNumber as string,
    email: property.email as string,
    developerName: property.developerName as string,
    developerSlug: property.developerSlug as string,
    isFeatured: (property.isFeatured as boolean) || false,
    isActive: (property.isActive as boolean) !== false, // Default to true
    createdAt: property.createdAt as string,
    updatedAt: property.updatedAt as string,
  };
}

// Helper function to get property image
export function getPropertyImage(property: Property): string {
  if (property.images && property.images.length > 0) {
    const coverImage = property.images.find((img) => img.isCover);
    return coverImage?.url || property.images[0].url;
  }
  return "";
}

// Helper function to format price
export function formatPrice(price: {
  amount: number;
  currency: string;
}): string {
  return `${price.currency} ${price.amount.toLocaleString()}`;
}

// Helper function to format location
export function formatLocation(location: string): string {
  const locationLabels: Record<string, string> = {
    dubai_marina: "Dubai Marina",
    downtown_dubai: "Downtown Dubai",
    bussiness_bay: "Business Bay",
    jvc: "JVC",
    palm_jumeirah: "Palm Jumeirah",
    dubai_hills: "Dubai Hills",
    arabian_ranches: "Arabian Ranches",
    emaar_beachfront: "Emaar Beachfront",
    blue_waters: "Bluewaters",
    city_walks: "City Walk",
  };
  return (
    locationLabels[location] ||
    location.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

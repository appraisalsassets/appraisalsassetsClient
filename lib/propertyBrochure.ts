const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://appraisalsassets-server.vercel.app/api";

export function getPropertyBrochureDownloadUrl(propertyId: string): string {
  const base = API_BASE.replace(/\/$/, "");
  return `${base}/properties/${propertyId}/brochure`;
}

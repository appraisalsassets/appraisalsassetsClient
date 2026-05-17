export type PropertyImageInput =
  | string
  | { url?: string | null; isCover?: boolean }
  | null
  | undefined;

function extractUrl(img: PropertyImageInput): string {
  if (typeof img === "string") return img.trim();
  if (img && typeof img === "object" && typeof img.url === "string") {
    return img.url.trim();
  }
  return "";
}

const INVALID_URL_TOKENS = new Set(["null", "undefined", "none", "n/a"]);

/** True if the value can be used as an img src (absolute http(s) or site-relative path). */
export function isValidPropertyImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || INVALID_URL_TOKENS.has(trimmed.toLowerCase())) return false;
  if (/^[a-zA-Z]:\\/.test(trimmed) || trimmed.includes("\\")) return false;
  if (trimmed.startsWith("blob:")) return false;
  if (trimmed.startsWith("data:")) return trimmed.length > 32;
  if (trimmed.startsWith("//")) return true;
  if (trimmed.startsWith("/") && trimmed.length > 1) return true;
  try {
    const withProtocol = trimmed.startsWith("//")
      ? `https:${trimmed}`
      : trimmed;
    const parsed = new URL(withProtocol);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Prefer https for protocol-relative URLs. */
export function resolvePropertyImageUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed;
}

/** Normalize API images: drop empty entries, prefer cover image first. */
export function normalizePropertyImageUrls(
  images?: PropertyImageInput[] | null,
): string[] {
  if (!Array.isArray(images) || images.length === 0) return [];

  const parsed = images
    .map((img) => {
      const url = extractUrl(img);
      if (!isValidPropertyImageUrl(url)) return null;
      const isCover =
        img && typeof img === "object" && "isCover" in img
          ? Boolean((img as { isCover?: boolean }).isCover)
          : false;
      return { url, isCover };
    })
    .filter((item): item is { url: string; isCover: boolean } => item !== null);

  parsed.sort((a, b) => Number(b.isCover) - Number(a.isCover));
  return parsed.map((item) => resolvePropertyImageUrl(item.url));
}

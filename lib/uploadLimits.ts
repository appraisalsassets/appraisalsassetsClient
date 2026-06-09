export function isLocalApiUrl(apiUrl = process.env.NEXT_PUBLIC_API_URL || ""): boolean {
  return /localhost|127\.0\.0\.1/i.test(apiUrl);
}

/** Vercel serverless request body limit is ~4.5MB. */
export function getMaxPropertyUploadBytes(): number {
  return isLocalApiUrl() ? 60 * 1024 * 1024 : 4 * 1024 * 1024;
}

export function getPropertyUploadSize(
  images: File[],
  pdfFile: File | null,
): number {
  const imageBytes = images.reduce((sum, file) => sum + file.size, 0);
  return imageBytes + (pdfFile?.size ?? 0);
}

export function formatMegabytes(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(1);
}

export function getPropertyUploadTooLargeMessage(bytes: number): string {
  const limitMb = formatMegabytes(getMaxPropertyUploadBytes());
  const totalMb = formatMegabytes(bytes);
  return `Total upload is ${totalMb}MB (limit ~${limitMb}MB). Use fewer or smaller images, add photos via Image URLs, or upload a smaller PDF.`;
}

/** Admin UI hints that must never appear as public copy. */
const PLACEHOLDER_PATTERNS = [
  /shown on the public off-plan developers directory/i,
  /trusted partners page when uploaded/i,
  /logo coming soon/i,
];

export function isDeveloperPlaceholderText(value?: string | null): boolean {
  const text = value?.trim() ?? "";
  if (!text) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text));
}

/** Text for the About section (about first, then valid short description). */
export function getDeveloperAboutText(
  about?: string | null,
  shortDescription?: string | null,
): string {
  const aboutText = about?.trim();
  if (aboutText && !isDeveloperPlaceholderText(aboutText)) return aboutText;

  const shortText = shortDescription?.trim();
  if (shortText && !isDeveloperPlaceholderText(shortText)) return shortText;

  return "";
}

/** One-line summary for hero (never admin placeholder copy). */
export function getDeveloperSummaryText(
  shortDescription?: string | null,
  focus?: string | null,
): string {
  const shortText = shortDescription?.trim();
  if (shortText && !isDeveloperPlaceholderText(shortText)) return shortText;

  const focusText = focus?.trim();
  if (focusText && !isDeveloperPlaceholderText(focusText)) return focusText;

  return "";
}

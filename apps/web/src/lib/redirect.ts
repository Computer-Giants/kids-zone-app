export function getSafeRedirectUrl(
  target: string | null | undefined,
  defaultUrl = "/parent",
): string {
  if (!target || typeof target !== "string") {
    return defaultUrl;
  }
  const trimmed = target.trim();
  // Ensure relative path starting with single slash, preventing protocol-relative and backslash escapes
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
    return trimmed;
  }
  return defaultUrl;
}

export function toValidPackageName(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  const sanitized = cleaned.replace(/^[_.]+/, "");

  return sanitized || "bend-app";
}

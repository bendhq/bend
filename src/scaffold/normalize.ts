export function toValidPackageName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-") // replace invalid chars with "-"
      .replace(/^-+/, "") // remove leading "-"
      .replace(/-+$/, "") || // remove trailing "-"
    "my-app"
  );
}

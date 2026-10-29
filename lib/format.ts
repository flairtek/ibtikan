/** GHS-formatted property price, e.g. "GH₵ 450,000" or price on request. */
export function formatPrice(
  price: number | null | undefined,
  currency = "GHS"
): string {
  if (price == null || !Number.isFinite(price)) return "Price on request";
  const symbol = currency === "GHS" ? "GH₵" : currency;
  return `${symbol} ${new Intl.NumberFormat("en-GH", {
    maximumFractionDigits: 0,
  }).format(price)}`;
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-GH", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function safeList(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map(String).filter((v) => v.length > 0)
      : [];
  } catch {
    return [];
  }
}

export function parseGallery(raw: string): { url: string; alt: string }[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value.endsWith("Z") ? value : `${value}Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function money(
  price: number | null | undefined,
  currency = "GHS",
  transactionType = "sale"
): string {
  const base = formatPrice(price, currency);
  if (transactionType === "rent" && price != null && Number.isFinite(price)) return `${base} /mo`;
  return base;
}

export function dateTime(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value.endsWith("Z") ? value : `${value}Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

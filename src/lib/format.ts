const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});
const plain = new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 });

/** ₱20,000 */
export const formatPeso = (n: number) => peso.format(Math.round(n));

/** 20,000 (no currency sign, as on the group cards) */
export const formatNumber = (n: number) => plain.format(Math.round(n));

/** Parses "2026-12-09" as a local date (avoids the UTC off-by-one). */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** December 9, 2026 */
export const formatLongDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** Wednesday - December 9, 2026 */
export const formatDayLine = (d: Date) =>
  `${d.toLocaleDateString("en-US", { weekday: "long" })} - ${formatLongDate(d)}`;

export function greeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

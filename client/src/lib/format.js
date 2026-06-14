// Formatting helpers for currency, dates, and deadlines.

export function formatCurrency(amount, currency = "EUR") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount, currency = "EUR") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

// Days until a deadline (negative if past).
export function daysUntil(iso) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function deadlineLabel(iso) {
  const d = daysUntil(iso);
  if (d == null) return "No deadline";
  if (d < 0) return "Closed";
  if (d === 0) return "Closes today";
  if (d === 1) return "1 day left";
  return `${d} days left`;
}

export function relativeTime(iso) {
  const d = daysUntil(iso);
  if (d == null) return "";
  const past = -d;
  if (past <= 0) return "just now";
  if (past === 1) return "yesterday";
  if (past < 7) return `${past} days ago`;
  if (past < 30) return `${Math.floor(past / 7)} weeks ago`;
  return formatDate(iso);
}

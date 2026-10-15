// ₹4,50,000 (Indian digit grouping)
export const formatINR = (value) => "₹" + Math.round(Number(value) || 0).toLocaleString("en-IN");

// ₹4.5 L, ₹2 Cr
export function formatINRShort(value) {
  const amount = Number(value) || 0;
  if (amount >= 10000000) return `₹${+(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${+(amount / 100000).toFixed(2)} L`;
  return formatINR(amount);
}

// 16 Oct 2026
export const formatDate = (value) => value
  ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  : "Not recorded";

// 16 October 2026 at 12:07 pm
export const formatDateTime = (value) => value
  ? new Date(value).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" })
  : "Not recorded";

export const isToday = (value) => Boolean(value) && new Date(value).toDateString() === new Date().toDateString();

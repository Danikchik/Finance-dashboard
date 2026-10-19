export const CATEGORY_META = {
  Food: { color: "#e07a3f", icon: "food" },
  Transport: { color: "#3b82c4", icon: "transport" },
  Housing: { color: "#7c6bc4", icon: "home" },
  Shopping: { color: "#d1568a", icon: "bag" },
  Health: { color: "#2ba39a", icon: "heart" },
  Entertainment: { color: "#c9a227", icon: "film" },
  Salary: { color: "#1f8a5b", icon: "banknote" },
  Other: { color: "#7b8794", icon: "dots" },
};

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

export const INCOME_CATEGORIES = ["Salary", "Other"];

export function getCategoryColor(name) {
  return (CATEGORY_META[name] || CATEGORY_META.Other).color;
}

export const WALLET_TYPES = [
  { value: "bank", label: "Bank account", icon: "bank" },
  { value: "cash", label: "Cash", icon: "banknote" },
  { value: "card", label: "Card", icon: "card" },
  { value: "savings", label: "Savings", icon: "savings" },
];

export const CURRENCIES = ["USD", "EUR", "UZS"];

export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function dateToString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function today() {
  return dateToString(new Date());
}
export function getMonthKey(offset = 0) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return dateToString(date).slice(0, 7);
}

export function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "UZS" ? 0 : 2,
  }).format(Number(amount) || 0);
}

export function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getWalletBalance(wallet, transactions) {
  let balance = Number(wallet.startBalance) || 0;
  for (const t of transactions) {
    if (t.walletId !== wallet.id) continue;
    balance += t.type === "income" ? t.amount : -t.amount;
  }
  return balance;
}

export function sumByType(transactions, type) {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getPercentChange(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatDayLabel(dateString) {
  if (dateString === today()) return "Today";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateString === dateToString(yesterday)) return "Yesterday";

  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function currencySymbol(currency) {
  const parts = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).formatToParts(0);
  return parts.find((p) => p.type === "currency").value;
}

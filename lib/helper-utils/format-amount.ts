export function formatAmount(amount: number, currency?: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "usd",
  }).format(amount / 100);
}

export function roundCents(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function clampNonNegative(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(roundCents(n));
}

export function hoursLabel(n: number): string {
  return `${roundCents(n).toFixed(2)} hrs`;
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

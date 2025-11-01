export function formatPlanPrice(price?: number | null): string {
  const p = price ?? 0;
  if (p === 0) return 'Gratis';
  if (p > 0 && p < 1) {
    const pct = p * 100;
    const pctStr = Number.isInteger(pct) ? String(pct) : String(parseFloat(pct.toFixed(1)));
    return `${pctStr}%/renta`;
  }
  // price >= 1
  return Number.isInteger(p) ? `$${p}` : `$${p.toFixed(2)}`;
}

export default formatPlanPrice;

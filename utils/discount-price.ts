const EARLY_ACCESS_DISCOUNT = 100;

export function applyEarlyDiscount(price: number): number {
  // if result is negative, return 0
  if (price - EARLY_ACCESS_DISCOUNT < 0) return 0;

  return price - EARLY_ACCESS_DISCOUNT;
}

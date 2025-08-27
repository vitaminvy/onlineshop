/**
 * Calculate shipping fee based on method and item count
 * @param method - "standard" | "express" | undefined
 * @param subtotal - total product value
 * @param totalItems - number of items
 */
export function calculateShippingFee(
  method: "standard" | "express" | undefined,
  subtotal: number,
  totalItems: number
): number {
  if (subtotal <= 0 || !method) return 0;

  if (method === "standard") {
    return 20000 + totalItems * 2000;
  }
  if (method === "express") {
    return 50000 + totalItems * 8000;
  }
  return 0;
}

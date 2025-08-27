/**
     * Input: array of cart items
     * Process: + If cart empty => return 0
     *          + baseCode = 20k 
     *          + total = baseCode + 2k * each quanity of item
     * Output: estimateShipping
     */
export function estimateShipping(subtotal: number, totalItems: number) {
  if (subtotal <= 0) return 0;
  return 20000 + totalItems * 2000; 
}

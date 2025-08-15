/**
 * Input: amount (number) - raw price value in VND
 * Process: format with Intl.NumberFormat for vi-VN and VND
 * Output: localized currency string
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

/**
 * Input: n (number)
 * Process: group digits with locale-aware separators
 * Output: formatted number string
 */
export function formatNumber(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n);
}

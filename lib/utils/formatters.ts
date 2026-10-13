/**
 * Utility functions for formatting data
 */

/**
 * Format price to currency string
 * @param price - Price as string or number
 * @param currency - Currency code (default: INR)
 */
export function formatPrice(
  price: string | number,
  currency: string = "INR"
): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) return "₹0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numPrice);
}

/**
 * Format date to readable string
 * @param date - Date string or Date object
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Format date with time
 * @param date - Date string or Date object
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Generate slug from text
 * @param text - Text to convert to slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

/**
 * Calculate discount percentage
 * @param regularPrice - Original price
 * @param salePrice - Sale price
 */
export function calculateDiscount(
  regularPrice: string | number,
  salePrice: string | number
): number {
  const regular =
    typeof regularPrice === "string" ? parseFloat(regularPrice) : regularPrice;
  const sale = typeof salePrice === "string" ? parseFloat(salePrice) : salePrice;

  if (regular <= 0 || sale >= regular) return 0;

  return Math.round(((regular - sale) / regular) * 100);
}

/**
 * Sanitize image URL to prevent local SSL errors
 */
export function getImageUrl(src?: string): string {
  if (!src) return "/placeholder-product.svg";
  return src.replace(/^https:\/\/(localhost|127\.0\.0\.1)/i, "http://localhost");
}

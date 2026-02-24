// Wakalea — Formatting utilities

/**
 * Format price in cents to EUR string: 7500 -> "75,00 €"
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

/**
 * Format duration: 4.5 -> "4,5 h" or 4.0 -> "4 h"
 */
export function formatDuration(hours: number): string {
  const h = Number(hours)
  if (h % 1 === 0) return `${h} h`
  return `${h.toFixed(1).replace('.', ',')} h`
}

/**
 * Format rating: 4.8 -> "4,8"
 */
export function formatRating(rating: number): string {
  return Number(rating).toFixed(1).replace('.', ',')
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercent(
  originalCents: number,
  currentCents: number
): number {
  return Math.round(((originalCents - currentCents) / originalCents) * 100)
}

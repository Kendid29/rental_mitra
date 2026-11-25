export const DEFAULT_PLATFORM_COMMISSION_PERCENT = 10;

/**
 * Calculates platform commission from gross transaction amount.
 * Rounds to integer to prevent floating point inaccuracies.
 */
export function calculatePlatformCommission(
  grossAmount: number,
  percent: number = DEFAULT_PLATFORM_COMMISSION_PERCENT
): number {
  if (grossAmount <= 0) return 0;
  return Math.round((grossAmount * percent) / 100);
}

/**
 * Calculates net partner revenue: Gross - Commission - Approved Adjustments.
 */
export function calculateNetPartnerRevenue(
  grossAmount: number,
  commissionAmount: number,
  adjustments: number = 0
): number {
  return Math.max(0, grossAmount - commissionAmount - adjustments);
}

/**
 * Calculates operational net profit: Net Partner Revenue - Operational Expenses.
 */
export function calculateOperatingProfit(
  netRevenue: number,
  operationalExpenses: number
): number {
  return netRevenue - operationalExpenses;
}

/**
 * Validates date ranges for collision detection:
 * Returns true if range A overlaps with range B.
 * Dates are formatted as 'YYYY-MM-DD' or comparable date strings/objects.
 */
export function isDateRangeOverlap(
  startA: string | Date,
  endA: string | Date,
  startB: string | Date,
  endB: string | Date
): boolean {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  // Overlap occurs when sA <= eB and eA >= sB
  return sA <= eB && eA >= sB;
}

/**
 * Calculates duration in days between two YYYY-MM-DD dates inclusive.
 */
export function calculateDurationDays(
  startDate: string,
  endDate: string
): number {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Format currency with Indian numbering system (Lakhs, Crores)
 */
export function formatCurrency(
  amount: number,
  options?: {
    showDecimal?: boolean;
    compact?: boolean;
    showRupeeSymbol?: boolean;
  }
): string {
  const { showDecimal = false, compact = false, showRupeeSymbol = true } = options || {};
  
  const prefix = showRupeeSymbol ? '₹' : '';
  
  if (amount < 0) {
    return `-${formatCurrency(Math.abs(amount), options)}`;
  }
  
  if (compact) {
    if (amount >= 10000000) {
      return `${prefix}${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `${prefix}${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
      return `${prefix}${(amount / 1000).toFixed(1)}K`;
    }
  }
  
  // Indian numbering system (lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: showDecimal ? 2 : 0,
    minimumFractionDigits: 0
  });
  
  return `${prefix}${formatter.format(amount)}`;
}

/**
 * Format large currency values for display (₹ 10L, ₹ 1.5 Cr)
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Parse currency string to number (handles ₹, commas, L, Cr shortcuts)
 */
export function parseCurrency(value: string): number {
  if (!value || typeof value !== 'string') return 0;
  
  // Remove ₹, commas, spaces
  let cleaned = value.replace(/[₹,\s]/g, '').trim();
  
  // Handle L/Lakh, Cr/Crore shortcuts
  if (/[\d.]+\s*[Ll](akh)?s?$/i.test(cleaned)) {
    return parseFloat(cleaned.replace(/[Ll](akh)?s?$/i, '')) * 100000;
  }
  if (/[\d.]+\s*[Cc][Rr]?(ore)?s?$/i.test(cleaned)) {
    return parseFloat(cleaned.replace(/[Cc][Rr]?(ore)?s?$/i, '')) * 10000000;
  }
  if (/[\d.]+\s*[Kk]$/i.test(cleaned)) {
    return parseFloat(cleaned.replace(/[Kk]$/i, '')) * 1000;
  }
  
  return parseFloat(cleaned) || 0;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with Indian numbering
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
}




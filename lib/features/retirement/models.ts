/**
 * Retirement Calculator Data Models
 * Matching the Dart/Flutter structure exactly
 */

export interface RetirementInputs {
  presentAge: number;              // Current age
  retireAge: number;               // Target retirement age  
  lifeExpectancy: number;          // Expected life span
  monthlyExpenseToday: number;     // Current monthly expenses
  inflationPercent: number;        // Pre-retirement inflation rate
  postRetInflationPercent: number; // Post-retirement inflation
  preRetReturnPercent: number;     // Expected returns before retirement
  existingAmount: number;          // Current retirement savings
  existingReturnPercent: number;   // Return on existing investments
  postRetReturnPercent: number;    // Post-retirement return rate
  stepUpPerYear: number;          // Absolute ₹ SIP increase/year
  stepUpPercent: number;           // % SIP increase/year
}

export interface RetirementResult {
  yearsToRetire: number;           // Years until retirement
  monthlyExpenseAtRet: number;     // Inflated monthly expense at retirement
  corpusNeeded: number;            // Total retirement corpus required
  fvExisting: number;              // Future value of existing investments
  shortfall: number;               // Gap between needed and existing
  monthlyRequired: number;          // Monthly SIP needed
  yearlyRequired: number;           // Yearly SIP needed
  lumpSumNow: number;              // One-time lumpsum alternative
}

export function retirementResultToJson(result: RetirementResult): Record<string, any> {
  return {
    yearsToRetire: result.yearsToRetire,
    monthlyExpenseAtRet: result.monthlyExpenseAtRet,
    corpusNeeded: result.corpusNeeded,
    fvExisting: result.fvExisting,
    shortfall: result.shortfall,
    monthlyRequired: result.monthlyRequired,
    yearlyRequired: result.yearlyRequired,
    lumpSumNow: result.lumpSumNow,
  };
}

export function retirementResultFromJson(json: Record<string, any>): RetirementResult {
  return {
    yearsToRetire: json.yearsToRetire || 0,
    monthlyExpenseAtRet: json.monthlyExpenseAtRet || 0,
    corpusNeeded: json.corpusNeeded || 0,
    fvExisting: json.fvExisting || 0,
    shortfall: json.shortfall || 0,
    monthlyRequired: json.monthlyRequired || 0,
    yearlyRequired: json.yearlyRequired || 0,
    lumpSumNow: json.lumpSumNow || 0,
  };
}




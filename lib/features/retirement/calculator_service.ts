/**
 * Retirement Calculator Service
 * Core math logic matching the Dart/Flutter implementation exactly
 */

import { RetirementInputs, RetirementResult } from './models';

/**
 * Compute retirement calculation
 * Step-by-step formula matching the Dart implementation:
 * 
 * Step 1: Years to retire = retireAge - presentAge
 * Step 2: Years in retirement = lifeExpectancy - retireAge
 * Step 3: Monthly expense at retirement = monthlyExpenseToday × (1 + inflation)^years
 * Step 4: Corpus needed = Present Value of Growing Annuity (monthly compounding)
 * Step 5: FV of existing investments = existingAmount × (1 + return)^years
 * Step 6: Shortfall = corpusNeeded - fvExisting
 * Step 7: Monthly SIP required = FV annuity formula with optional step-up
 * Step 8: Lumpsum now = shortfall / (1 + return)^years
 */
export class RetirementCalculatorService {
  static compute(inputs: RetirementInputs): RetirementResult {
    // Step 1: Years to retire
    const yearsToRetire = inputs.retireAge - inputs.presentAge;
    
    // Step 2: Years in retirement
    const yearsInRetirement = inputs.lifeExpectancy - inputs.retireAge;
    
    // Step 3: Monthly expense at retirement (inflated)
    const monthlyExpenseAtRet = inputs.monthlyExpenseToday * 
      Math.pow(1 + inputs.inflationPercent / 100, yearsToRetire);
    
    // Step 4: Corpus needed using Present Value of Growing Annuity
    // For monthly withdrawals during retirement with inflation
    const monthlyRate = inputs.postRetReturnPercent / 100 / 12;
    const monthlyInflationRate = inputs.postRetInflationPercent / 100 / 12;
    const totalMonths = yearsInRetirement * 12;
    
    let corpusNeeded = 0;
    
    if (monthlyRate === monthlyInflationRate) {
      // If return equals inflation, simple sum
      corpusNeeded = monthlyExpenseAtRet * totalMonths;
    } else {
      // Present value of growing annuity (monthly)
      // PV = PMT × [1 - ((1+g)/(1+r))^n] / (r-g)
      // where g = inflation rate, r = return rate
      const growthFactor = (1 + monthlyInflationRate) / (1 + monthlyRate);
      const numerator = 1 - Math.pow(growthFactor, totalMonths);
      const denominator = monthlyRate - monthlyInflationRate;
      
      if (denominator !== 0) {
        corpusNeeded = monthlyExpenseAtRet * (numerator / denominator);
      } else {
        corpusNeeded = monthlyExpenseAtRet * totalMonths;
      }
    }
    
    // Step 5: FV of existing investments
    const fvExisting = inputs.existingAmount * 
      Math.pow(1 + inputs.existingReturnPercent / 100, yearsToRetire);
    
    // Step 6: Shortfall
    const shortfall = Math.max(0, corpusNeeded - fvExisting);
    
    // Step 7: Monthly SIP required (with step-up support)
    let monthlyRequired = 0;
    
    if (shortfall > 0 && yearsToRetire > 0) {
      if (inputs.stepUpPercent > 0 || inputs.stepUpPerYear > 0) {
        // Calculate with step-up using iterative approach
        monthlyRequired = this.calculateSIPWithStepUp(
          shortfall,
          inputs.preRetReturnPercent,
          yearsToRetire,
          inputs.stepUpPercent,
          inputs.stepUpPerYear
        );
      } else {
        // Standard SIP formula: P = FV / [{(1 + r)^n - 1} / r × (1 + r)]
        const preRetMonthlyRate = inputs.preRetReturnPercent / 100 / 12;
        const totalMonthsPreRet = yearsToRetire * 12;
        const factor = ((Math.pow(1 + preRetMonthlyRate, totalMonthsPreRet) - 1) / preRetMonthlyRate) * 
          (1 + preRetMonthlyRate);
        monthlyRequired = shortfall / factor;
      }
    }
    
    // Step 8: Lumpsum now
    const lumpSumNow = shortfall / Math.pow(1 + inputs.preRetReturnPercent / 100, yearsToRetire);
    
    return {
      yearsToRetire,
      monthlyExpenseAtRet: Math.round(monthlyExpenseAtRet),
      corpusNeeded: Math.round(corpusNeeded),
      fvExisting: Math.round(fvExisting),
      shortfall: Math.round(shortfall),
      monthlyRequired: Math.round(monthlyRequired),
      yearlyRequired: Math.round(monthlyRequired * 12),
      lumpSumNow: Math.round(lumpSumNow),
    };
  }
  
  /**
   * Calculate SIP with step-up (percentage or absolute)
   */
  private static calculateSIPWithStepUp(
    targetCorpus: number,
    annualReturn: number,
    years: number,
    stepUpPercent: number,
    stepUpPerYear: number
  ): number {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = years * 12;
    
    // Use binary search to find the initial SIP amount
    let low = 0;
    let high = targetCorpus;
    let bestSIP = 0;
    const tolerance = 100; // ₹100 tolerance
    
    while (high - low > tolerance) {
      const testSIP = (low + high) / 2;
      const fv = this.calculateSIPFVWithStepUp(testSIP, monthlyRate, totalMonths, stepUpPercent, stepUpPerYear);
      
      if (fv >= targetCorpus) {
        bestSIP = testSIP;
        high = testSIP;
      } else {
        low = testSIP;
      }
    }
    
    return bestSIP;
  }
  
  /**
   * Calculate future value of SIP with step-up
   */
  private static calculateSIPFVWithStepUp(
    initialSIP: number,
    monthlyRate: number,
    totalMonths: number,
    stepUpPercent: number,
    stepUpPerYear: number
  ): number {
    let balance = 0;
    let currentSIP = initialSIP;
    
    for (let month = 1; month <= totalMonths; month++) {
      balance = (balance + currentSIP) * (1 + monthlyRate);
      
      // Apply step-up at the start of each year (month 13, 25, 37, etc.)
      if (month % 12 === 0 && month < totalMonths) {
        if (stepUpPercent > 0) {
          currentSIP *= (1 + stepUpPercent / 100);
        } else if (stepUpPerYear > 0) {
          currentSIP += stepUpPerYear;
        }
      }
    }
    
    return balance;
  }
}


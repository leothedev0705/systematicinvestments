// Financial Calculation Utilities

/**
 * Calculate Future Value of SIP
 * FV = P × [{(1 + r)^n - 1} / r] × (1 + r)
 */
export function calculateSIPFutureValue(
  monthlyInvestment: number,
  annualReturn: number,
  years: number,
  annualStepUp: number = 0
): { futureValue: number; totalInvested: number; wealthGained: number; yearlyBreakdown: YearlyBreakdown[] } {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  let futureValue = 0;
  let totalInvested = 0;
  let currentSIP = monthlyInvestment;
  const yearlyBreakdown: YearlyBreakdown[] = [];

  for (let year = 1; year <= years; year++) {
    let yearlyInvestment = 0;
    let yearStartValue = futureValue;

    for (let month = 1; month <= 12; month++) {
      futureValue = (futureValue + currentSIP) * (1 + monthlyRate);
      yearlyInvestment += currentSIP;
    }

    totalInvested += yearlyInvestment;
    yearlyBreakdown.push({
      year,
      invested: totalInvested,
      value: Math.round(futureValue),
      returns: Math.round(futureValue - totalInvested),
      sipAmount: Math.round(currentSIP),
    });

    // Apply step-up for next year
    if (annualStepUp > 0) {
      currentSIP *= (1 + annualStepUp / 100);
    }
  }

  return {
    futureValue: Math.round(futureValue),
    totalInvested: Math.round(totalInvested),
    wealthGained: Math.round(futureValue - totalInvested),
    yearlyBreakdown,
  };
}

/**
 * Calculate SIP required for target corpus
 */
export function calculateRequiredSIP(
  targetCorpus: number,
  annualReturn: number,
  years: number
): number {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  // P = FV / [{(1 + r)^n - 1} / r × (1 + r)]
  const factor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(targetCorpus / factor);
}

/**
 * Calculate Lumpsum Future Value
 * FV = PV × (1 + r)^n
 */
export function calculateLumpsumFV(
  principal: number,
  annualReturn: number,
  years: number
): number {
  return Math.round(principal * Math.pow(1 + annualReturn / 100, years));
}

/**
 * Calculate Present Value
 * PV = FV / (1 + r)^n
 */
export function calculatePresentValue(
  futureValue: number,
  annualReturn: number,
  years: number
): number {
  return Math.round(futureValue / Math.pow(1 + annualReturn / 100, years));
}

/**
 * Calculate EMI
 * EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

/**
 * Calculate SWP (Systematic Withdrawal Plan)
 */
export function calculateSWP(
  corpus: number,
  monthlyWithdrawal: number,
  annualReturn: number,
  inflationAdjustment: number = 0
): { monthsLasting: number; totalWithdrawn: number; monthlyBreakdown: SWPBreakdown[] } {
  const monthlyRate = annualReturn / 100 / 12;
  let remainingCorpus = corpus;
  let currentWithdrawal = monthlyWithdrawal;
  let totalWithdrawn = 0;
  let months = 0;
  const monthlyBreakdown: SWPBreakdown[] = [];
  const maxMonths = 600; // 50 years cap

  while (remainingCorpus > 0 && months < maxMonths) {
    // Apply returns first
    remainingCorpus *= (1 + monthlyRate);
    
    // Withdraw
    const actualWithdrawal = Math.min(currentWithdrawal, remainingCorpus);
    remainingCorpus -= actualWithdrawal;
    totalWithdrawn += actualWithdrawal;
    months++;

    if (months % 12 === 0 || remainingCorpus <= 0 || months <= 12) {
      monthlyBreakdown.push({
        month: months,
        withdrawal: Math.round(actualWithdrawal),
        remainingCorpus: Math.round(remainingCorpus),
        totalWithdrawn: Math.round(totalWithdrawn),
      });
    }

    // Apply inflation adjustment annually
    if (inflationAdjustment > 0 && months % 12 === 0) {
      currentWithdrawal *= (1 + inflationAdjustment / 100);
    }
  }

  return {
    monthsLasting: months,
    totalWithdrawn: Math.round(totalWithdrawn),
    monthlyBreakdown,
  };
}

/**
 * Calculate Retirement Corpus
 */
export function calculateRetirementCorpus(
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  inflationRate: number,
  postRetirementReturn: number,
  lifeExpectancy: number
): {
  requiredCorpus: number;
  monthlyExpensesAtRetirement: number;
  yearsInRetirement: number;
  yearlyProjection: RetirementProjection[];
} {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Future monthly expenses at retirement
  const monthlyExpensesAtRetirement = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const annualExpensesAtRetirement = monthlyExpensesAtRetirement * 12;
  
  // Calculate corpus needed using present value of annuity formula
  // Adjusted for inflation during retirement
  const realReturn = ((1 + postRetirementReturn / 100) / (1 + inflationRate / 100)) - 1;
  let requiredCorpus = 0;
  
  if (realReturn > 0) {
    requiredCorpus = annualExpensesAtRetirement * 
      ((1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn);
  } else {
    requiredCorpus = annualExpensesAtRetirement * yearsInRetirement;
  }

  // Generate yearly projection
  const yearlyProjection: RetirementProjection[] = [];
  let corpus = requiredCorpus;
  let annualExpense = annualExpensesAtRetirement;

  for (let year = 0; year <= yearsInRetirement; year++) {
    yearlyProjection.push({
      year: retirementAge + year,
      corpus: Math.round(corpus),
      annualExpense: Math.round(annualExpense),
      withdrawal: year === 0 ? 0 : Math.round(annualExpense),
    });
    
    if (year < yearsInRetirement) {
      corpus = (corpus - annualExpense) * (1 + postRetirementReturn / 100);
      annualExpense *= (1 + inflationRate / 100);
    }
  }

  return {
    requiredCorpus: Math.round(requiredCorpus),
    monthlyExpensesAtRetirement: Math.round(monthlyExpensesAtRetirement),
    yearsInRetirement,
    yearlyProjection,
  };
}

/**
 * Calculate Education Fund
 */
export function calculateEducationFund(
  childAge: number,
  educationStartAge: number,
  currentCost: number,
  educationInflation: number,
  expectedReturn: number,
  educationDuration: number = 4
): {
  futureCost: number;
  monthlyRequired: number;
  lumpsumRequired: number;
  yearlyMilestones: EducationMilestone[];
} {
  const yearsToEducation = educationStartAge - childAge;
  
  // Calculate total future cost including inflation during education years
  let totalFutureCost = 0;
  for (let year = 0; year < educationDuration; year++) {
    const yearCost = currentCost * Math.pow(1 + educationInflation / 100, yearsToEducation + year);
    totalFutureCost += yearCost;
  }

  // Calculate required SIP
  const monthlyRequired = calculateRequiredSIP(totalFutureCost, expectedReturn, yearsToEducation);
  
  // Calculate lumpsum required today
  const lumpsumRequired = calculatePresentValue(totalFutureCost, expectedReturn, yearsToEducation);

  // Generate yearly milestones
  const yearlyMilestones: EducationMilestone[] = [];
  let accumulated = 0;
  
  for (let year = 1; year <= yearsToEducation; year++) {
    const sipResult = calculateSIPFutureValue(monthlyRequired, expectedReturn, year);
    accumulated = sipResult.futureValue;
    
    yearlyMilestones.push({
      year,
      childAge: childAge + year,
      accumulated: Math.round(accumulated),
      target: Math.round(totalFutureCost * (year / yearsToEducation)),
    });
  }

  return {
    futureCost: Math.round(totalFutureCost),
    monthlyRequired,
    lumpsumRequired,
    yearlyMilestones,
  };
}

/**
 * Calculate SIP Delay Cost
 */
export function calculateSIPDelayCost(
  monthlySIP: number,
  investmentPeriod: number,
  delayMonths: number,
  annualReturn: number
): {
  withoutDelay: number;
  withDelay: number;
  costOfDelay: number;
  extraSIPNeeded: number;
  delayScenarios: DelayScenario[];
} {
  const withoutDelay = calculateSIPFutureValue(monthlySIP, annualReturn, investmentPeriod).futureValue;
  const reducedPeriod = investmentPeriod - (delayMonths / 12);
  const withDelay = calculateSIPFutureValue(monthlySIP, annualReturn, reducedPeriod).futureValue;
  const costOfDelay = withoutDelay - withDelay;
  
  // Calculate extra SIP needed to recover
  const extraSIPNeeded = calculateRequiredSIP(withoutDelay, annualReturn, reducedPeriod) - monthlySIP;

  // Generate delay scenarios
  const delayScenarios: DelayScenario[] = [];
  const delayOptions = [0, 6, 12, 24, 36, 60];
  
  for (const delay of delayOptions) {
    const period = investmentPeriod - (delay / 12);
    if (period > 0) {
      const fv = calculateSIPFutureValue(monthlySIP, annualReturn, period).futureValue;
      const extraNeeded = delay === 0 ? 0 : calculateRequiredSIP(withoutDelay, annualReturn, period) - monthlySIP;
      
      delayScenarios.push({
        delayMonths: delay,
        finalValue: fv,
        loss: withoutDelay - fv,
        extraSIPNeeded: Math.max(0, extraNeeded),
      });
    }
  }

  return {
    withoutDelay,
    withDelay,
    costOfDelay,
    extraSIPNeeded: Math.max(0, extraSIPNeeded),
    delayScenarios,
  };
}

/**
 * Calculate Risk Profile Score
 */
export function calculateRiskProfile(answers: RiskAssessmentAnswers): RiskProfileResult {
  let score = 0;
  
  // Age scoring (younger = higher risk capacity)
  if (answers.age < 30) score += 20;
  else if (answers.age < 40) score += 15;
  else if (answers.age < 50) score += 10;
  else if (answers.age < 60) score += 5;
  else score += 2;

  // Investment horizon scoring
  if (answers.investmentHorizon >= 15) score += 20;
  else if (answers.investmentHorizon >= 10) score += 15;
  else if (answers.investmentHorizon >= 5) score += 10;
  else if (answers.investmentHorizon >= 3) score += 5;
  else score += 2;

  // Risk tolerance scoring
  score += answers.riskTolerance * 4; // 1-5 scale × 4 = 4-20

  // Income stability (if provided)
  if (answers.incomeStability) {
    score += answers.incomeStability * 3; // 1-5 scale × 3 = 3-15
  }

  // Investment experience (if provided)
  if (answers.investmentExperience) {
    score += answers.investmentExperience * 3; // 1-5 scale × 3 = 3-15
  }

  // Financial dependents (more dependents = lower risk)
  if (answers.financialDependents !== undefined) {
    if (answers.financialDependents === 0) score += 10;
    else if (answers.financialDependents <= 2) score += 5;
    else score += 0;
  }

  // Normalize to 0-100
  const maxScore = 100;
  const normalizedScore = Math.min(100, Math.round((score / maxScore) * 100));

  // Determine profile
  let profile: RiskProfile;
  let allocation: AssetAllocation;

  if (normalizedScore >= 80) {
    profile = {
      category: "Aggressive",
      description: "You have a high risk tolerance and long investment horizon. You can withstand significant short-term volatility for potentially higher long-term returns.",
      color: "#EF4444",
    };
    allocation = { equity: 80, debt: 15, gold: 5 };
  } else if (normalizedScore >= 60) {
    profile = {
      category: "Moderately Aggressive",
      description: "You are comfortable with moderate to high risk. Your portfolio can have significant equity exposure with some stability from debt.",
      color: "#F97316",
    };
    allocation = { equity: 65, debt: 25, gold: 10 };
  } else if (normalizedScore >= 40) {
    profile = {
      category: "Moderate",
      description: "You prefer a balanced approach with moderate risk. A mix of equity and debt suits your profile.",
      color: "#EAB308",
    };
    allocation = { equity: 50, debt: 40, gold: 10 };
  } else if (normalizedScore >= 20) {
    profile = {
      category: "Conservative",
      description: "You prefer stability over growth. Your portfolio should be debt-heavy with limited equity exposure.",
      color: "#22C55E",
    };
    allocation = { equity: 30, debt: 60, gold: 10 };
  } else {
    profile = {
      category: "Very Conservative",
      description: "Capital preservation is your priority. Focus on fixed income instruments with minimal equity.",
      color: "#3B82F6",
    };
    allocation = { equity: 15, debt: 75, gold: 10 };
  }

  return {
    score: normalizedScore,
    profile,
    allocation,
    suggestedProducts: getSuggestedProducts(profile.category),
  };
}

function getSuggestedProducts(category: string): string[] {
  const products: Record<string, string[]> = {
    "Aggressive": ["Small Cap Funds", "Mid Cap Funds", "Sectoral Funds", "Direct Equity", "ELSS"],
    "Moderately Aggressive": ["Flexi Cap Funds", "Large & Mid Cap", "Multi Cap Funds", "Balanced Advantage", "ELSS"],
    "Moderate": ["Large Cap Funds", "Hybrid Funds", "Index Funds", "Corporate Bonds", "ELSS"],
    "Conservative": ["Debt Funds", "Gilt Funds", "FDs", "PPF", "Senior Citizen Savings"],
    "Very Conservative": ["Liquid Funds", "Ultra Short Duration", "Bank FDs", "Post Office Schemes", "RBI Bonds"],
  };
  return products[category] || [];
}

/**
 * Calculate Vacation Fund
 */
export function calculateVacationFund(
  targetBudget: number,
  monthsToSave: number,
  expectedReturn: number,
  inflationRate: number = 0,
  existingFund: number = 0
): {
  futureTarget: number;
  monthlyRequired: number;
  progressData: VacationProgress[];
} {
  const years = monthsToSave / 12;
  const futureTarget = targetBudget * Math.pow(1 + inflationRate / 100, years);
  const netTarget = futureTarget - calculateLumpsumFV(existingFund, expectedReturn, years);
  
  const monthlyRate = expectedReturn / 100 / 12;
  // Calculate monthly savings needed
  const factor = ((Math.pow(1 + monthlyRate, monthsToSave) - 1) / monthlyRate) * (1 + monthlyRate);
  const monthlyRequired = Math.max(0, Math.round(netTarget / factor));

  // Generate progress data
  const progressData: VacationProgress[] = [];
  let accumulated = existingFund;
  
  for (let month = 0; month <= monthsToSave; month += Math.max(1, Math.floor(monthsToSave / 12))) {
    if (month === 0) {
      accumulated = existingFund;
    } else {
      const sipResult = calculateSIPFutureValue(monthlyRequired, expectedReturn, month / 12);
      accumulated = sipResult.futureValue + calculateLumpsumFV(existingFund, expectedReturn, month / 12);
    }
    
    progressData.push({
      month,
      saved: Math.round(accumulated),
      target: Math.round(futureTarget),
      percentage: Math.round((accumulated / futureTarget) * 100),
    });
  }

  return {
    futureTarget: Math.round(futureTarget),
    monthlyRequired,
    progressData,
  };
}

/**
 * Calculate Travel Budget
 */
export function calculateTravelBudget(
  destination: "domestic" | "international",
  travelers: number,
  duration: number,
  itemizedCosts: TravelCosts,
  monthsUntilTrip: number,
  savingsReturn: number
): {
  totalCost: number;
  perPersonCost: number;
  monthlyRequired: number;
  costBreakdown: CostBreakdownItem[];
} {
  const { flights, hotels, food, activities, visa, insurance, miscellaneous } = itemizedCosts;
  
  const totalCost = flights + hotels + (food * duration) + activities + 
                    (destination === "international" ? visa + insurance : 0) + miscellaneous;
  
  const perPersonCost = Math.round(totalCost / travelers);
  
  // Calculate monthly savings needed
  const monthlyRate = savingsReturn / 100 / 12;
  const factor = ((Math.pow(1 + monthlyRate, monthsUntilTrip) - 1) / monthlyRate) * (1 + monthlyRate);
  const monthlyRequired = Math.round(totalCost / factor);

  const costBreakdown: CostBreakdownItem[] = [
    { category: "Flights", amount: flights, percentage: Math.round((flights / totalCost) * 100) },
    { category: "Hotels", amount: hotels, percentage: Math.round((hotels / totalCost) * 100) },
    { category: "Food", amount: food * duration, percentage: Math.round(((food * duration) / totalCost) * 100) },
    { category: "Activities", amount: activities, percentage: Math.round((activities / totalCost) * 100) },
  ];

  if (destination === "international") {
    costBreakdown.push(
      { category: "Visa", amount: visa, percentage: Math.round((visa / totalCost) * 100) },
      { category: "Insurance", amount: insurance, percentage: Math.round((insurance / totalCost) * 100) }
    );
  }

  costBreakdown.push(
    { category: "Miscellaneous", amount: miscellaneous, percentage: Math.round((miscellaneous / totalCost) * 100) }
  );

  return {
    totalCost,
    perPersonCost,
    monthlyRequired,
    costBreakdown,
  };
}

// Type definitions
export interface YearlyBreakdown {
  year: number;
  invested: number;
  value: number;
  returns: number;
  sipAmount: number;
}

export interface SWPBreakdown {
  month: number;
  withdrawal: number;
  remainingCorpus: number;
  totalWithdrawn: number;
}

export interface RetirementProjection {
  year: number;
  corpus: number;
  annualExpense: number;
  withdrawal: number;
}

export interface EducationMilestone {
  year: number;
  childAge: number;
  accumulated: number;
  target: number;
}

export interface DelayScenario {
  delayMonths: number;
  finalValue: number;
  loss: number;
  extraSIPNeeded: number;
}

export interface RiskAssessmentAnswers {
  age: number;
  investmentHorizon: number;
  riskTolerance: number; // 1-5
  incomeStability?: number; // 1-5
  investmentExperience?: number; // 1-5
  financialDependents?: number;
}

export interface RiskProfile {
  category: string;
  description: string;
  color: string;
}

export interface AssetAllocation {
  equity: number;
  debt: number;
  gold: number;
}

export interface RiskProfileResult {
  score: number;
  profile: RiskProfile;
  allocation: AssetAllocation;
  suggestedProducts: string[];
}

export interface VacationProgress {
  month: number;
  saved: number;
  target: number;
  percentage: number;
}

export interface TravelCosts {
  flights: number;
  hotels: number;
  food: number;
  activities: number;
  visa: number;
  insurance: number;
  miscellaneous: number;
}

export interface CostBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

// Utility function to format currency
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString("en-IN");
}


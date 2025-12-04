export interface RiskQuestionOption {
  label: string;
  value: string;
  score: number;
}

export interface RiskQuestion {
  id: number;
  category: string;
  question: string;
  type: 'slider' | 'radio' | 'checkbox';
  options?: RiskQuestionOption[];
  min?: number;
  max?: number;
  default?: number;
  unit?: string;
  weight: number;
  scoringMethod?: 'sum';
}

export const riskQuestions: RiskQuestion[] = [
  {
    id: 1,
    category: "Personal Information",
    question: "What is your current age?",
    type: "slider",
    min: 18,
    max: 80,
    default: 30,
    unit: "years",
    weight: 15,
  },
  {
    id: 2,
    category: "Personal Information",
    question: "What is your current employment status?",
    type: "radio",
    options: [
      { label: "Salaried - Government/PSU", value: "govt", score: 8 },
      { label: "Salaried - Private Sector (MNC/Large Company)", value: "private_large", score: 7 },
      { label: "Salaried - Private Sector (Small/Medium Company)", value: "private_small", score: 5 },
      { label: "Self-Employed / Business Owner", value: "self_employed", score: 6 },
      { label: "Professional (Doctor/Lawyer/CA etc.)", value: "professional", score: 7 },
      { label: "Retired", value: "retired", score: 3 },
      { label: "Homemaker", value: "homemaker", score: 2 },
      { label: "Student", value: "student", score: 4 }
    ],
    weight: 10
  },
  {
    id: 3,
    category: "Personal Information",
    question: "How many people are financially dependent on you?",
    type: "radio",
    options: [
      { label: "None", value: "0", score: 10 },
      { label: "1-2 dependents", value: "1-2", score: 7 },
      { label: "3-4 dependents", value: "3-4", score: 4 },
      { label: "More than 4 dependents", value: "4+", score: 2 }
    ],
    weight: 10
  },
  {
    id: 4,
    category: "Financial Situation",
    question: "What is your approximate annual income?",
    type: "radio",
    options: [
      { label: "Less than ₹5 Lakhs", value: "<5L", score: 3 },
      { label: "₹5 Lakhs - ₹10 Lakhs", value: "5-10L", score: 5 },
      { label: "₹10 Lakhs - ₹25 Lakhs", value: "10-25L", score: 7 },
      { label: "₹25 Lakhs - ₹50 Lakhs", value: "25-50L", score: 8 },
      { label: "₹50 Lakhs - ₹1 Crore", value: "50L-1Cr", score: 9 },
      { label: "More than ₹1 Crore", value: ">1Cr", score: 10 }
    ],
    weight: 8
  },
  {
    id: 5,
    category: "Financial Situation",
    question: "What percentage of your monthly income can you save/invest?",
    type: "radio",
    options: [
      { label: "Less than 10%", value: "<10", score: 2 },
      { label: "10% - 20%", value: "10-20", score: 4 },
      { label: "20% - 30%", value: "20-30", score: 6 },
      { label: "30% - 50%", value: "30-50", score: 8 },
      { label: "More than 50%", value: ">50", score: 10 }
    ],
    weight: 8
  },
  {
    id: 6,
    category: "Financial Situation",
    question: "How many months of expenses do you have as emergency fund?",
    type: "radio",
    options: [
      { label: "No emergency fund", value: "0", score: 1 },
      { label: "Less than 3 months", value: "<3", score: 3 },
      { label: "3-6 months", value: "3-6", score: 6 },
      { label: "6-12 months", value: "6-12", score: 8 },
      { label: "More than 12 months", value: ">12", score: 10 }
    ],
    weight: 10
  },
  {
    id: 7,
    category: "Financial Situation",
    question: "Do you have any outstanding loans/liabilities?",
    type: "radio",
    options: [
      { label: "No loans", value: "none", score: 10 },
      { label: "Only home loan", value: "home", score: 7 },
      { label: "Home loan + Car loan", value: "home_car", score: 5 },
      { label: "Multiple loans including personal/credit card", value: "multiple", score: 2 },
      { label: "High debt (EMIs > 50% of income)", value: "high", score: 1 }
    ],
    weight: 8
  },
  {
    id: 8,
    category: "Financial Situation",
    question: "Do you have adequate life and health insurance coverage?",
    type: "radio",
    options: [
      { label: "Yes, comprehensive coverage for self and family", value: "full", score: 10 },
      { label: "Yes, but only basic coverage", value: "basic", score: 6 },
      { label: "Only employer-provided insurance", value: "employer", score: 4 },
      { label: "No insurance coverage", value: "none", score: 1 }
    ],
    weight: 7
  },
  {
    id: 9,
    category: "Investment Experience",
    question: "How would you describe your investment knowledge?",
    type: "radio",
    options: [
      { label: "Beginner - I'm new to investing", value: "beginner", score: 2 },
      { label: "Basic - I understand FDs, savings accounts", value: "basic", score: 4 },
      { label: "Intermediate - I know about mutual funds, stocks", value: "intermediate", score: 6 },
      { label: "Advanced - I actively manage my portfolio", value: "advanced", score: 8 },
      { label: "Expert - I understand derivatives, options, etc.", value: "expert", score: 10 }
    ],
    weight: 6
  },
  {
    id: 10,
    category: "Investment Experience",
    question: "How long have you been investing (excluding FDs/savings)?",
    type: "radio",
    options: [
      { label: "Never invested", value: "never", score: 1 },
      { label: "Less than 1 year", value: "<1", score: 3 },
      { label: "1-3 years", value: "1-3", score: 5 },
      { label: "3-5 years", value: "3-5", score: 7 },
      { label: "5-10 years", value: "5-10", score: 8 },
      { label: "More than 10 years", value: ">10", score: 10 }
    ],
    weight: 6
  },
  {
    id: 11,
    category: "Investment Experience",
    question: "Which investment products have you used? (Select all that apply)",
    type: "checkbox",
    options: [
      { label: "Fixed Deposits", value: "fd", score: 1 },
      { label: "PPF/EPF", value: "ppf", score: 1 },
      { label: "Mutual Funds - Debt", value: "mf_debt", score: 2 },
      { label: "Mutual Funds - Equity", value: "mf_equity", score: 3 },
      { label: "Direct Stocks", value: "stocks", score: 4 },
      { label: "Gold/Silver", value: "gold", score: 2 },
      { label: "Real Estate", value: "realestate", score: 3 },
      { label: "NPS", value: "nps", score: 2 },
      { label: "Cryptocurrency", value: "crypto", score: 5 },
      { label: "F&O / Derivatives", value: "derivatives", score: 5 }
    ],
    weight: 5,
    scoringMethod: "sum"
  },
  {
    id: 12,
    category: "Risk Behavior",
    question: "Imagine your investment portfolio drops by 20% in one month. What would you do?",
    type: "radio",
    options: [
      { label: "Sell everything immediately to prevent further losses", value: "sell_all", score: 1 },
      { label: "Sell some investments to reduce risk", value: "sell_some", score: 3 },
      { label: "Do nothing and wait for recovery", value: "hold", score: 6 },
      { label: "Invest more to take advantage of lower prices", value: "buy_more", score: 10 }
    ],
    weight: 12
  },
  {
    id: 13,
    category: "Risk Behavior",
    question: "When making investment decisions, what matters most to you?",
    type: "radio",
    options: [
      { label: "Safety of capital - I cannot afford to lose money", value: "safety", score: 2 },
      { label: "Stable returns with minimal fluctuation", value: "stable", score: 4 },
      { label: "Balance between growth and safety", value: "balanced", score: 6 },
      { label: "Higher returns even if it means some volatility", value: "growth", score: 8 },
      { label: "Maximum returns - I can handle high volatility", value: "aggressive", score: 10 }
    ],
    weight: 10
  },
  {
    id: 14,
    category: "Risk Behavior",
    question: "How would you feel if your investment value fluctuates frequently?",
    type: "radio",
    options: [
      { label: "Very uncomfortable - I check daily and worry", value: "very_uncomfortable", score: 1 },
      { label: "Somewhat uncomfortable - I prefer stability", value: "uncomfortable", score: 3 },
      { label: "Neutral - I understand it's part of investing", value: "neutral", score: 6 },
      { label: "Comfortable - Short-term fluctuations don't bother me", value: "comfortable", score: 8 },
      { label: "Very comfortable - I focus only on long-term", value: "very_comfortable", score: 10 }
    ],
    weight: 8
  },
  {
    id: 15,
    category: "Risk Behavior",
    question: "You have ₹10 Lakhs to invest. Which option would you choose?",
    type: "radio",
    options: [
      { label: "100% in FD - Guaranteed 7% return", value: "fd_100", score: 1 },
      { label: "70% FD + 30% Mutual Funds - Expected 9% return", value: "fd_70_mf_30", score: 4 },
      { label: "50% FD + 50% Mutual Funds - Expected 11% return", value: "fd_50_mf_50", score: 6 },
      { label: "30% FD + 70% Equity - Expected 13% return", value: "fd_30_eq_70", score: 8 },
      { label: "100% Equity - Expected 15%+ return", value: "eq_100", score: 10 }
    ],
    weight: 10
  },
  {
    id: 16,
    category: "Investment Goals",
    question: "What is your primary investment goal?",
    type: "radio",
    options: [
      { label: "Capital preservation - Protect my money", value: "preserve", score: 2 },
      { label: "Regular income - Generate steady returns", value: "income", score: 4 },
      { label: "Balanced growth - Steady appreciation", value: "balanced", score: 6 },
      { label: "Wealth accumulation - Grow money significantly", value: "growth", score: 8 },
      { label: "Aggressive growth - Maximize returns", value: "aggressive", score: 10 }
    ],
    weight: 8
  },
  {
    id: 17,
    category: "Investment Goals",
    question: "What is your investment time horizon for this goal?",
    type: "radio",
    options: [
      { label: "Less than 1 year", value: "<1", score: 1 },
      { label: "1-3 years", value: "1-3", score: 3 },
      { label: "3-5 years", value: "3-5", score: 5 },
      { label: "5-10 years", value: "5-10", score: 8 },
      { label: "More than 10 years", value: ">10", score: 10 }
    ],
    weight: 12
  },
  {
    id: 18,
    category: "Investment Goals",
    question: "How important is liquidity (easy access to money) for you?",
    type: "radio",
    options: [
      { label: "Very important - May need money anytime", value: "very_high", score: 2 },
      { label: "Important - Want reasonable access", value: "high", score: 4 },
      { label: "Moderate - Can wait a few months if needed", value: "moderate", score: 6 },
      { label: "Low - Can lock money for years", value: "low", score: 8 },
      { label: "Not important - Long-term is priority", value: "not_important", score: 10 }
    ],
    weight: 6
  },
  {
    id: 19,
    category: "Past Experience",
    question: "Have you ever experienced significant investment loss?",
    type: "radio",
    options: [
      { label: "Yes, and I exited the market completely", value: "exit", score: 1 },
      { label: "Yes, and it took me long to reinvest", value: "slow_recovery", score: 3 },
      { label: "Yes, but I continued investing", value: "continued", score: 7 },
      { label: "Yes, and I invested more during the downturn", value: "increased", score: 10 },
      { label: "No significant losses experienced", value: "no_loss", score: 5 }
    ],
    weight: 6
  },
  {
    id: 20,
    category: "Final Assessment",
    question: "Overall, how would you describe your risk appetite?",
    type: "radio",
    options: [
      { label: "Very Conservative - Safety is my priority", value: "very_conservative", score: 1 },
      { label: "Conservative - Prefer stability with some growth", value: "conservative", score: 3 },
      { label: "Moderate - Balanced approach", value: "moderate", score: 5 },
      { label: "Aggressive - Willing to take calculated risks", value: "aggressive", score: 8 },
      { label: "Very Aggressive - High risk for high returns", value: "very_aggressive", score: 10 }
    ],
    weight: 5
  }
];

// Risk profile definitions
export const riskProfiles = {
  veryConservative: {
    name: 'Very Conservative',
    description: 'You prioritize safety over returns. Capital preservation is your primary goal. You prefer guaranteed returns and cannot tolerate any loss of principal.',
    allocation: { equity: 10, debt: 70, gold: 10, cash: 10 },
    color: '#3B82F6', // Blue
    recommendations: [
      'Fixed Deposits & RDs',
      'Government Bonds',
      'Liquid Funds',
      'PPF/NSC',
      'Post Office Schemes'
    ],
    products: ['FDs', 'PPF', 'Govt Bonds', 'Liquid Funds']
  },
  conservative: {
    name: 'Conservative',
    description: 'You prefer stability with modest growth. While you want some appreciation, you are not comfortable with significant fluctuations in your portfolio value.',
    allocation: { equity: 25, debt: 55, gold: 10, cash: 10 },
    color: '#22C55E', // Green
    recommendations: [
      'Debt Mutual Funds',
      'Gilt Funds',
      'Fixed Deposits',
      'PPF',
      'Senior Citizen Savings'
    ],
    products: ['Debt Funds', 'Gilt Funds', 'FDs', 'PPF', 'Senior Citizen Savings']
  },
  moderate: {
    name: 'Moderate',
    description: 'You seek a balance between growth and safety. You can tolerate moderate fluctuations for potentially better returns over the long term.',
    allocation: { equity: 45, debt: 40, gold: 10, cash: 5 },
    color: '#EAB308', // Yellow
    recommendations: [
      'Balanced/Hybrid Funds',
      'Large Cap Equity Funds',
      'Index Funds',
      'Debt Funds',
      'Gold ETFs'
    ],
    products: ['Balanced Funds', 'Large Cap Funds', 'Index Funds', 'Debt Funds']
  },
  moderatelyAggressive: {
    name: 'Moderately Aggressive',
    description: 'You are growth-oriented and comfortable with market volatility. You understand that short-term losses are part of wealth creation journey.',
    allocation: { equity: 60, debt: 25, gold: 10, cash: 5 },
    color: '#F97316', // Orange
    recommendations: [
      'Flexi Cap Funds',
      'Mid Cap Funds',
      'Large & Mid Cap Funds',
      'Index Funds',
      'Some Debt Allocation'
    ],
    products: ['Flexi Cap', 'Mid Cap Funds', 'Multi Cap Funds', 'Index Funds']
  },
  aggressive: {
    name: 'Aggressive',
    description: 'You are focused on maximizing returns and can handle significant market swings. You have a long-term horizon and view corrections as opportunities.',
    allocation: { equity: 75, debt: 15, gold: 5, cash: 5 },
    color: '#EF4444', // Red
    recommendations: [
      'Small & Mid Cap Funds',
      'Sectoral/Thematic Funds',
      'Direct Stocks',
      'International Funds',
      'Limited Debt Exposure'
    ],
    products: ['Small Cap', 'Mid Cap', 'Sectoral Funds', 'Direct Equity']
  },
  veryAggressive: {
    name: 'Very Aggressive',
    description: 'You are a seasoned investor seeking maximum growth. You are comfortable with high volatility and potential significant short-term losses for long-term wealth creation.',
    allocation: { equity: 85, debt: 5, gold: 5, cash: 5 },
    color: '#DC2626', // Dark Red
    recommendations: [
      'Small Cap Funds',
      'Sectoral/Thematic',
      'Direct Stock Picking',
      'F&O (if experienced)',
      'International/Emerging Markets'
    ],
    products: ['Small Cap', 'Micro Cap', 'Sectoral', 'Direct Stocks', 'F&O']
  }
};

export type RiskProfileType = keyof typeof riskProfiles;


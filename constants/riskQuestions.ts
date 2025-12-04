export interface RiskQuestionOption {
  label: string;
  value: string;
  score: number;
}

export interface RiskQuestion {
  id: number;
  question: string;
  type: 'slider' | 'radio';
  options?: RiskQuestionOption[];
  min?: number;
  max?: number;
  default?: number;
  unit?: string;
  weight: number;
}

export const riskQuestions: RiskQuestion[] = [
  {
    id: 1,
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
    question: "What is your investment time horizon?",
    type: "radio",
    options: [
      { label: "Less than 1 year", value: "<1", score: 1 },
      { label: "1-3 years", value: "1-3", score: 3 },
      { label: "3-5 years", value: "3-5", score: 5 },
      { label: "5-10 years", value: "5-10", score: 8 },
      { label: "More than 10 years", value: ">10", score: 10 }
    ],
    weight: 15
  },
  {
    id: 3,
    question: "How stable is your current income?",
    type: "radio",
    options: [
      { label: "Very unstable / No fixed income", value: "unstable", score: 2 },
      { label: "Somewhat stable", value: "somewhat", score: 5 },
      { label: "Stable with some variability", value: "stable", score: 7 },
      { label: "Very stable / Government job", value: "very_stable", score: 10 }
    ],
    weight: 10
  },
  {
    id: 4,
    question: "How many financial dependents do you have?",
    type: "radio",
    options: [
      { label: "None", value: "0", score: 10 },
      { label: "1-2", value: "1-2", score: 7 },
      { label: "3-4", value: "3-4", score: 4 },
      { label: "More than 4", value: ">4", score: 2 }
    ],
    weight: 10
  },
  {
    id: 5,
    question: "How many months of emergency fund do you have?",
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
    id: 6,
    question: "How would you describe your investment knowledge?",
    type: "radio",
    options: [
      { label: "Beginner - New to investing", value: "beginner", score: 2 },
      { label: "Basic - Know about FDs, savings", value: "basic", score: 4 },
      { label: "Intermediate - Understand mutual funds, stocks", value: "intermediate", score: 6 },
      { label: "Advanced - Actively manage investments", value: "advanced", score: 8 },
      { label: "Expert - Understand derivatives, options", value: "expert", score: 10 }
    ],
    weight: 8
  },
  {
    id: 7,
    question: "If your investment drops 20% in one month, what would you do?",
    type: "radio",
    options: [
      { label: "Sell everything immediately", value: "sell_all", score: 1 },
      { label: "Sell some to reduce risk", value: "sell_some", score: 3 },
      { label: "Do nothing and wait", value: "hold", score: 6 },
      { label: "Invest more at lower prices", value: "buy_more", score: 10 }
    ],
    weight: 12
  },
  {
    id: 8,
    question: "What is your primary investment goal?",
    type: "radio",
    options: [
      { label: "Capital preservation - Protect my money", value: "preserve", score: 2 },
      { label: "Regular income - Steady returns", value: "income", score: 4 },
      { label: "Balanced growth - Mix of safety and growth", value: "balanced", score: 6 },
      { label: "Wealth accumulation - Grow money significantly", value: "growth", score: 8 },
      { label: "Aggressive growth - Maximum returns", value: "aggressive", score: 10 }
    ],
    weight: 10
  },
  {
    id: 9,
    question: "How do you feel about investment value fluctuations?",
    type: "radio",
    options: [
      { label: "Very uncomfortable - I check daily and worry", value: "very_uncomfortable", score: 1 },
      { label: "Uncomfortable - I prefer stability", value: "uncomfortable", score: 3 },
      { label: "Neutral - I understand it's part of investing", value: "neutral", score: 6 },
      { label: "Comfortable - Short-term changes don't bother me", value: "comfortable", score: 8 },
      { label: "Very comfortable - I focus only on long-term", value: "very_comfortable", score: 10 }
    ],
    weight: 10
  },
  {
    id: 10,
    question: "You have ₹10 Lakhs to invest. Which option would you choose?",
    type: "radio",
    options: [
      { label: "100% in FD - Guaranteed 7% return", value: "fd_100", score: 1 },
      { label: "70% FD + 30% Mutual Funds - Expected 9% return", value: "70_30", score: 4 },
      { label: "50% FD + 50% Mutual Funds - Expected 11% return", value: "50_50", score: 6 },
      { label: "30% FD + 70% Equity - Expected 13% return", value: "30_70", score: 8 },
      { label: "100% Equity - Expected 15%+ return", value: "eq_100", score: 10 }
    ],
    weight: 10
  }
];

// Risk profile definitions
export const riskProfiles = {
  veryConservative: {
    name: 'Very Conservative',
    description: 'You prioritize safety over returns. Capital preservation is your primary goal. You prefer guaranteed returns and cannot tolerate any loss of principal.',
    allocation: { equity: 10, debt: 70, gold: 10, cash: 10 },
    color: '#3B82F6',
    products: ['FDs', 'PPF', 'Govt Bonds', 'Liquid Funds']
  },
  conservative: {
    name: 'Conservative',
    description: 'You prefer stability with modest growth. While you want some appreciation, you are not comfortable with significant fluctuations in your portfolio value.',
    allocation: { equity: 25, debt: 55, gold: 10, cash: 10 },
    color: '#22C55E',
    products: ['Debt Funds', 'Gilt Funds', 'FDs', 'PPF', 'Senior Citizen Savings']
  },
  moderate: {
    name: 'Moderate',
    description: 'You seek a balance between growth and safety. You can tolerate moderate fluctuations for potentially better returns over the long term.',
    allocation: { equity: 45, debt: 40, gold: 10, cash: 5 },
    color: '#EAB308',
    products: ['Balanced Funds', 'Large Cap Funds', 'Index Funds', 'Debt Funds']
  },
  moderatelyAggressive: {
    name: 'Moderately Aggressive',
    description: 'You are growth-oriented and comfortable with market volatility. You understand that short-term losses are part of wealth creation journey.',
    allocation: { equity: 60, debt: 25, gold: 10, cash: 5 },
    color: '#F97316',
    products: ['Flexi Cap', 'Mid Cap Funds', 'Multi Cap Funds', 'Index Funds']
  },
  aggressive: {
    name: 'Aggressive',
    description: 'You are focused on maximizing returns and can handle significant market swings. You have a long-term horizon and view corrections as opportunities.',
    allocation: { equity: 75, debt: 15, gold: 5, cash: 5 },
    color: '#EF4444',
    products: ['Small Cap', 'Mid Cap', 'Sectoral Funds', 'Direct Equity']
  },
  veryAggressive: {
    name: 'Very Aggressive',
    description: 'You are a seasoned investor seeking maximum growth. You are comfortable with high volatility and potential significant short-term losses for long-term wealth creation.',
    allocation: { equity: 85, debt: 5, gold: 5, cash: 5 },
    color: '#DC2626',
    products: ['Small Cap', 'Micro Cap', 'Sectoral', 'Direct Stocks', 'F&O']
  }
};

export type RiskProfileType = keyof typeof riskProfiles;

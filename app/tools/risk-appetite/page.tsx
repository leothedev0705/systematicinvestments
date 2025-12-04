"use client";

import React, { useState, useMemo } from "react";
import { Target, Shield, Briefcase, Users, TrendingUp } from "lucide-react";
import {
  CalculatorLayout,
  SliderInput,
  NumberInput,
  SelectInput,
  ViewToggle,
  ResultCard,
} from "@/components/calculators/CalculatorLayout";
import { GaugeChart, PieChart } from "@/components/calculators/Charts";
import { calculateRiskProfile, type RiskAssessmentAnswers } from "@/lib/calculations";
import { motion } from "framer-motion";

const riskToleranceOptions = [
  { value: 1, label: "Very Low - I can't tolerate any loss" },
  { value: 2, label: "Low - I can accept up to 10% loss" },
  { value: 3, label: "Moderate - I can accept up to 20% loss" },
  { value: 4, label: "High - I can accept up to 30% loss" },
  { value: 5, label: "Very High - I can accept 40%+ loss" },
];

const incomeStabilityOptions = [
  { value: 1, label: "Very Unstable - Irregular income" },
  { value: 2, label: "Somewhat Unstable - Freelance/Contract" },
  { value: 3, label: "Moderate - Small business owner" },
  { value: 4, label: "Stable - Salaried employee" },
  { value: 5, label: "Very Stable - Government/PSU job" },
];

const investmentExperienceOptions = [
  { value: 1, label: "Beginner - No experience" },
  { value: 2, label: "Basic - FDs and Savings only" },
  { value: 3, label: "Intermediate - Mutual Funds" },
  { value: 4, label: "Advanced - Direct Equity" },
  { value: 5, label: "Expert - Derivatives/F&O" },
];

const behavioralQuestions = [
  {
    question: "If your investment drops 20% in a month, what would you do?",
    options: [
      { value: 1, label: "Sell everything immediately" },
      { value: 2, label: "Sell half and keep half" },
      { value: 3, label: "Hold and wait" },
      { value: 4, label: "Buy more if fundamentals are strong" },
    ],
  },
  {
    question: "How would you describe your investment goal?",
    options: [
      { value: 1, label: "Preserve capital at all costs" },
      { value: 2, label: "Generate steady income" },
      { value: 3, label: "Balanced growth and income" },
      { value: 4, label: "Maximize long-term growth" },
    ],
  },
  {
    question: "What percentage of your income can you invest monthly?",
    options: [
      { value: 1, label: "Less than 10%" },
      { value: 2, label: "10-20%" },
      { value: 3, label: "20-30%" },
      { value: 4, label: "More than 30%" },
    ],
  },
  {
    question: "How do you react to financial news and market volatility?",
    options: [
      { value: 1, label: "Very anxious, check constantly" },
      { value: 2, label: "Somewhat worried" },
      { value: 3, label: "Aware but not overly concerned" },
      { value: 4, label: "Calm, focused on long-term" },
    ],
  },
  {
    question: "What's your primary financial priority right now?",
    options: [
      { value: 1, label: "Building emergency fund" },
      { value: 2, label: "Paying off debts" },
      { value: 3, label: "Buying a home" },
      { value: 4, label: "Wealth accumulation" },
    ],
  },
];

export default function RiskAppetiteCalculator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Traditional inputs
  const [age, setAge] = useState(30);
  const [investmentHorizon, setInvestmentHorizon] = useState(10);
  const [riskTolerance, setRiskTolerance] = useState(3);
  
  // Advanced inputs
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [existingInvestments, setExistingInvestments] = useState(500000);
  const [financialDependents, setFinancialDependents] = useState(2);
  const [incomeStability, setIncomeStability] = useState(4);
  const [investmentExperience, setInvestmentExperience] = useState(3);
  const [behavioralAnswers, setBehavioralAnswers] = useState<number[]>([3, 3, 2, 3, 4]);

  const results = useMemo(() => {
    const answers: RiskAssessmentAnswers = {
      age,
      investmentHorizon,
      riskTolerance,
    };

    if (isAdvanced) {
      answers.incomeStability = incomeStability;
      answers.investmentExperience = investmentExperience;
      answers.financialDependents = financialDependents;
      
      // Add behavioral question scores
      const behavioralScore = behavioralAnswers.reduce((sum, ans) => sum + ans, 0) / behavioralAnswers.length;
      answers.riskTolerance = Math.round((riskTolerance + behavioralScore) / 2);
    }

    return calculateRiskProfile(answers);
  }, [age, investmentHorizon, riskTolerance, incomeStability, investmentExperience, financialDependents, behavioralAnswers, isAdvanced]);

  const allocationChartData = [
    { label: "Equity", value: results.allocation.equity, color: "#EF4444" },
    { label: "Debt", value: results.allocation.debt, color: "#3B82F6" },
    { label: "Gold", value: results.allocation.gold, color: "#EAB308" },
  ];

  return (
    <CalculatorLayout
      title="Risk Appetite Calculator"
      description="Discover your risk profile and get personalized asset allocation"
      icon={<Target className="w-7 h-7 text-white" />}
      color="from-red-500 to-orange-500"
      assumptions={[
        "Risk profile is indicative and for educational purposes",
        "Asset allocation should be reviewed periodically",
        "Individual circumstances may require different approaches",
        "Consult a financial advisor for personalized advice",
      ]}
      howItWorks="This calculator assesses your risk tolerance based on age, investment horizon, and personal preferences. It uses a weighted scoring system that considers factors like income stability, existing wealth, and behavioral tendencies to determine your risk profile and suggest an appropriate asset allocation."
      relatedCalculators={[
        { name: "SIP Calculator", href: "/tools/sip" },
        { name: "Retirement Calculator", href: "/tools/retirement" },
        { name: "SWP Calculator", href: "/tools/swp" },
      ]}
      results={
        <div className="space-y-6">
          {/* Risk Profile Gauge */}
          <div className="flex justify-center py-4">
            <GaugeChart
              value={results.score}
              color={results.profile.color}
              label={results.profile.category}
            />
          </div>

          {/* Profile Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl p-4"
          >
            <p className="text-sm text-navy-700 leading-relaxed">
              {results.profile.description}
            </p>
          </motion.div>

          {/* Asset Allocation */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4 text-center">
              Recommended Asset Allocation
            </h3>
            <PieChart data={allocationChartData} size={180} innerRadius={50} />
          </div>

          {/* Allocation Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-red-50 border border-red-100 rounded-xl p-3 text-center"
            >
              <TrendingUp className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600">{results.allocation.equity}%</p>
              <p className="text-xs text-red-700">Equity</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center"
            >
              <Shield className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-600">{results.allocation.debt}%</p>
              <p className="text-xs text-blue-700">Debt</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center"
            >
              <Briefcase className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-yellow-600">{results.allocation.gold}%</p>
              <p className="text-xs text-yellow-700">Gold</p>
            </motion.div>
          </div>

          {/* Suggested Products */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-3">Suggested Investment Products</h3>
            <div className="flex flex-wrap gap-2">
              {results.suggestedProducts.map((product, i) => (
                <motion.span
                  key={product}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="px-3 py-1.5 bg-white border border-card-border rounded-full text-sm text-navy-700"
                >
                  {product}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ViewToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />

      <SliderInput
        label="Your Age"
        value={age}
        onChange={setAge}
        min={18}
        max={80}
        unit=" years"
      />

      <SliderInput
        label="Investment Horizon"
        value={investmentHorizon}
        onChange={setInvestmentHorizon}
        min={1}
        max={30}
        unit=" years"
      />

      <SelectInput
        label="Risk Tolerance"
        value={riskTolerance}
        onChange={(v) => setRiskTolerance(Number(v))}
        options={riskToleranceOptions}
      />

      {isAdvanced && (
        <>
          <div className="border-t border-card-border my-6 pt-6">
            <h3 className="text-sm font-medium text-navy-700 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent" />
              Financial Details
            </h3>

            <NumberInput
              label="Annual Income"
              value={annualIncome}
              onChange={setAnnualIncome}
              prefix="₹"
            />

            <NumberInput
              label="Monthly Expenses"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
              prefix="₹"
            />

            <NumberInput
              label="Existing Investments"
              value={existingInvestments}
              onChange={setExistingInvestments}
              prefix="₹"
            />

            <SliderInput
              label="Financial Dependents"
              value={financialDependents}
              onChange={setFinancialDependents}
              min={0}
              max={10}
              unit=" people"
            />

            <SelectInput
              label="Income Stability"
              value={incomeStability}
              onChange={(v) => setIncomeStability(Number(v))}
              options={incomeStabilityOptions}
            />

            <SelectInput
              label="Investment Experience"
              value={investmentExperience}
              onChange={(v) => setInvestmentExperience(Number(v))}
              options={investmentExperienceOptions}
            />
          </div>

          <div className="border-t border-card-border my-6 pt-6">
            <h3 className="text-sm font-medium text-navy-700 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              Behavioral Assessment
            </h3>

            {behavioralQuestions.map((q, i) => (
              <div key={i} className="mb-6">
                <p className="text-sm text-navy-700 mb-2">{q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        const newAnswers = [...behavioralAnswers];
                        newAnswers[i] = opt.value;
                        setBehavioralAnswers(newAnswers);
                      }}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors text-left ${
                        behavioralAnswers[i] === opt.value
                          ? "border-accent bg-accent/10 text-accent-dark"
                          : "border-card-border hover:border-accent/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}


"use client";

import React, { useState, useMemo } from "react";
import { PiggyBank, TrendingUp, Calendar, Wallet, Target } from "lucide-react";
import {
  CalculatorLayout,
  SliderInput,
  NumberInput,
  ViewToggle,
  ResultCard,
} from "@/components/calculators/CalculatorLayout";
import { LineChart, DataTable } from "@/components/calculators/Charts";
import { calculateRetirementCorpus, calculateRequiredSIP, formatCurrency } from "@/lib/calculations";
import { formatCurrencyPDF, type PDFConfig } from "@/lib/pdfGenerator";

export default function RetirementCalculator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Traditional inputs
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  
  // Advanced inputs
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [expectedPension, setExpectedPension] = useState(0);
  const [inflationRate, setInflationRate] = useState(6);
  const [postRetirementReturn, setPostRetirementReturn] = useState(7);

  const results = useMemo(() => {
    const inflation = isAdvanced ? inflationRate : 6;
    const postReturn = isAdvanced ? postRetirementReturn : 7;
    const life = isAdvanced ? lifeExpectancy : 85;
    
    const retirementResult = calculateRetirementCorpus(
      currentAge,
      retirementAge,
      monthlyExpenses,
      inflation,
      postReturn,
      life
    );
    
    // Adjust for existing savings and pension
    const yearsToRetirement = retirementAge - currentAge;
    let adjustedCorpus = retirementResult.requiredCorpus;
    
    if (isAdvanced && currentSavings > 0) {
      const savingsFV = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
      adjustedCorpus -= savingsFV;
    }
    
    if (isAdvanced && expectedPension > 0) {
      // Reduce required corpus based on expected pension
      const annualPension = expectedPension * 12;
      const pensionValue = annualPension * retirementResult.yearsInRetirement;
      adjustedCorpus -= pensionValue * 0.5; // Rough adjustment
    }
    
    adjustedCorpus = Math.max(0, adjustedCorpus);
    
    const monthlySIP = calculateRequiredSIP(adjustedCorpus, expectedReturn, yearsToRetirement);
    
    // Gap analysis
    const projectedCorpus = isAdvanced && currentSavings > 0
      ? currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement)
      : 0;
    const gap = retirementResult.requiredCorpus - projectedCorpus;
    
    return {
      requiredCorpus: retirementResult.requiredCorpus,
      adjustedCorpus,
      monthlyExpensesAtRetirement: retirementResult.monthlyExpensesAtRetirement,
      yearsInRetirement: retirementResult.yearsInRetirement,
      monthlySIP,
      projectedCorpus,
      gap: Math.max(0, gap),
      yearsToRetirement,
      yearlyProjection: retirementResult.yearlyProjection,
    };
  }, [currentAge, retirementAge, monthlyExpenses, expectedReturn, lifeExpectancy, currentSavings, expectedPension, inflationRate, postRetirementReturn, isAdvanced]);

  const chartData = useMemo(() => {
    return results.yearlyProjection.slice(0, Math.min(results.yearlyProjection.length, 30)).map((row, i) => ({
      label: `${row.year}`,
      value: row.corpus,
      secondaryValue: row.annualExpense,
    }));
  }, [results.yearlyProjection]);

  const tableColumns = [
    { key: "year", header: "Age", align: "center" as const },
    { key: "corpus", header: "Corpus", align: "right" as const, format: (v: number) => formatCurrency(v) },
    { key: "annualExpense", header: "Annual Expense", align: "right" as const, format: (v: number) => formatCurrency(v) },
    { key: "withdrawal", header: "Withdrawal", align: "right" as const, format: (v: number) => formatCurrency(v) },
  ];

  // PDF Configuration - Only user inputs and results
  const pdfConfig: Omit<PDFConfig, 'calculatorName' | 'calculatorDescription'> = {
    inputs: [
      { label: "Current Age", value: currentAge, unit: " years" },
      { label: "Retirement Age", value: retirementAge, unit: " years" },
      { label: "Current Monthly Expenses", value: `₹${monthlyExpenses.toLocaleString('en-IN')}` },
      { label: "Expected Return (Pre-retirement)", value: expectedReturn, unit: "% p.a." },
      ...(isAdvanced ? [
        { label: "Life Expectancy", value: lifeExpectancy, unit: " years" },
        { label: "Current Savings", value: `₹${currentSavings.toLocaleString('en-IN')}` },
        { label: "Expected Pension", value: `₹${expectedPension.toLocaleString('en-IN')}/month` },
        { label: "Inflation Rate", value: inflationRate, unit: "%" },
        { label: "Post-retirement Return", value: postRetirementReturn, unit: "%" },
      ] : []),
    ],
    results: [
      { label: "Required Retirement Corpus", value: formatCurrencyPDF(results.requiredCorpus), highlight: true },
      { label: "Monthly SIP Needed", value: formatCurrencyPDF(results.monthlySIP), subValue: `for ${results.yearsToRetirement} years` },
      { label: "Monthly Expenses at Retirement", value: formatCurrencyPDF(results.monthlyExpensesAtRetirement) },
      { label: "Years in Retirement", value: `${results.yearsInRetirement} years` },
      ...(isAdvanced && currentSavings > 0 ? [
        { label: "Projected from Current Savings", value: formatCurrencyPDF(results.projectedCorpus) },
        { label: "Gap to Fill", value: formatCurrencyPDF(results.gap) },
      ] : []),
    ],
    tables: [
      {
        title: "Retirement Corpus Projection",
        headers: ["Age", "Corpus", "Annual Expense", "Withdrawal"],
        rows: results.yearlyProjection.slice(0, 20).map(row => [
          row.year,
          formatCurrencyPDF(row.corpus),
          formatCurrencyPDF(row.annualExpense),
          formatCurrencyPDF(row.withdrawal),
        ]),
      },
    ],
  };

  return (
    <CalculatorLayout
      title="Retirement Calculator"
      description="Plan your retirement corpus and monthly SIP needed for a secure future"
      icon={<PiggyBank className="w-7 h-7 text-white" />}
      color="from-blue-500 to-indigo-500"
      assumptions={[
        `Inflation rate: ${isAdvanced ? inflationRate : 6}% per annum`,
        `Post-retirement returns: ${isAdvanced ? postRetirementReturn : 7}% per annum`,
        `Life expectancy: ${isAdvanced ? lifeExpectancy : 85} years`,
        "Monthly expenses increase with inflation during retirement",
        "SIP returns compounded monthly",
      ]}
      howItWorks="The retirement calculator estimates the corpus needed to sustain your lifestyle post-retirement. It factors in inflation to calculate future expenses, uses the present value of annuity formula for the required corpus, and calculates the monthly SIP needed to accumulate that corpus over your working years."
      relatedCalculators={[
        { name: "SIP Calculator", href: "/tools/sip" },
        { name: "SWP Calculator", href: "/tools/swp" },
        { name: "Risk Appetite Calculator", href: "/tools/risk-appetite" },
      ]}
      pdfConfig={pdfConfig}
      results={
        <div className="space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Required Retirement Corpus"
              value={formatCurrency(results.requiredCorpus)}
              icon={<Target className="w-5 h-5" />}
              color="text-blue-600"
            />
            <ResultCard
              label="Monthly SIP Needed"
              value={formatCurrency(results.monthlySIP)}
              subValue={`for ${results.yearsToRetirement} years`}
              icon={<Wallet className="w-5 h-5" />}
              color="text-accent"
            />
            <ResultCard
              label="Monthly Expenses at Retirement"
              value={formatCurrency(results.monthlyExpensesAtRetirement)}
              subValue={`from current ₹${monthlyExpenses.toLocaleString('en-IN')}`}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <ResultCard
              label="Years in Retirement"
              value={`${results.yearsInRetirement} years`}
              subValue={`Age ${retirementAge} to ${isAdvanced ? lifeExpectancy : 85}`}
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>

          {/* Gap Analysis (Advanced) */}
          {isAdvanced && currentSavings > 0 && (
            <div className={`rounded-xl p-4 ${results.gap > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
              <h3 className="text-sm font-medium mb-2 text-navy-700">Gap Analysis</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Projected from current savings</p>
                  <p className="font-semibold text-navy-700">{formatCurrency(results.projectedCorpus)}</p>
                </div>
                <div>
                  <p className="text-muted">Additional corpus needed</p>
                  <p className={`font-semibold ${results.gap > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                    {results.gap > 0 ? formatCurrency(results.gap) : 'On Track! ✓'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Retirement Timeline Chart */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Retirement Corpus Over Time</h3>
            <LineChart
              data={chartData}
              formatValue={(v) => formatCurrency(v)}
              primaryLabel="Corpus Balance"
              secondaryLabel="Annual Expense"
              primaryColor="#3B82F6"
              secondaryColor="#EF4444"
            />
          </div>

          {/* Projection Table */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Year-wise Projection (Retirement Phase)</h3>
            <DataTable columns={tableColumns} data={results.yearlyProjection} maxRows={5} />
          </div>

          {/* Key Insights */}
          <div className="bg-primary/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-2">Key Insights</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Your expenses will be <strong className="text-navy-700">{((results.monthlyExpensesAtRetirement / monthlyExpenses - 1) * 100).toFixed(0)}% higher</strong> at retirement due to inflation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Starting SIP of <strong className="text-navy-700">{formatCurrency(results.monthlySIP)}</strong> today can help you achieve your retirement goal
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Delaying by even 5 years would require <strong className="text-navy-700">{((results.yearsToRetirement - 5) > 0 ? '~40% higher' : 'significantly higher')}</strong> monthly SIP
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <ViewToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />

      <SliderInput
        label="Current Age"
        value={currentAge}
        onChange={setCurrentAge}
        min={18}
        max={70}
        unit=" years"
      />

      <SliderInput
        label="Retirement Age"
        value={retirementAge}
        onChange={setRetirementAge}
        min={currentAge + 1}
        max={75}
        unit=" years"
      />

      <NumberInput
        label="Current Monthly Expenses"
        value={monthlyExpenses}
        onChange={setMonthlyExpenses}
        prefix="₹"
        min={10000}
      />

      <SliderInput
        label="Expected Pre-retirement Return (p.a.)"
        value={expectedReturn}
        onChange={setExpectedReturn}
        min={6}
        max={20}
        step={0.5}
        unit="%"
      />

      {isAdvanced && (
        <>
          <div className="border-t border-card-border my-6 pt-6">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Advanced Parameters</h3>

            <SliderInput
              label="Life Expectancy"
              value={lifeExpectancy}
              onChange={setLifeExpectancy}
              min={retirementAge + 5}
              max={100}
              unit=" years"
            />

            <NumberInput
              label="Current Retirement Savings"
              value={currentSavings}
              onChange={setCurrentSavings}
              prefix="₹"
              min={0}
            />

            <NumberInput
              label="Expected Monthly Pension"
              value={expectedPension}
              onChange={setExpectedPension}
              prefix="₹"
              min={0}
            />

            <SliderInput
              label="Inflation Rate"
              value={inflationRate}
              onChange={setInflationRate}
              min={3}
              max={10}
              step={0.5}
              unit="%"
            />

            <SliderInput
              label="Post-retirement Return"
              value={postRetirementReturn}
              onChange={setPostRetirementReturn}
              min={4}
              max={12}
              step={0.5}
              unit="%"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}


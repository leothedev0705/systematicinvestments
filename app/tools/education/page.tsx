"use client";

import React, { useState, useMemo } from "react";
import { GraduationCap, Target, Wallet, Calendar, Globe } from "lucide-react";
import {
  CalculatorLayout,
  SliderInput,
  NumberInput,
  ViewToggle,
  ToggleInput,
  ResultCard,
} from "@/components/calculators/CalculatorLayout";
import { LineChart, DataTable } from "@/components/calculators/Charts";
import { calculateEducationFund, formatCurrency } from "@/lib/calculations";
import { formatCurrencyPDF, type PDFConfig } from "@/lib/pdfGenerator";

export default function EducationCalculator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Traditional inputs
  const [childAge, setChildAge] = useState(5);
  const [educationStartAge, setEducationStartAge] = useState(18);
  const [currentCost, setCurrentCost] = useState(1500000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  
  // Advanced inputs
  const [educationInflation, setEducationInflation] = useState(10);
  const [educationDuration, setEducationDuration] = useState(4);
  const [existingSavings, setExistingSavings] = useState(0);
  const [isForeignEducation, setIsForeignEducation] = useState(false);

  const results = useMemo(() => {
    const inflationRate = isAdvanced ? educationInflation : 10;
    const duration = isAdvanced ? educationDuration : 4;
    const cost = isForeignEducation ? currentCost * 1.5 : currentCost; // 50% premium for foreign
    
    const educationResult = calculateEducationFund(
      childAge,
      educationStartAge,
      cost,
      inflationRate,
      expectedReturn,
      duration
    );
    
    // Adjust for existing savings
    let adjustedMonthly = educationResult.monthlyRequired;
    let adjustedLumpsum = educationResult.lumpsumRequired;
    
    if (isAdvanced && existingSavings > 0) {
      const yearsToEducation = educationStartAge - childAge;
      const savingsFV = existingSavings * Math.pow(1 + expectedReturn / 100, yearsToEducation);
      const remainingTarget = Math.max(0, educationResult.futureCost - savingsFV);
      
      // Recalculate required amounts
      const monthlyRate = expectedReturn / 100 / 12;
      const months = yearsToEducation * 12;
      const factor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      adjustedMonthly = Math.round(remainingTarget / factor);
      adjustedLumpsum = Math.round(remainingTarget / Math.pow(1 + expectedReturn / 100, yearsToEducation));
    }
    
    return {
      ...educationResult,
      adjustedMonthly,
      adjustedLumpsum,
      yearsToEducation: educationStartAge - childAge,
      inflationRate,
      costMultiplier: (educationResult.futureCost / (cost * duration)).toFixed(1),
    };
  }, [childAge, educationStartAge, currentCost, expectedReturn, educationInflation, educationDuration, existingSavings, isForeignEducation, isAdvanced]);

  const chartData = useMemo(() => {
    return results.yearlyMilestones.map((row) => ({
      label: `Age ${row.childAge}`,
      value: row.accumulated,
      secondaryValue: row.target,
    }));
  }, [results.yearlyMilestones]);

  const tableColumns = [
    { key: "year", header: "Year", align: "center" as const },
    { key: "childAge", header: "Child's Age", align: "center" as const },
    { key: "accumulated", header: "Accumulated", align: "right" as const, format: (v: number) => formatCurrency(v) },
    { key: "target", header: "Target", align: "right" as const, format: (v: number) => formatCurrency(v) },
  ];

  // PDF Configuration
  const pdfConfig: Omit<PDFConfig, 'calculatorName' | 'calculatorDescription' | 'assumptions'> = {
    inputs: [
      { label: "Child's Current Age", value: childAge, unit: " years" },
      { label: "Education Start Age", value: educationStartAge, unit: " years" },
      { label: "Current Annual Education Cost", value: `₹${currentCost.toLocaleString('en-IN')}` },
      { label: "Expected Return", value: expectedReturn, unit: "% p.a." },
      ...(isAdvanced ? [
        { label: "Education Inflation Rate", value: educationInflation, unit: "%" },
        { label: "Course Duration", value: educationDuration, unit: " years" },
        { label: "Existing Savings", value: `₹${existingSavings.toLocaleString('en-IN')}` },
        { label: "Foreign Education", value: isForeignEducation ? "Yes (1.5x premium)" : "No" },
      ] : []),
    ],
    results: [
      { label: "Total Future Education Cost", value: formatCurrencyPDF(results.futureCost), highlight: true, subValue: `${results.costMultiplier}x of current annual cost` },
      { label: "Monthly SIP Needed", value: formatCurrencyPDF(results.adjustedMonthly), subValue: `for ${results.yearsToEducation} years` },
      { label: "OR Lumpsum Today", value: formatCurrencyPDF(results.adjustedLumpsum) },
      { label: "Years Until Education", value: `${results.yearsToEducation} years` },
    ],
    tables: results.yearlyMilestones.length > 0 ? [
      {
        title: "Education Fund Milestones",
        headers: ["Year", "Child's Age", "Accumulated", "Target"],
        rows: results.yearlyMilestones.map(row => [
          row.year,
          row.childAge,
          formatCurrencyPDF(row.accumulated),
          formatCurrencyPDF(row.target),
        ]),
      },
    ] : [],
  };

  return (
    <CalculatorLayout
      title="Child Education Calculator"
      description="Plan for your child's education expenses with inflation factored in"
      icon={<GraduationCap className="w-7 h-7 text-white" />}
      color="from-cyan-500 to-blue-500"
      assumptions={[
        `Education inflation: ${isAdvanced ? educationInflation : 10}% per annum`,
        `Course duration: ${isAdvanced ? educationDuration : 4} years`,
        `Expected investment return: ${expectedReturn}% per annum`,
        "Education costs increase each year during the course",
        isForeignEducation ? "Foreign education premium applied (1.5x)" : "Domestic education costs",
      ]}
      howItWorks="The education calculator projects the future cost of education by applying education inflation (typically higher than general inflation) to current costs. It accounts for the entire duration of education and calculates the SIP or lumpsum needed to accumulate the required corpus by the time your child starts their education."
      relatedCalculators={[
        { name: "SIP Calculator", href: "/tools/sip" },
        { name: "SIP Delay Calculator", href: "/tools/sip-delay" },
        { name: "Retirement Calculator", href: "/tools/retirement" },
      ]}
      pdfConfig={pdfConfig}
      results={
        <div className="space-y-6">
          {/* Future Cost - Prominent */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GraduationCap className="w-6 h-6 text-cyan-600" />
              <p className="text-sm text-cyan-700 font-medium">
                Total Education Cost in {results.yearsToEducation} Years
              </p>
            </div>
            <div className="text-4xl font-heading font-bold text-cyan-700">
              {formatCurrency(results.futureCost)}
            </div>
            <p className="text-sm text-cyan-600 mt-2">
              {results.costMultiplier}x of current annual cost due to inflation
            </p>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Monthly SIP Needed"
              value={formatCurrency(results.adjustedMonthly)}
              subValue={`for ${results.yearsToEducation} years`}
              icon={<Wallet className="w-5 h-5" />}
              color="text-accent"
            />
            <ResultCard
              label="OR Lumpsum Today"
              value={formatCurrency(results.adjustedLumpsum)}
              subValue="One-time investment"
              icon={<Target className="w-5 h-5" />}
            />
            <ResultCard
              label="Current Annual Cost"
              value={formatCurrency(currentCost)}
              subValue={isForeignEducation ? "Foreign education" : "Domestic education"}
              icon={isForeignEducation ? <Globe className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            />
            <ResultCard
              label="Education Starts"
              value={`Age ${educationStartAge}`}
              subValue={`In ${results.yearsToEducation} years`}
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>

          {/* Timeline Visualization */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Education Fund Timeline</h3>
            <div className="relative">
              {/* Timeline bar */}
              <div className="flex items-center justify-between text-xs text-muted mb-2">
                <span>Now (Age {childAge})</span>
                <span>Education (Age {educationStartAge})</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: "0%" }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {[0, 25, 50, 75, 100].map((p) => {
                  const year = Math.round((results.yearsToEducation * p) / 100);
                  return (
                    <div key={p} className="text-center">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mx-auto mb-1" />
                      <span className="text-xs text-muted">Yr {year}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Accumulation Chart */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Fund Growth Projection</h3>
            <LineChart
              data={chartData}
              formatValue={(v) => formatCurrency(v)}
              primaryLabel="Accumulated Amount"
              secondaryLabel="Target"
              primaryColor="#06B6D4"
              secondaryColor="#3B82F6"
            />
          </div>

          {/* Milestones Table */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Year-wise Milestones</h3>
            <DataTable columns={tableColumns} data={results.yearlyMilestones} maxRows={5} />
          </div>

          {/* Tips */}
          <div className="bg-primary/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-2">💡 Planning Tips</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Consider <strong>ELSS funds</strong> for tax benefits under Section 80C while saving for education
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Start a <strong>Sukanya Samriddhi Yojana</strong> (SSY) account for girl child - offers 8%+ tax-free returns
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Gradually shift to <strong>debt funds</strong> as the education date approaches (3-5 years before)
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <ViewToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />

      <SliderInput
        label="Child's Current Age"
        value={childAge}
        onChange={setChildAge}
        min={0}
        max={15}
        unit=" years"
      />

      <SliderInput
        label="Education Start Age"
        value={educationStartAge}
        onChange={setEducationStartAge}
        min={childAge + 3}
        max={25}
        unit=" years"
      />

      <NumberInput
        label="Current Annual Education Cost"
        value={currentCost}
        onChange={setCurrentCost}
        prefix="₹"
        min={50000}
      />

      <SliderInput
        label="Expected Investment Return (p.a.)"
        value={expectedReturn}
        onChange={setExpectedReturn}
        min={6}
        max={18}
        step={0.5}
        unit="%"
      />

      {isAdvanced && (
        <>
          <div className="border-t border-card-border my-6 pt-6">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Advanced Options</h3>

            <SliderInput
              label="Education Inflation Rate"
              value={educationInflation}
              onChange={setEducationInflation}
              min={6}
              max={15}
              step={0.5}
              unit="%"
            />

            <SliderInput
              label="Course Duration"
              value={educationDuration}
              onChange={setEducationDuration}
              min={1}
              max={8}
              unit=" years"
            />

            <NumberInput
              label="Existing Education Savings"
              value={existingSavings}
              onChange={setExistingSavings}
              prefix="₹"
              min={0}
            />

            <ToggleInput
              label="Foreign Education"
              checked={isForeignEducation}
              onChange={setIsForeignEducation}
              description="Apply 1.5x cost premium for overseas study"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}


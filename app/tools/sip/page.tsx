"use client";

import React, { useState, useMemo } from "react";
import { Calculator, TrendingUp, Wallet, PiggyBank } from "lucide-react";
import {
  CalculatorLayout,
  SliderInput,
  NumberInput,
  ViewToggle,
  ToggleInput,
  ResultCard,
} from "@/components/calculators/CalculatorLayout";
import { LineChart, DataTable } from "@/components/calculators/Charts";
import { calculateSIPFutureValue, formatCurrency } from "@/lib/calculations";

export default function SIPCalculator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Traditional inputs
  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [years, setYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  
  // Advanced inputs
  const [annualStepUp, setAnnualStepUp] = useState(10);
  const [lumpsumAddition, setLumpsumAddition] = useState(0);
  const [expenseRatio, setExpenseRatio] = useState(0.5);
  const [calculateTax, setCalculateTax] = useState(false);

  const results = useMemo(() => {
    const effectiveReturn = expectedReturn - (isAdvanced ? expenseRatio : 0);
    const stepUp = isAdvanced ? annualStepUp : 0;
    
    const sipResult = calculateSIPFutureValue(monthlySIP, effectiveReturn, years, stepUp);
    
    // Add lumpsum if advanced
    let totalFV = sipResult.futureValue;
    if (isAdvanced && lumpsumAddition > 0) {
      const lumpsumFV = lumpsumAddition * Math.pow(1 + effectiveReturn / 100, years);
      totalFV += lumpsumFV;
    }
    
    // Calculate LTCG tax if enabled (10% above 1L)
    let taxAmount = 0;
    if (isAdvanced && calculateTax) {
      const gains = totalFV - sipResult.totalInvested - lumpsumAddition;
      if (gains > 100000) {
        taxAmount = (gains - 100000) * 0.1;
      }
    }
    
    const netValue = totalFV - taxAmount;
    const cagr = ((Math.pow(netValue / (sipResult.totalInvested + lumpsumAddition), 1 / years) - 1) * 100);
    
    return {
      futureValue: Math.round(totalFV),
      totalInvested: sipResult.totalInvested + lumpsumAddition,
      wealthGained: Math.round(totalFV - sipResult.totalInvested - lumpsumAddition),
      taxAmount: Math.round(taxAmount),
      netValue: Math.round(netValue),
      cagr: cagr.toFixed(2),
      yearlyBreakdown: sipResult.yearlyBreakdown,
    };
  }, [monthlySIP, years, expectedReturn, annualStepUp, lumpsumAddition, expenseRatio, calculateTax, isAdvanced]);

  const chartData = useMemo(() => {
    return results.yearlyBreakdown.map((row) => ({
      label: `Yr ${row.year}`,
      value: row.value,
      secondaryValue: row.invested,
    }));
  }, [results.yearlyBreakdown]);

  const tableColumns = [
    { key: "year", header: "Year", align: "center" as const },
    { key: "sipAmount", header: "SIP/Month", align: "right" as const, format: (v: number) => `₹${v.toLocaleString("en-IN")}` },
    { key: "invested", header: "Total Invested", align: "right" as const, format: (v: number) => formatCurrency(v) },
    { key: "value", header: "Portfolio Value", align: "right" as const, format: (v: number) => formatCurrency(v) },
    { key: "returns", header: "Returns", align: "right" as const, format: (v: number) => formatCurrency(v) },
  ];

  return (
    <CalculatorLayout
      title="SIP Calculator"
      description="Calculate the future value of your Systematic Investment Plan"
      icon={<Calculator className="w-7 h-7 text-white" />}
      color="from-purple-500 to-pink-500"
      assumptions={[
        "Returns are compounded monthly",
        "SIP is invested at the beginning of each month",
        isAdvanced ? `Expense ratio of ${expenseRatio}% deducted from returns` : "No expense ratio considered",
        isAdvanced && annualStepUp > 0 ? `Annual step-up of ${annualStepUp}% applied` : "No step-up considered",
        calculateTax ? "LTCG tax of 10% on gains above ₹1 Lakh" : "Tax not considered",
      ]}
      howItWorks="The SIP calculator uses the formula: FV = P × [{(1 + r)^n - 1} / r] × (1 + r), where P is monthly investment, r is monthly rate of return, and n is number of months. For step-up SIP, the monthly amount increases annually by the specified percentage."
      relatedCalculators={[
        { name: "SIP Delay Calculator", href: "/tools/sip-delay" },
        { name: "Retirement Calculator", href: "/tools/retirement" },
        { name: "Child Education Calculator", href: "/tools/education" },
      ]}
      results={
        <div className="space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Future Value"
              value={formatCurrency(results.futureValue)}
              icon={<TrendingUp className="w-5 h-5" />}
              color="text-green-600"
            />
            <ResultCard
              label="Total Invested"
              value={formatCurrency(results.totalInvested)}
              icon={<Wallet className="w-5 h-5" />}
            />
            <ResultCard
              label="Wealth Gained"
              value={formatCurrency(results.wealthGained)}
              subValue={`${((results.wealthGained / results.totalInvested) * 100).toFixed(1)}% return`}
              icon={<PiggyBank className="w-5 h-5" />}
              color="text-accent"
            />
            <ResultCard
              label="CAGR"
              value={`${results.cagr}%`}
              subValue="Compound Annual Growth"
            />
          </div>

          {isAdvanced && calculateTax && results.taxAmount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>LTCG Tax (estimated):</strong> {formatCurrency(results.taxAmount)}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Net Value after tax: <strong>{formatCurrency(results.netValue)}</strong>
              </p>
            </div>
          )}

          {/* Chart */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Growth Projection</h3>
            <LineChart
              data={chartData}
              formatValue={(v) => formatCurrency(v)}
              primaryLabel="Portfolio Value"
              secondaryLabel="Amount Invested"
            />
          </div>

          {/* Data Table */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Year-wise Breakdown</h3>
            <DataTable columns={tableColumns} data={results.yearlyBreakdown} maxRows={5} />
          </div>
        </div>
      }
    >
      <ViewToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />

      <NumberInput
        label="Monthly SIP Amount"
        value={monthlySIP}
        onChange={setMonthlySIP}
        prefix="₹"
        min={500}
      />

      <SliderInput
        label="Investment Period"
        value={years}
        onChange={setYears}
        min={1}
        max={40}
        unit=" years"
      />

      <SliderInput
        label="Expected Return (p.a.)"
        value={expectedReturn}
        onChange={setExpectedReturn}
        min={1}
        max={30}
        step={0.5}
        unit="%"
      />

      {isAdvanced && (
        <>
          <SliderInput
            label="Annual Step-up"
            value={annualStepUp}
            onChange={setAnnualStepUp}
            min={0}
            max={25}
            unit="%"
          />

          <NumberInput
            label="Lumpsum Addition (One-time)"
            value={lumpsumAddition}
            onChange={setLumpsumAddition}
            prefix="₹"
            min={0}
          />

          <SliderInput
            label="Expense Ratio"
            value={expenseRatio}
            onChange={setExpenseRatio}
            min={0}
            max={3}
            step={0.1}
            unit="%"
          />

          <ToggleInput
            label="Calculate LTCG Tax"
            checked={calculateTax}
            onChange={setCalculateTax}
            description="10% tax on gains above ₹1 Lakh"
          />
        </>
      )}
    </CalculatorLayout>
  );
}


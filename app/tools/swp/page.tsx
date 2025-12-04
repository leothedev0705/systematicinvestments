"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, Wallet, Clock, ArrowDownCircle } from "lucide-react";
import {
  CalculatorLayout,
  SliderInput,
  NumberInput,
  SelectInput,
  ViewToggle,
  ToggleInput,
  ResultCard,
} from "@/components/calculators/CalculatorLayout";
import { LineChart, DataTable } from "@/components/calculators/Charts";
import { calculateSWP, formatCurrency } from "@/lib/calculations";

export default function SWPCalculator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Traditional inputs
  const [investmentAmount, setInvestmentAmount] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(30000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  
  // Advanced inputs
  const [withdrawalFrequency, setWithdrawalFrequency] = useState("monthly");
  const [inflationAdjustment, setInflationAdjustment] = useState(false);
  const [inflationRate, setInflationRate] = useState(6);
  const [stepUpWithdrawal, setStepUpWithdrawal] = useState(0);
  const [considerTax, setConsiderTax] = useState(false);

  const results = useMemo(() => {
    // Adjust for frequency
    let effectiveWithdrawal = monthlyWithdrawal;
    if (withdrawalFrequency === "quarterly") {
      effectiveWithdrawal = monthlyWithdrawal * 3;
    }
    
    const inflation = isAdvanced && inflationAdjustment ? inflationRate : 0;
    
    const swpResult = calculateSWP(
      investmentAmount,
      effectiveWithdrawal,
      expectedReturn,
      inflation
    );
    
    // Calculate years and months
    const years = Math.floor(swpResult.monthsLasting / 12);
    const months = swpResult.monthsLasting % 12;
    
    // Tax estimation (rough - 10% on gains portion)
    let taxAmount = 0;
    if (isAdvanced && considerTax) {
      const gains = swpResult.totalWithdrawn - investmentAmount;
      if (gains > 100000) {
        taxAmount = (gains - 100000) * 0.1;
      }
    }
    
    return {
      monthsLasting: swpResult.monthsLasting,
      yearsLasting: years,
      remainingMonths: months,
      totalWithdrawn: swpResult.totalWithdrawn,
      effectiveWithdrawal,
      taxAmount: Math.round(taxAmount),
      netWithdrawn: swpResult.totalWithdrawn - taxAmount,
      monthlyBreakdown: swpResult.monthlyBreakdown,
      willLastForever: swpResult.monthsLasting >= 600,
    };
  }, [investmentAmount, monthlyWithdrawal, expectedReturn, withdrawalFrequency, inflationAdjustment, inflationRate, stepUpWithdrawal, considerTax, isAdvanced]);

  const chartData = useMemo(() => {
    return results.monthlyBreakdown.map((row) => ({
      label: row.month <= 12 ? `M${row.month}` : `Yr ${Math.ceil(row.month / 12)}`,
      value: row.remainingCorpus,
      secondaryValue: row.totalWithdrawn,
    }));
  }, [results.monthlyBreakdown]);

  const tableColumns = [
    { key: "month", header: "Month", align: "center" as const },
    { key: "withdrawal", header: "Withdrawal", align: "right" as const, format: (v: number) => formatCurrency(v) },
    { key: "remainingCorpus", header: "Remaining Corpus", align: "right" as const, format: (v: number) => formatCurrency(v) },
    { key: "totalWithdrawn", header: "Total Withdrawn", align: "right" as const, format: (v: number) => formatCurrency(v) },
  ];

  const frequencyOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
  ];

  return (
    <CalculatorLayout
      title="SWP Calculator"
      description="Plan systematic withdrawals from your corpus and see how long it lasts"
      icon={<TrendingUp className="w-7 h-7 text-white" />}
      color="from-green-500 to-emerald-500"
      assumptions={[
        `Expected return: ${expectedReturn}% per annum`,
        "Returns are compounded monthly",
        isAdvanced && inflationAdjustment 
          ? `Withdrawal increases by ${inflationRate}% annually for inflation`
          : "Withdrawal amount remains constant",
        "Withdrawals happen at month-end",
      ]}
      howItWorks="The SWP calculator simulates month-by-month withdrawals from your corpus. Each month, the remaining corpus earns returns, and then the withdrawal is deducted. This continues until the corpus is exhausted or for a maximum of 50 years if the corpus is sustainable."
      relatedCalculators={[
        { name: "SIP Calculator", href: "/tools/sip" },
        { name: "Retirement Calculator", href: "/tools/retirement" },
        { name: "Risk Appetite Calculator", href: "/tools/risk-appetite" },
      ]}
      results={
        <div className="space-y-6">
          {/* Duration Result - Prominent */}
          <div className={`rounded-2xl p-6 text-center ${results.willLastForever ? 'bg-green-50 border border-green-200' : 'bg-background'}`}>
            <p className="text-sm text-muted mb-2">Your corpus will last</p>
            <div className="text-4xl font-heading font-bold text-primary">
              {results.willLastForever ? (
                <span className="text-green-600">Forever! 🎉</span>
              ) : (
                <>
                  {results.yearsLasting} <span className="text-2xl">years</span>
                  {results.remainingMonths > 0 && (
                    <> {results.remainingMonths} <span className="text-2xl">months</span></>
                  )}
                </>
              )}
            </div>
            {results.willLastForever && (
              <p className="text-sm text-green-700 mt-2">
                Your returns exceed withdrawals - sustainable indefinitely!
              </p>
            )}
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Total Withdrawals"
              value={formatCurrency(results.totalWithdrawn)}
              icon={<ArrowDownCircle className="w-5 h-5" />}
              color="text-green-600"
            />
            <ResultCard
              label={withdrawalFrequency === "monthly" ? "Monthly Withdrawal" : "Quarterly Withdrawal"}
              value={formatCurrency(results.effectiveWithdrawal)}
              icon={<Wallet className="w-5 h-5" />}
            />
            <ResultCard
              label="Initial Corpus"
              value={formatCurrency(investmentAmount)}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <ResultCard
              label="Total Months"
              value={`${results.monthsLasting}+`}
              subValue={results.willLastForever ? "Sustainable" : "Until exhausted"}
              icon={<Clock className="w-5 h-5" />}
            />
          </div>

          {isAdvanced && considerTax && results.taxAmount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Estimated LTCG Tax:</strong> {formatCurrency(results.taxAmount)}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Net withdrawals after tax: <strong>{formatCurrency(results.netWithdrawn)}</strong>
              </p>
            </div>
          )}

          {/* Corpus Timeline Chart */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Corpus Timeline</h3>
            <LineChart
              data={chartData}
              formatValue={(v) => formatCurrency(v)}
              primaryLabel="Remaining Corpus"
              secondaryLabel="Total Withdrawn"
              primaryColor="#22C55E"
              secondaryColor="#3B82F6"
            />
          </div>

          {/* Breakdown Table */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Withdrawal Breakdown</h3>
            <DataTable columns={tableColumns} data={results.monthlyBreakdown} maxRows={6} />
          </div>

          {/* Sustainability Analysis */}
          <div className="bg-primary/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-2">Sustainability Analysis</h3>
            <div className="space-y-2 text-sm text-muted">
              <p>
                <strong>Safe Withdrawal Rate:</strong> To make your corpus last indefinitely,
                withdraw maximum <strong className="text-navy-700">{formatCurrency(Math.round(investmentAmount * expectedReturn / 100 / 12))}/month</strong>
              </p>
              <p>
                <strong>Current Withdrawal Rate:</strong>{" "}
                <span className={results.willLastForever ? "text-green-600" : "text-amber-600"}>
                  {((monthlyWithdrawal * 12 / investmentAmount) * 100).toFixed(2)}% per year
                </span>
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ViewToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />

      <NumberInput
        label="Investment Amount (Corpus)"
        value={investmentAmount}
        onChange={setInvestmentAmount}
        prefix="₹"
        min={100000}
      />

      <NumberInput
        label="Monthly Withdrawal"
        value={monthlyWithdrawal}
        onChange={setMonthlyWithdrawal}
        prefix="₹"
        min={1000}
      />

      <SliderInput
        label="Expected Return (p.a.)"
        value={expectedReturn}
        onChange={setExpectedReturn}
        min={4}
        max={15}
        step={0.5}
        unit="%"
      />

      {isAdvanced && (
        <>
          <div className="border-t border-card-border my-6 pt-6">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Advanced Options</h3>

            <SelectInput
              label="Withdrawal Frequency"
              value={withdrawalFrequency}
              onChange={setWithdrawalFrequency}
              options={frequencyOptions}
            />

            <ToggleInput
              label="Inflation Adjustment"
              checked={inflationAdjustment}
              onChange={setInflationAdjustment}
              description="Increase withdrawal annually for inflation"
            />

            {inflationAdjustment && (
              <SliderInput
                label="Annual Increase"
                value={inflationRate}
                onChange={setInflationRate}
                min={3}
                max={10}
                step={0.5}
                unit="%"
              />
            )}

            <ToggleInput
              label="Consider LTCG Tax"
              checked={considerTax}
              onChange={setConsiderTax}
              description="10% tax on gains above ₹1 Lakh"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}


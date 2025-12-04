"use client";

import React, { useState, useMemo } from "react";
import { Plane, Calendar, Wallet, Target, TrendingUp, Repeat } from "lucide-react";
import {
  CalculatorLayout,
  SliderInput,
  NumberInput,
  ViewToggle,
  ToggleInput,
  SelectInput,
  ResultCard,
} from "@/components/calculators/CalculatorLayout";
import { LineChart } from "@/components/calculators/Charts";
import { calculateVacationFund, formatCurrency } from "@/lib/calculations";
import { formatCurrencyPDF, type PDFConfig } from "@/lib/pdfGenerator";
import { motion } from "framer-motion";

export default function VacationCalculator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Traditional inputs
  const [vacationBudget, setVacationBudget] = useState(200000);
  const [monthsToSave, setMonthsToSave] = useState(12);
  const [expectedReturn, setExpectedReturn] = useState(7);
  
  // Advanced inputs
  const [inflationRate, setInflationRate] = useState(6);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("yearly");
  const [existingFund, setExistingFund] = useState(0);

  const results = useMemo(() => {
    const inflation = isAdvanced ? inflationRate : 0;
    const existing = isAdvanced ? existingFund : 0;
    
    return calculateVacationFund(
      vacationBudget,
      monthsToSave,
      expectedReturn,
      inflation,
      existing
    );
  }, [vacationBudget, monthsToSave, expectedReturn, inflationRate, existingFund, isAdvanced]);

  const chartData = useMemo(() => {
    return results.progressData.map((row) => ({
      label: row.month === 0 ? "Now" : `M${row.month}`,
      value: row.saved,
      secondaryValue: row.target,
    }));
  }, [results.progressData]);

  const frequencyOptions = [
    { value: "yearly", label: "Every Year" },
    { value: "2years", label: "Every 2 Years" },
    { value: "3years", label: "Every 3 Years" },
  ];

  const progressPercentage = Math.min(100, (results.progressData[results.progressData.length - 1]?.saved || 0) / results.futureTarget * 100);

  // PDF Configuration
  const pdfConfig: Omit<PDFConfig, 'calculatorName' | 'calculatorDescription' | 'assumptions'> = {
    inputs: [
      { label: "Vacation Budget", value: `₹${vacationBudget.toLocaleString('en-IN')}` },
      { label: "Time to Save", value: monthsToSave, unit: " months" },
      { label: "Expected Return", value: expectedReturn, unit: "% p.a." },
      ...(isAdvanced ? [
        { label: "Travel Cost Inflation", value: inflationRate, unit: "%" },
        { label: "Existing Fund", value: `₹${existingFund.toLocaleString('en-IN')}` },
        { label: "Recurring Vacation", value: isRecurring ? `Yes (${recurringFrequency === "yearly" ? "Yearly" : recurringFrequency === "2years" ? "Every 2 Years" : "Every 3 Years"})` : "No" },
      ] : []),
    ],
    results: [
      { label: "Vacation Fund Goal", value: formatCurrencyPDF(results.futureTarget), highlight: true },
      { label: "Monthly Savings Needed", value: formatCurrencyPDF(results.monthlyRequired), subValue: `₹${Math.round(results.monthlyRequired / 30).toLocaleString('en-IN')}/day` },
      { label: "Current Budget", value: formatCurrencyPDF(vacationBudget) },
      { label: "Progress", value: `${progressPercentage.toFixed(0)}%` },
    ],
  };

  return (
    <CalculatorLayout
      title="Vacation Calculator"
      description="Save systematically for your dream vacation"
      icon={<Plane className="w-7 h-7 text-white" />}
      color="from-rose-500 to-pink-500"
      assumptions={[
        `Expected return on savings: ${expectedReturn}% per annum`,
        isAdvanced && inflationRate > 0 ? `Travel cost inflation: ${inflationRate}% per annum` : "No inflation adjustment",
        "Savings invested at month start",
        isAdvanced && existingFund > 0 ? `Existing fund of ₹${existingFund.toLocaleString('en-IN')} considered` : "Starting from zero",
      ]}
      howItWorks="The vacation calculator helps you plan savings for your dream trip. It calculates the monthly amount you need to save, factoring in investment returns. In advanced mode, it also considers travel cost inflation to ensure your target amount is adequate when you're ready to travel."
      relatedCalculators={[
        { name: "Travel Budget Calculator", href: "/tools/travel" },
        { name: "SIP Calculator", href: "/tools/sip" },
        { name: "Child Education Calculator", href: "/tools/education" },
      ]}
      pdfConfig={pdfConfig}
      results={
        <div className="space-y-6">
          {/* Vacation Fund Goal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Plane className="w-6 h-6 text-rose-500" />
              <p className="text-sm text-rose-700 font-medium">Your Vacation Fund Goal</p>
            </div>
            <div className="text-4xl font-heading font-bold text-rose-600">
              {formatCurrency(results.futureTarget)}
            </div>
            <p className="text-sm text-rose-600 mt-2">
              Ready in {monthsToSave} months! 🌴
            </p>
          </motion.div>

          {/* Monthly Savings Needed */}
          <div className="bg-white rounded-2xl border border-card-border shadow-md p-6 text-center">
            <p className="text-sm text-muted mb-2">Save This Much Monthly</p>
            <div className="text-5xl font-heading font-bold text-accent">
              {formatCurrency(results.monthlyRequired)}
            </div>
            <p className="text-sm text-muted mt-2">
              That's ₹{Math.round(results.monthlyRequired / 30).toLocaleString('en-IN')}/day
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="bg-background rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-navy-700">Savings Progress</h3>
              <span className="text-sm text-accent font-medium">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted">
              <span>₹0</span>
              <span>{formatCurrency(results.futureTarget)}</span>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Monthly Savings"
              value={formatCurrency(results.monthlyRequired)}
              icon={<Wallet className="w-5 h-5" />}
              color="text-accent"
            />
            <ResultCard
              label="Time to Goal"
              value={`${monthsToSave} months`}
              subValue={monthsToSave >= 12 ? `≈ ${(monthsToSave/12).toFixed(1)} years` : ""}
              icon={<Calendar className="w-5 h-5" />}
            />
            <ResultCard
              label="Current Budget"
              value={formatCurrency(vacationBudget)}
              icon={<Target className="w-5 h-5" />}
            />
            <ResultCard
              label="With Returns"
              value={formatCurrency(results.futureTarget)}
              subValue={`+${formatCurrency(results.futureTarget - vacationBudget)} extra`}
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>

          {/* Savings Chart */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Fund Growth Projection</h3>
            <LineChart
              data={chartData}
              formatValue={(v) => formatCurrency(v)}
              primaryLabel="Saved Amount"
              secondaryLabel="Target"
              primaryColor="#F43F5E"
              secondaryColor="#E5E7EB"
            />
          </div>

          {/* Recurring Vacation Info */}
          {isAdvanced && isRecurring && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Repeat className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-medium text-blue-800">Recurring Vacation Fund</h3>
              </div>
              <p className="text-sm text-blue-700">
                For a vacation <strong>{recurringFrequency === "yearly" ? "every year" : recurringFrequency === "2years" ? "every 2 years" : "every 3 years"}</strong>,
                maintain a monthly savings of <strong>{formatCurrency(results.monthlyRequired)}</strong> continuously.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-primary/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-2">✈️ Smart Travel Saving Tips</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Set up an <strong>automatic transfer</strong> to your vacation fund on salary day
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Use <strong>liquid funds</strong> instead of savings account for better returns (6-7% vs 3%)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Book flights <strong>2-3 months in advance</strong> for best deals
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <ViewToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />

      <NumberInput
        label="Vacation Budget"
        value={vacationBudget}
        onChange={setVacationBudget}
        prefix="₹"
        min={10000}
      />

      <SliderInput
        label="Time to Save"
        value={monthsToSave}
        onChange={setMonthsToSave}
        min={1}
        max={60}
        unit=" months"
        formatValue={(v) => v >= 12 ? `${Math.floor(v/12)} yr ${v%12} mo` : `${v} months`}
      />

      <SliderInput
        label="Expected Return (p.a.)"
        value={expectedReturn}
        onChange={setExpectedReturn}
        min={3}
        max={12}
        step={0.5}
        unit="%"
      />

      {isAdvanced && (
        <>
          <div className="border-t border-card-border my-6 pt-6">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Advanced Options</h3>

            <SliderInput
              label="Travel Cost Inflation"
              value={inflationRate}
              onChange={setInflationRate}
              min={0}
              max={12}
              step={0.5}
              unit="%"
            />

            <NumberInput
              label="Existing Vacation Fund"
              value={existingFund}
              onChange={setExistingFund}
              prefix="₹"
              min={0}
            />

            <ToggleInput
              label="Recurring Vacation"
              checked={isRecurring}
              onChange={setIsRecurring}
              description="Plan for regular vacations"
            />

            {isRecurring && (
              <SelectInput
                label="Vacation Frequency"
                value={recurringFrequency}
                onChange={setRecurringFrequency}
                options={frequencyOptions}
              />
            )}
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}


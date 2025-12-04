"use client";

import React, { useState, useMemo } from "react";
import { Clock, AlertTriangle, TrendingUp, Target } from "lucide-react";
import {
  CalculatorLayout,
  SliderInput,
  NumberInput,
  ViewToggle,
  ToggleInput,
  ResultCard,
} from "@/components/calculators/CalculatorLayout";
import { DataTable } from "@/components/calculators/Charts";
import { calculateSIPDelayCost, formatCurrency } from "@/lib/calculations";
import { motion } from "framer-motion";

export default function SIPDelayCalculator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Traditional inputs
  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [investmentPeriod, setInvestmentPeriod] = useState(20);
  const [delayPeriod, setDelayPeriod] = useState(12);
  const [expectedReturn, setExpectedReturn] = useState(12);
  
  // Advanced inputs
  const [targetCorpus, setTargetCorpus] = useState(0);
  const [useTargetCorpus, setUseTargetCorpus] = useState(false);
  const [showStepUp, setShowStepUp] = useState(false);
  const [stepUpRate, setStepUpRate] = useState(10);

  const results = useMemo(() => {
    return calculateSIPDelayCost(
      monthlySIP,
      investmentPeriod,
      delayPeriod,
      expectedReturn
    );
  }, [monthlySIP, investmentPeriod, delayPeriod, expectedReturn]);

  const costPercentage = ((results.costOfDelay / results.withoutDelay) * 100).toFixed(1);
  const extraSIPPercentage = ((results.extraSIPNeeded / monthlySIP) * 100).toFixed(0);

  const tableColumns = [
    { key: "delayMonths", header: "Delay", align: "center" as const, format: (v: number) => v === 0 ? "No Delay" : `${v} months` },
    { key: "finalValue", header: "Final Value", align: "right" as const, format: (v: number) => formatCurrency(v) },
    { key: "loss", header: "Loss", align: "right" as const, format: (v: number) => v === 0 ? "-" : formatCurrency(v) },
    { key: "extraSIPNeeded", header: "Extra SIP/Month", align: "right" as const, format: (v: number) => v === 0 ? "-" : `+₹${v.toLocaleString('en-IN')}` },
  ];

  return (
    <CalculatorLayout
      title="SIP Delay Calculator"
      description="Understand the cost of delaying your investments and how to recover"
      icon={<Clock className="w-7 h-7 text-white" />}
      color="from-amber-500 to-yellow-500"
      assumptions={[
        `Expected return: ${expectedReturn}% per annum`,
        "Returns are compounded monthly",
        "SIP amount remains constant (unless step-up selected)",
        `Original investment period: ${investmentPeriod} years`,
      ]}
      howItWorks="This calculator compares the future value of your SIP with and without delay. The 'cost of delay' shows how much less you'll accumulate due to late start. It also calculates the extra monthly SIP required to catch up and achieve the same corpus despite the delay."
      relatedCalculators={[
        { name: "SIP Calculator", href: "/tools/sip" },
        { name: "Retirement Calculator", href: "/tools/retirement" },
        { name: "Child Education Calculator", href: "/tools/education" },
      ]}
      results={
        <div className="space-y-6">
          {/* Cost of Delay - Prominent Warning */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-200 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <p className="text-sm text-red-700 font-medium">Cost of Delaying {delayPeriod} Months</p>
            </div>
            <div className="text-4xl font-heading font-bold text-red-600">
              {formatCurrency(results.costOfDelay)}
            </div>
            <p className="text-sm text-red-600 mt-2">
              That's <strong>{costPercentage}%</strong> of your potential wealth lost!
            </p>
          </motion.div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Without Delay"
              value={formatCurrency(results.withoutDelay)}
              subValue={`${investmentPeriod} years of SIP`}
              icon={<TrendingUp className="w-5 h-5" />}
              color="text-green-600"
            />
            <ResultCard
              label="With Delay"
              value={formatCurrency(results.withDelay)}
              subValue={`${(investmentPeriod - delayPeriod/12).toFixed(1)} years of SIP`}
              icon={<Clock className="w-5 h-5" />}
              color="text-amber-600"
            />
          </div>

          {/* Recovery Plan */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Recovery Plan
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              To still achieve <strong>{formatCurrency(results.withoutDelay)}</strong> despite the {delayPeriod}-month delay:
            </p>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-muted mb-1">Increase your SIP to</p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{(monthlySIP + results.extraSIPNeeded).toLocaleString('en-IN')}/month
              </p>
              <p className="text-sm text-blue-600 mt-1">
                (+{extraSIPPercentage}% or ₹{results.extraSIPNeeded.toLocaleString('en-IN')} extra)
              </p>
            </div>
          </div>

          {/* Comparison Visual */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Visual Comparison</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted">Without Delay</span>
                  <span className="font-medium text-green-600">{formatCurrency(results.withoutDelay)}</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted">With {delayPeriod} Month Delay</span>
                  <span className="font-medium text-amber-600">{formatCurrency(results.withDelay)}</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(results.withDelay / results.withoutDelay) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delay Scenarios Table */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Delay Scenarios Comparison</h3>
            <DataTable columns={tableColumns} data={results.delayScenarios} maxRows={6} />
          </div>

          {/* Key Insight */}
          <div className="bg-primary/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-2">💡 Key Insight</h3>
            <p className="text-sm text-muted">
              Time in the market beats timing the market. Every month of delay costs you approximately{" "}
              <strong className="text-navy-700">
                {formatCurrency(Math.round(results.costOfDelay / delayPeriod))}
              </strong>{" "}
              in potential wealth. The best time to start investing was yesterday. The second best time is today!
            </p>
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
        label="Total Investment Period"
        value={investmentPeriod}
        onChange={setInvestmentPeriod}
        min={5}
        max={40}
        unit=" years"
      />

      <SliderInput
        label="Delay Period"
        value={delayPeriod}
        onChange={setDelayPeriod}
        min={1}
        max={Math.min(120, (investmentPeriod - 1) * 12)}
        unit=" months"
        formatValue={(v) => v >= 12 ? `${Math.floor(v/12)} yr ${v%12} mo` : `${v} months`}
      />

      <SliderInput
        label="Expected Return (p.a.)"
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
            <h3 className="text-sm font-medium text-navy-700 mb-4">Advanced Options</h3>

            <ToggleInput
              label="Use Target Corpus"
              checked={useTargetCorpus}
              onChange={setUseTargetCorpus}
              description="Calculate SIP needed for a specific goal"
            />

            {useTargetCorpus && (
              <NumberInput
                label="Target Corpus"
                value={targetCorpus}
                onChange={setTargetCorpus}
                prefix="₹"
                min={100000}
              />
            )}

            <ToggleInput
              label="Include Step-up Analysis"
              checked={showStepUp}
              onChange={setShowStepUp}
              description="See how step-up SIP can help recover"
            />

            {showStepUp && (
              <SliderInput
                label="Annual Step-up Rate"
                value={stepUpRate}
                onChange={setStepUpRate}
                min={5}
                max={25}
                unit="%"
              />
            )}
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}


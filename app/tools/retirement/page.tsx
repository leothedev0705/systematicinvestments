"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Download,
  Printer,
  Save,
  PiggyBank,
  TrendingUp,
  Calendar,
  Wallet,
  Target,
  ChevronDown,
  ChevronUp,
  Info,
  Settings,
} from "lucide-react";
import { RetirementCalculatorService } from "@/lib/features/retirement/calculator_service";
import { RetirementInputs, RetirementResult } from "@/lib/features/retirement/models";
import { CurrencyField, PercentSliderField, PercentFieldWithProgress, KeyValueTile, SummaryStat, COLORS } from "@/lib/features/retirement/widgets";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatCurrencyPDF, generateCalculatorPDF, type PDFConfig } from "@/lib/pdfGenerator";
import { LineChart } from "@/components/calculators/Charts";

// Color palette matching Dart version
const primaryGold = COLORS.primaryGold;
const deepBlue = COLORS.deepBlue;
const retirementBlue = COLORS.retirementBlue;

export default function RetirementCalculatorPage() {
  // View toggle - DEFAULT is Simplified View
  const [isSimplifiedView, setIsSimplifiedView] = useState(true);

  // ========== SIMPLIFIED VIEW CONTROLLERS ==========
  const [simplifiedPresentAge, setSimplifiedPresentAge] = useState(30);
  const [simplifiedRetireAge, setSimplifiedRetireAge] = useState(60);
  const [simplifiedMonthlyExpense, setSimplifiedMonthlyExpense] = useState(50000);
  const [simplifiedSavingsIncrease, setSimplifiedSavingsIncrease] = useState(8);
  const [simplifiedStepUpAmount, setSimplifiedStepUpAmount] = useState(10);
  const [simplifiedStepUpType, setSimplifiedStepUpType] = useState<'%' | '₹'>('%');
  const [simplifiedStepUpFrequency, setSimplifiedStepUpFrequency] = useState<'Half' | 'One' | 'Two' | 'Three'>('One');
  const [simplifiedExistingInvestment, setSimplifiedExistingInvestment] = useState(500000);
  const [simplifiedExistingReturn, setSimplifiedExistingReturn] = useState(10);
  const [simplifiedLifeExpectancy, setSimplifiedLifeExpectancy] = useState(85);
  const [simplifiedPreRetInflation, setSimplifiedPreRetInflation] = useState(6);
  const [simplifiedPostRetInflation, setSimplifiedPostRetInflation] = useState(5);
  const [simplifiedPostRetReturn, setSimplifiedPostRetReturn] = useState(8);

  // Collapsible sections
  const [showStepUpSection, setShowStepUpSection] = useState(false);
  const [showExistingInvestmentSection, setShowExistingInvestmentSection] = useState(false);
  const [showAssumptionsSection, setShowAssumptionsSection] = useState(false);

  // ========== ADVANCED VIEW CONTROLLERS ==========
  const [presentAge, setPresentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlyExpenseToday, setMonthlyExpenseToday] = useState(50000);
  const [existingInvestment, setExistingInvestment] = useState(0);
  const [existingReturn, setExistingReturn] = useState(12);
  const [preRetReturn, setPreRetReturn] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [postRetInflation, setPostRetInflation] = useState(6);
  const [postRetReturn, setPostRetReturn] = useState(8);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [stepUpPerYear, setStepUpPerYear] = useState(0);
  const [stepUpPercent, setStepUpPercent] = useState(0);

  // Advanced collapsible sections
  const [showAdvancedAssumptions, setShowAdvancedAssumptions] = useState(false);
  const [showAdvancedExistingInvestment, setShowAdvancedExistingInvestment] = useState(false);
  const [showAdvancedStepUp, setShowAdvancedStepUp] = useState(false);

  // ========== COMPUTE RESULTS ==========
  const results = useMemo(() => {
    let inputs: RetirementInputs;

    if (isSimplifiedView) {
      // Map simplified inputs to advanced inputs
      const stepUpAmount = simplifiedStepUpType === '%' 
        ? (simplifiedMonthlyExpense * simplifiedStepUpAmount / 100)
        : simplifiedStepUpAmount;
      
      inputs = {
        presentAge: simplifiedPresentAge,
        retireAge: simplifiedRetireAge,
        lifeExpectancy: simplifiedLifeExpectancy,
        monthlyExpenseToday: simplifiedMonthlyExpense,
        inflationPercent: simplifiedPreRetInflation,
        postRetInflationPercent: simplifiedPostRetInflation,
        preRetReturnPercent: simplifiedSavingsIncrease,
        existingAmount: simplifiedExistingInvestment,
        existingReturnPercent: simplifiedExistingReturn,
        postRetReturnPercent: simplifiedPostRetReturn,
        stepUpPerYear: simplifiedStepUpType === '₹' ? stepUpAmount : 0,
        stepUpPercent: simplifiedStepUpType === '%' ? simplifiedStepUpAmount : 0,
      };
    } else {
      inputs = {
        presentAge,
        retireAge,
        lifeExpectancy,
        monthlyExpenseToday,
        inflationPercent: inflation,
        postRetInflationPercent: postRetInflation,
        preRetReturnPercent: preRetReturn,
        existingAmount: existingInvestment,
        existingReturnPercent: existingReturn,
        postRetReturnPercent: postRetReturn,
        stepUpPerYear,
        stepUpPercent,
      };
    }

    return RetirementCalculatorService.compute(inputs);
  }, [
    isSimplifiedView,
    // Simplified inputs
    simplifiedPresentAge,
    simplifiedRetireAge,
    simplifiedMonthlyExpense,
    simplifiedSavingsIncrease,
    simplifiedStepUpAmount,
    simplifiedStepUpType,
    simplifiedExistingInvestment,
    simplifiedExistingReturn,
    simplifiedLifeExpectancy,
    simplifiedPreRetInflation,
    simplifiedPostRetInflation,
    simplifiedPostRetReturn,
    // Advanced inputs
    presentAge,
    retireAge,
    monthlyExpenseToday,
    existingInvestment,
    existingReturn,
    preRetReturn,
    inflation,
    postRetInflation,
    postRetReturn,
    lifeExpectancy,
    stepUpPerYear,
    stepUpPercent,
  ]);

  // ========== PDF GENERATION ==========
  const handleDownloadPDF = async () => {
    const pdfConfig: PDFConfig = {
      calculatorName: "Retirement Calculator",
      inputs: isSimplifiedView ? [
        { label: "Monthly Expense Today", value: `Rs. ${simplifiedMonthlyExpense.toLocaleString('en-IN')}` },
        { label: "Expected Savings Increase", value: `${simplifiedSavingsIncrease}%` },
        { label: "Life Expectancy", value: `${simplifiedLifeExpectancy} years` },
        { label: "Existing Investment", value: `Rs. ${simplifiedExistingInvestment.toLocaleString('en-IN')}` },
      ] : [
        { label: "Present Age", value: `${presentAge} years` },
        { label: "Retirement Age", value: `${retireAge} years` },
        { label: "Monthly Expense Today", value: `Rs. ${monthlyExpenseToday.toLocaleString('en-IN')}` },
        { label: "Life Expectancy", value: `${lifeExpectancy} years` },
        { label: "Pre-retirement Return", value: `${preRetReturn}%` },
        { label: "Post-retirement Return", value: `${postRetReturn}%` },
        { label: "Inflation Rate", value: `${inflation}%` },
      ],
      results: [
        { label: "Retirement Corpus Needed", value: formatCurrencyPDF(results.corpusNeeded), highlight: true },
        { label: "Monthly SIP Required", value: formatCurrencyPDF(results.monthlyRequired) },
        { label: "Yearly SIP Required", value: formatCurrencyPDF(results.yearlyRequired) },
        { label: "Lumpsum Now", value: formatCurrencyPDF(results.lumpSumNow) },
        { label: "Monthly Expense at Retirement", value: formatCurrencyPDF(results.monthlyExpenseAtRet) },
        { label: "Future Value of Existing", value: formatCurrencyPDF(results.fvExisting) },
        { label: "Shortfall", value: formatCurrencyPDF(results.shortfall) },
      ],
    };
    await generateCalculatorPDF(pdfConfig).catch(console.error);
  };

  // ========== PRINT FUNCTIONALITY ==========
  const handlePrint = () => {
    window.print();
  };

  // ========== SAVE FUNCTIONALITY ==========
  const handleSave = () => {
    const dataToSave = {
      inputs: isSimplifiedView ? {
        simplifiedMonthlyExpense,
        simplifiedSavingsIncrease,
        simplifiedStepUpAmount,
        simplifiedStepUpType,
        simplifiedExistingInvestment,
        simplifiedExistingReturn,
        simplifiedLifeExpectancy,
        simplifiedPreRetInflation,
        simplifiedPostRetInflation,
        simplifiedPostRetReturn,
      } : {
        presentAge,
        retireAge,
        monthlyExpenseToday,
        existingInvestment,
        existingReturn,
        preRetReturn,
        inflation,
        postRetInflation,
        postRetReturn,
        lifeExpectancy,
        stepUpPerYear,
        stepUpPercent,
      },
      results,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('retirement_calculator_save', JSON.stringify(dataToSave));
    alert('Calculation saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/tools" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Tools</span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Infinity Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PiggyBank className="w-8 h-8" style={{ color: retirementBlue }} />
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: deepBlue }}>
              Retirement Calculator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Plan your retirement corpus and monthly SIP needed for a secure future
          </p>
        </div>

        {/* View Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-xl p-1 border border-gray-200 inline-flex">
            <button
              onClick={() => setIsSimplifiedView(true)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isSimplifiedView
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Simplified
            </button>
            <button
              onClick={() => setIsSimplifiedView(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                !isSimplifiedView
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            {isSimplifiedView ? (
              <SimplifiedForm
                presentAge={simplifiedPresentAge}
                setPresentAge={setSimplifiedPresentAge}
                retireAge={simplifiedRetireAge}
                setRetireAge={setSimplifiedRetireAge}
                monthlyExpense={simplifiedMonthlyExpense}
                setMonthlyExpense={setSimplifiedMonthlyExpense}
                savingsIncrease={simplifiedSavingsIncrease}
                setSavingsIncrease={setSimplifiedSavingsIncrease}
                stepUpAmount={simplifiedStepUpAmount}
                setStepUpAmount={setSimplifiedStepUpAmount}
                stepUpType={simplifiedStepUpType}
                setStepUpType={setSimplifiedStepUpType}
                stepUpFrequency={simplifiedStepUpFrequency}
                setStepUpFrequency={setSimplifiedStepUpFrequency}
                existingInvestment={simplifiedExistingInvestment}
                setExistingInvestment={setSimplifiedExistingInvestment}
                existingReturn={simplifiedExistingReturn}
                setExistingReturn={setSimplifiedExistingReturn}
                lifeExpectancy={simplifiedLifeExpectancy}
                setLifeExpectancy={setSimplifiedLifeExpectancy}
                preRetInflation={simplifiedPreRetInflation}
                setPreRetInflation={setSimplifiedPreRetInflation}
                postRetInflation={simplifiedPostRetInflation}
                setPostRetInflation={setSimplifiedPostRetInflation}
                postRetReturn={simplifiedPostRetReturn}
                setPostRetReturn={setSimplifiedPostRetReturn}
                showStepUpSection={showStepUpSection}
                setShowStepUpSection={setShowStepUpSection}
                showExistingInvestmentSection={showExistingInvestmentSection}
                setShowExistingInvestmentSection={setShowExistingInvestmentSection}
                showAssumptionsSection={showAssumptionsSection}
                setShowAssumptionsSection={setShowAssumptionsSection}
              />
            ) : (
              <AdvancedForm
                presentAge={presentAge}
                setPresentAge={setPresentAge}
                retireAge={retireAge}
                setRetireAge={setRetireAge}
                monthlyExpenseToday={monthlyExpenseToday}
                setMonthlyExpenseToday={setMonthlyExpenseToday}
                existingInvestment={existingInvestment}
                setExistingInvestment={setExistingInvestment}
                existingReturn={existingReturn}
                setExistingReturn={setExistingReturn}
                preRetReturn={preRetReturn}
                setPreRetReturn={setPreRetReturn}
                inflation={inflation}
                setInflation={setInflation}
                postRetInflation={postRetInflation}
                setPostRetInflation={setPostRetInflation}
                postRetReturn={postRetReturn}
                setPostRetReturn={setPostRetReturn}
                lifeExpectancy={lifeExpectancy}
                setLifeExpectancy={setLifeExpectancy}
                stepUpPerYear={stepUpPerYear}
                setStepUpPerYear={setStepUpPerYear}
                stepUpPercent={stepUpPercent}
                setStepUpPercent={setStepUpPercent}
                showAdvancedAssumptions={showAdvancedAssumptions}
                setShowAdvancedAssumptions={setShowAdvancedAssumptions}
                showAdvancedExistingInvestment={showAdvancedExistingInvestment}
                setShowAdvancedExistingInvestment={setShowAdvancedExistingInvestment}
                showAdvancedStepUp={showAdvancedStepUp}
                setShowAdvancedStepUp={setShowAdvancedStepUp}
              />
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <ResultsPanel results={results} isSimplified={isSimplifiedView} />
          </div>
        </div>
      </main>
    </div>
  );
}

// ========== SIMPLIFIED FORM COMPONENT ==========
interface SimplifiedFormProps {
  presentAge: number;
  setPresentAge: (v: number) => void;
  retireAge: number;
  setRetireAge: (v: number) => void;
  monthlyExpense: number;
  setMonthlyExpense: (v: number) => void;
  savingsIncrease: number;
  setSavingsIncrease: (v: number) => void;
  stepUpAmount: number;
  setStepUpAmount: (v: number) => void;
  stepUpType: '%' | '₹';
  setStepUpType: (v: '%' | '₹') => void;
  stepUpFrequency: 'Half' | 'One' | 'Two' | 'Three';
  setStepUpFrequency: (v: 'Half' | 'One' | 'Two' | 'Three') => void;
  existingInvestment: number;
  setExistingInvestment: (v: number) => void;
  existingReturn: number;
  setExistingReturn: (v: number) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (v: number) => void;
  preRetInflation: number;
  setPreRetInflation: (v: number) => void;
  postRetInflation: number;
  setPostRetInflation: (v: number) => void;
  postRetReturn: number;
  setPostRetReturn: (v: number) => void;
  showStepUpSection: boolean;
  setShowStepUpSection: (v: boolean) => void;
  showExistingInvestmentSection: boolean;
  setShowExistingInvestmentSection: (v: boolean) => void;
  showAssumptionsSection: boolean;
  setShowAssumptionsSection: (v: boolean) => void;
}

function SimplifiedForm(props: SimplifiedFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
    >
      {/* Natural Language Inputs */}
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700 mb-2">I am currently</p>
            <input
              type="number"
              value={props.presentAge || ''}
              onChange={(e) => props.setPresentAge(parseInt(e.target.value) || 0)}
              min={0}
              max={70}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-1">years old</p>
          </div>
          <div>
            <p className="text-gray-700 mb-2">I want to retire at</p>
            <input
              type="number"
              value={props.retireAge || ''}
              onChange={(e) => props.setRetireAge(parseInt(e.target.value) || 0)}
              min={0}
              max={75}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-1">years</p>
          </div>
        </div>
        <div>
          <p className="text-gray-700 mb-2">I currently spend</p>
          <CurrencyField
            label=""
            value={props.monthlyExpense}
            onChange={props.setMonthlyExpense}
            min={0}
          />
          <p className="text-sm text-gray-500 mt-1">per month on expenses</p>
        </div>

        <div>
          <p className="text-gray-700 mb-2">I expect my savings to grow by</p>
          <PercentFieldWithProgress
            value={props.savingsIncrease}
            onChange={props.setSavingsIncrease}
            maxValue={20}
            min={0}
          />
          <p className="text-sm text-gray-500 mt-1">per year</p>
        </div>
      </div>

      {/* Collapsible Step-up Section */}
      <PremiumCollapsibleSection
        title="Step-up Options"
        isOpen={props.showStepUpSection}
        onToggle={() => props.setShowStepUpSection(!props.showStepUpSection)}
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-2">Step-up Type</p>
            <select
              value={props.stepUpType}
              onChange={(e) => props.setStepUpType(e.target.value as '%' | '₹')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="%">Percentage (%)</option>
              <option value="₹">Absolute (₹)</option>
            </select>
          </div>
          {props.stepUpType === '%' ? (
            <div>
              <p className="text-gray-700 mb-2">Step-up Percentage</p>
              <PercentFieldWithProgress
                value={props.stepUpAmount}
                onChange={props.setStepUpAmount}
                maxValue={20}
                min={0}
              />
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-2">Step-up Amount</p>
              <CurrencyField
                label=""
                value={props.stepUpAmount}
                onChange={props.setStepUpAmount}
                min={0}
              />
            </div>
          )}
        </div>
      </PremiumCollapsibleSection>

      {/* Collapsible Existing Investment Section */}
      <PremiumCollapsibleSection
        title="Existing Investment"
        isOpen={props.showExistingInvestmentSection}
        onToggle={() => props.setShowExistingInvestmentSection(!props.showExistingInvestmentSection)}
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-2">Current Retirement Savings</p>
            <CurrencyField
              label=""
              value={props.existingInvestment}
              onChange={props.setExistingInvestment}
              min={0}
            />
          </div>
          <div>
            <p className="text-gray-700 mb-2">Expected Return on Existing</p>
            <PercentFieldWithProgress
              value={props.existingReturn}
              onChange={props.setExistingReturn}
              maxValue={20}
              min={0}
            />
          </div>
        </div>
      </PremiumCollapsibleSection>

      {/* Collapsible Assumptions Section */}
      <PremiumCollapsibleSection
        title="Assumptions"
        isOpen={props.showAssumptionsSection}
        onToggle={() => props.setShowAssumptionsSection(!props.showAssumptionsSection)}
      >
        <div className="space-y-6">
          <div>
            <p className="text-gray-700 mb-2">Life Expectancy</p>
            <input
              type="number"
              value={props.lifeExpectancy}
              onChange={(e) => props.setLifeExpectancy(parseInt(e.target.value) || 0)}
              min={0}
              max={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <p className="text-gray-700 mb-2">Pre-retirement Inflation</p>
            <PercentFieldWithProgress
              value={props.preRetInflation}
              onChange={props.setPreRetInflation}
              maxValue={10}
              min={0}
            />
          </div>
          <div>
            <p className="text-gray-700 mb-2">Post-retirement Inflation</p>
            <PercentFieldWithProgress
              value={props.postRetInflation}
              onChange={props.setPostRetInflation}
              maxValue={10}
              min={0}
            />
          </div>
          <div>
            <p className="text-gray-700 mb-2">Post-retirement Return</p>
            <PercentFieldWithProgress
              value={props.postRetReturn}
              onChange={props.setPostRetReturn}
              maxValue={12}
              min={0}
            />
          </div>
        </div>
      </PremiumCollapsibleSection>
    </motion.div>
  );
}

// ========== ADVANCED FORM COMPONENT ==========
interface AdvancedFormProps {
  presentAge: number;
  setPresentAge: (v: number) => void;
  retireAge: number;
  setRetireAge: (v: number) => void;
  monthlyExpenseToday: number;
  setMonthlyExpenseToday: (v: number) => void;
  existingInvestment: number;
  setExistingInvestment: (v: number) => void;
  existingReturn: number;
  setExistingReturn: (v: number) => void;
  preRetReturn: number;
  setPreRetReturn: (v: number) => void;
  inflation: number;
  setInflation: (v: number) => void;
  postRetInflation: number;
  setPostRetInflation: (v: number) => void;
  postRetReturn: number;
  setPostRetReturn: (v: number) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (v: number) => void;
  stepUpPerYear: number;
  setStepUpPerYear: (v: number) => void;
  stepUpPercent: number;
  setStepUpPercent: (v: number) => void;
  showAdvancedAssumptions: boolean;
  setShowAdvancedAssumptions: (v: boolean) => void;
  showAdvancedExistingInvestment: boolean;
  setShowAdvancedExistingInvestment: (v: boolean) => void;
  showAdvancedStepUp: boolean;
  setShowAdvancedStepUp: (v: boolean) => void;
}

function AdvancedForm(props: AdvancedFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Present Age</label>
          <input
            type="number"
            value={props.presentAge}
            onChange={(e) => props.setPresentAge(parseInt(e.target.value) || 30)}
            min={18}
            max={70}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
          <input
            type="number"
            value={props.retireAge}
            onChange={(e) => props.setRetireAge(parseInt(e.target.value) || 60)}
            min={props.presentAge + 1}
            max={75}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <CurrencyField
          label="Monthly Expense Today"
          value={props.monthlyExpenseToday}
          onChange={props.setMonthlyExpenseToday}
          min={0}
        />
        <PercentSliderField
          label="Pre-retirement Return"
          value={props.preRetReturn}
          onChange={props.setPreRetReturn}
          min={0}
          max={20}
        />
      </div>

      {/* Collapsible Assumptions */}
      <CollapsibleSection
        title="Assumptions"
        isOpen={props.showAdvancedAssumptions}
        onToggle={() => props.setShowAdvancedAssumptions(!props.showAdvancedAssumptions)}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Life Expectancy</label>
            <input
              type="number"
              value={props.lifeExpectancy}
              onChange={(e) => props.setLifeExpectancy(parseInt(e.target.value) || 85)}
              min={props.retireAge + 5}
              max={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <PercentSliderField
            label="Inflation Rate"
            value={props.inflation}
            onChange={props.setInflation}
            min={0}
            max={10}
          />
          <PercentSliderField
            label="Post-retirement Inflation"
            value={props.postRetInflation}
            onChange={props.setPostRetInflation}
            min={0}
            max={10}
          />
          <PercentSliderField
            label="Post-retirement Return"
            value={props.postRetReturn}
            onChange={props.setPostRetReturn}
            min={0}
            max={12}
          />
        </div>
      </CollapsibleSection>

      {/* Collapsible Existing Investment */}
      <CollapsibleSection
        title="Existing Investment"
        isOpen={props.showAdvancedExistingInvestment}
        onToggle={() => props.setShowAdvancedExistingInvestment(!props.showAdvancedExistingInvestment)}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <CurrencyField
            label="Current Retirement Savings"
            value={props.existingInvestment}
            onChange={props.setExistingInvestment}
            min={0}
          />
          <PercentSliderField
            label="Expected Return on Existing"
            value={props.existingReturn}
            onChange={props.setExistingReturn}
            min={0}
            max={20}
          />
        </div>
      </CollapsibleSection>

      {/* Collapsible Step-up */}
      <CollapsibleSection
        title="Step-up Options"
        isOpen={props.showAdvancedStepUp}
        onToggle={() => props.setShowAdvancedStepUp(!props.showAdvancedStepUp)}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <CurrencyField
            label="Step-up Amount (₹ per year)"
            value={props.stepUpPerYear}
            onChange={props.setStepUpPerYear}
            min={0}
          />
          <PercentSliderField
            label="Step-up Percentage (% per year)"
            value={props.stepUpPercent}
            onChange={props.setStepUpPercent}
            min={0}
            max={20}
          />
        </div>
      </CollapsibleSection>
    </motion.div>
  );
}

// ========== RESULTS PANEL COMPONENT ==========
interface ResultsPanelProps {
  results: RetirementResult;
  isSimplified: boolean;
}

function ResultsPanel({ results, isSimplified }: ResultsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-6 sticky top-24"
    >
      {isSimplified ? (
        <>
          {/* Corpus Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Retirement Corpus Needed</p>
            <p className="text-3xl font-bold">{formatCurrency(results.corpusNeeded)}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4">
            <SummaryStat
              label="Monthly SIP Required"
              value={results.monthlyRequired}
              icon={<Wallet className="w-5 h-5" />}
            />
            <SummaryStat
              label="Yearly SIP Required"
              value={results.yearlyRequired}
              icon={<Calendar className="w-5 h-5" />}
            />
            <SummaryStat
              label="Lumpsum Now"
              value={results.lumpSumNow}
              icon={<Target className="w-5 h-5" />}
            />
          </div>

          {/* Detail Rows */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <KeyValueTile label="Shortfall" value={formatCurrency(results.shortfall)} />
            <KeyValueTile label="FV of Existing" value={formatCurrency(results.fvExisting)} />
            <KeyValueTile label="Monthly Expense at Retirement" value={formatCurrency(results.monthlyExpenseAtRet)} />
          </div>
        </>
      ) : (
        <>
          {/* Corpus Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Retirement Corpus Needed</p>
            <p className="text-3xl font-bold">{formatCurrency(results.corpusNeeded)}</p>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-4">
            <KeyValueTile label="Monthly SIP" value={formatCurrency(results.monthlyRequired)} />
            <KeyValueTile label="Yearly SIP" value={formatCurrency(results.yearlyRequired)} />
            <KeyValueTile label="Lumpsum Now" value={formatCurrency(results.lumpSumNow)} />
            <KeyValueTile label="Shortfall" value={formatCurrency(results.shortfall)} />
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <KeyValueTile label="Years to Retire" value={`${results.yearsToRetire} years`} />
            <KeyValueTile label="FV of Existing" value={formatCurrency(results.fvExisting)} />
            <KeyValueTile label="Monthly Expense at Retirement" value={formatCurrency(results.monthlyExpenseAtRet)} />
          </div>
        </>
      )}
    </motion.div>
  );
}

// ========== COLLAPSIBLE SECTION COMPONENTS ==========
interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, isOpen, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
}

function PremiumCollapsibleSection({ title, isOpen, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="border-2 border-blue-200 rounded-xl bg-blue-50/50">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
}

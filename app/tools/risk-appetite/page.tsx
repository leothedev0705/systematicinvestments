"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Shield, TrendingUp, Wallet, PieChart, RotateCcw, Download, ChevronDown, ChevronUp } from "lucide-react";
import { riskQuestions, riskProfiles } from "@/constants/riskQuestions";
import { calculateRiskProfile, getAnsweredCount, isComplete } from "@/lib/calculators/risk-appetite";
import { generateCalculatorPDF, formatCurrencyPDF } from "@/lib/pdfGenerator";

export default function RiskAppetitePage() {
  const [answers, setAnswers] = useState<Record<number, any>>({
    1: 30, // Default age
  });
  const [showResults, setShowResults] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Personal Information": true,
    "Financial Situation": true,
    "Investment Experience": true,
    "Risk Behavior": true,
    "Investment Goals": true,
    "Past Experience": true,
    "Final Assessment": true,
  });

  const answeredCount = getAnsweredCount(answers);
  const totalQuestions = riskQuestions.length;
  const progress = (answeredCount / totalQuestions) * 100;
  const allAnswered = isComplete(answers);

  const results = useMemo(() => {
    if (!allAnswered) return null;
    return calculateRiskProfile(answers);
  }, [answers, allAnswered]);

  const setAnswer = (questionId: number, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const toggleCheckbox = (questionId: number, value: string, checked: boolean) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, value] };
      } else {
        return { ...prev, [questionId]: current.filter((v: string) => v !== value) };
      }
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const resetAssessment = () => {
    setAnswers({ 1: 30 });
    setShowResults(false);
  };

  const handleDownloadPDF = () => {
    if (!results) return;

    // Get answer labels for PDF
    const inputsForPDF = riskQuestions.map(q => {
      const answer = answers[q.id];
      let displayValue = '';
      
      if (q.type === 'slider') {
        displayValue = `${answer} ${q.unit || ''}`;
      } else if (q.type === 'checkbox' && Array.isArray(answer)) {
        const labels = answer.map(v => q.options?.find(o => o.value === v)?.label || v);
        displayValue = labels.join(', ') || 'None selected';
      } else {
        const option = q.options?.find(o => o.value === answer);
        displayValue = option?.label || String(answer || 'Not answered');
      }

      return {
        label: q.question,
        value: displayValue,
      };
    });

    generateCalculatorPDF({
      calculatorName: 'Risk Appetite Assessment',
      inputs: inputsForPDF,
      results: [
        { label: 'Risk Profile', value: results.profileName, highlight: true },
        { label: 'Risk Score', value: `${Math.round(results.percentageScore)}/100` },
        { label: 'Recommended Equity', value: `${results.assetAllocation.equity}%` },
        { label: 'Recommended Debt', value: `${results.assetAllocation.debt}%` },
        { label: 'Recommended Gold', value: `${results.assetAllocation.gold}%` },
        { label: 'Recommended Cash', value: `${results.assetAllocation.cash}%` },
        { label: 'Suggested Products', value: results.products.join(', ') },
      ],
    });
  };

  // Group questions by category
  const questionsByCategory = riskQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof riskQuestions>);

  const categories = Object.keys(questionsByCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/tools" 
              className="flex items-center gap-2 text-slate-600 hover:text-navy-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Tools</span>
            </Link>
            
            {allAnswered && results && (
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-white rounded-xl hover:bg-navy-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                {answeredCount} of {totalQuestions} questions answered
              </span>
              <span className="text-sm font-medium text-accent">
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-navy-700 mb-2">
            Risk Appetite Assessment
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Answer these 20 questions to discover your investment risk profile and get personalized asset allocation recommendations.
          </p>
        </motion.div>

        {/* Questions by Category */}
        <div className="space-y-6">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-700 text-white flex items-center justify-center text-sm font-bold">
                    {catIndex + 1}
                  </div>
                  <h2 className="text-lg font-semibold text-navy-700">{category}</h2>
                  <span className="text-sm text-slate-500">
                    ({questionsByCategory[category].length} questions)
                  </span>
                </div>
                {expandedCategories[category] ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>

              {/* Questions */}
              <AnimatePresence>
                {expandedCategories[category] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-6">
                      {questionsByCategory[category].map((question, qIndex) => {
                        const isAnswered = answers[question.id] !== undefined && 
                          (Array.isArray(answers[question.id]) ? answers[question.id].length > 0 : true);
                        
                        return (
                          <div
                            key={question.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isAnswered 
                                ? 'border-green-200 bg-green-50/50' 
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                isAnswered 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {isAnswered ? <CheckCircle2 className="w-5 h-5" /> : question.id}
                              </span>
                              
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-navy-700 mb-4">
                                  {question.question}
                                </h3>

                                {/* Slider Input */}
                                {question.type === 'slider' && (
                                  <div className="space-y-3">
                                    <input
                                      type="range"
                                      min={question.min}
                                      max={question.max}
                                      value={answers[question.id] || question.default}
                                      onChange={(e) => setAnswer(question.id, parseInt(e.target.value))}
                                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
                                    />
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">{question.min} {question.unit}</span>
                                      <span className="font-bold text-navy-700 text-lg">
                                        {answers[question.id] || question.default} {question.unit}
                                      </span>
                                      <span className="text-slate-500">{question.max} {question.unit}</span>
                                    </div>
                                  </div>
                                )}

                                {/* Radio Input */}
                                {question.type === 'radio' && (
                                  <div className="space-y-2">
                                    {question.options?.map((option) => (
                                      <label
                                        key={option.value}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                          answers[question.id] === option.value
                                            ? 'border-accent bg-accent/10'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`question-${question.id}`}
                                          value={option.value}
                                          checked={answers[question.id] === option.value}
                                          onChange={() => setAnswer(question.id, option.value)}
                                          className="w-4 h-4 text-accent focus:ring-accent"
                                        />
                                        <span className={`text-sm ${
                                          answers[question.id] === option.value
                                            ? 'font-medium text-navy-700'
                                            : 'text-slate-700'
                                        }`}>
                                          {option.label}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                )}

                                {/* Checkbox Input */}
                                {question.type === 'checkbox' && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {question.options?.map((option) => {
                                      const isChecked = answers[question.id]?.includes(option.value);
                                      return (
                                        <label
                                          key={option.value}
                                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                            isChecked
                                              ? 'border-accent bg-accent/10'
                                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => toggleCheckbox(question.id, option.value, e.target.checked)}
                                            className="w-4 h-4 text-accent rounded focus:ring-accent"
                                          />
                                          <span className={`text-sm ${
                                            isChecked
                                              ? 'font-medium text-navy-700'
                                              : 'text-slate-700'
                                          }`}>
                                            {option.label}
                                          </span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Results Section */}
        {allAnswered && results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-br from-navy-700 to-navy-900 rounded-3xl p-8 text-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold mb-2">Your Risk Profile</h2>
                <p className="text-slate-300">Based on your responses</p>
              </div>

              {/* Risk Score Gauge */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-48 h-24 mb-4">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    {/* Background arc */}
                    <path
                      d="M 10 100 A 90 90 0 0 1 190 100"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Colored arc */}
                    <path
                      d="M 10 100 A 90 90 0 0 1 190 100"
                      fill="none"
                      stroke={results.profileColor}
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray={`${(results.percentageScore / 100) * 283} 283`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-end justify-center pb-2">
                    <span className="text-4xl font-bold">{Math.round(results.percentageScore)}</span>
                    <span className="text-lg ml-1">/100</span>
                  </div>
                </div>
                
                <div 
                  className="px-6 py-2 rounded-full font-bold text-lg"
                  style={{ backgroundColor: results.profileColor }}
                >
                  {results.profileName}
                </div>
              </div>

              <p className="text-center text-slate-200 max-w-2xl mx-auto mb-8">
                {results.profileDescription}
              </p>

              {/* Asset Allocation */}
              <div className="bg-white/10 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Recommended Asset Allocation
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-emerald-400">{results.assetAllocation.equity}%</div>
                    <div className="text-sm text-slate-300">Equity</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">{results.assetAllocation.debt}%</div>
                    <div className="text-sm text-slate-300">Debt</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-amber-400">{results.assetAllocation.gold}%</div>
                    <div className="text-sm text-slate-300">Gold</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-slate-300">{results.assetAllocation.cash}%</div>
                    <div className="text-sm text-slate-300">Cash</div>
                  </div>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="bg-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Suggested Investment Products
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.products.map((product, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-navy-900 rounded-xl font-semibold hover:bg-amber-400 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
                <button
                  onClick={resetAssessment}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake Assessment
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 bg-gradient-to-r from-accent/20 to-amber-100 rounded-2xl p-6 border border-accent/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-navy-700">Need personalized advice?</h3>
                  <p className="text-slate-600">Our experts can help create a customized portfolio based on your risk profile.</p>
                </div>
                <Link
                  href="/book-review"
                  className="px-6 py-3 bg-navy-700 text-white rounded-xl font-semibold hover:bg-navy-800 transition-colors whitespace-nowrap"
                >
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Show message if not complete */}
        {!allAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">Complete all questions to see your results</h3>
                <p className="text-amber-700 text-sm mt-1">
                  You have answered {answeredCount} out of {totalQuestions} questions. 
                  Please answer all questions to get your personalized risk profile.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

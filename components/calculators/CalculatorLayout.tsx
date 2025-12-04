"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Settings,
  Info,
  Download,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Calculator,
} from "lucide-react";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  results?: React.ReactNode;
  assumptions?: string[];
  relatedCalculators?: { name: string; href: string }[];
  howItWorks?: string;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  description,
  icon,
  color,
  children,
  results,
  assumptions,
  relatedCalculators,
  howItWorks,
}) => {
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Copy results to clipboard
    const resultsText = document.getElementById("calculator-results")?.innerText;
    if (resultsText) {
      navigator.clipboard.writeText(resultsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Systematic Investments`,
          text: `Check out this ${title} from Systematic Investments`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-card-border sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Systematic Investment"
                width={150}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <Link
              href="/tools"
              className="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Calculators
            </Link>
          </div>
        </div>
      </header>

      <main className="container-custom py-8 sm:py-12">
        {/* Calculator Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
            >
              {icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                {title}
              </h1>
              <p className="text-muted mt-1">{description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Calculator Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-card-border shadow-card p-6">
              {children}
            </div>

            {/* How it works */}
            {howItWorks && (
              <div className="mt-4 bg-white rounded-2xl border border-card-border shadow-card overflow-hidden">
                <button
                  onClick={() => setShowHowItWorks(!showHowItWorks)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-background/50 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium text-primary">
                    <Info className="w-5 h-5 text-accent" />
                    How this calculator works
                  </span>
                  {showHowItWorks ? (
                    <ChevronUp className="w-5 h-5 text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted" />
                  )}
                </button>
                <AnimatePresence>
                  {showHowItWorks && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-sm text-muted leading-relaxed">
                        {howItWorks}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Assumptions */}
            {assumptions && assumptions.length > 0 && (
              <div className="mt-4 bg-white rounded-2xl border border-card-border shadow-card overflow-hidden">
                <button
                  onClick={() => setShowAssumptions(!showAssumptions)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-background/50 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium text-primary">
                    <Settings className="w-5 h-5 text-accent" />
                    Assumptions
                  </span>
                  {showAssumptions ? (
                    <ChevronUp className="w-5 h-5 text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted" />
                  )}
                </button>
                <AnimatePresence>
                  {showAssumptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="px-6 pb-4 space-y-2">
                        {assumptions.map((assumption, i) => (
                          <li key={i} className="text-sm text-muted flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            {assumption}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl border border-card-border shadow-card p-6">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-semibold text-primary flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-accent" />
                  Results
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-background transition-colors"
                    title="Copy results"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg hover:bg-background transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4 text-muted" />
                  </button>
                </div>
              </div>

              <div id="calculator-results">{results}</div>
            </div>

            {/* Related Calculators */}
            {relatedCalculators && relatedCalculators.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted mb-3">Related Calculators</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedCalculators.map((calc) => (
                    <Link key={calc.href} href={calc.href}>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-card-border rounded-full text-sm text-navy-700 hover:bg-primary/5 hover:border-primary/20 transition-colors">
                        {calc.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 bg-primary/5 rounded-2xl p-6 text-center">
              <p className="text-sm text-navy-700 mb-3">
                Want personalized advice based on these calculations?
              </p>
              <Link href="/book-review">
                <span className="btn-primary text-sm">Book Free Consultation</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Input Components
interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
}) => {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-navy-700">{label}</label>
        <span className="text-sm font-semibold text-primary">{displayValue}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #D4A853 0%, #D4A853 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`,
          }}
        />
      </div>
    </div>
  );
};

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  prefix = "₹",
  suffix,
  placeholder,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-navy-700 mb-2">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{prefix}</span>
        )}
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          placeholder={placeholder}
          className={`w-full py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors ${
            prefix ? "pl-8" : "pl-4"
          } ${suffix ? "pr-12" : "pr-4"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

interface SelectInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-navy-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface ToggleInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const ToggleInput: React.FC<ToggleInputProps> = ({
  label,
  checked,
  onChange,
  description,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-navy-700">{label}</label>
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            checked ? "bg-accent" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

// View Toggle Component
interface ViewToggleProps {
  isAdvanced: boolean;
  onToggle: (isAdvanced: boolean) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ isAdvanced, onToggle }) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-background rounded-xl mb-6">
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          !isAdvanced
            ? "bg-white text-primary shadow-sm"
            : "text-muted hover:text-primary"
        }`}
      >
        Traditional
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isAdvanced
            ? "bg-white text-primary shadow-sm"
            : "text-muted hover:text-primary"
        }`}
      >
        Advanced
      </button>
    </div>
  );
};

// Result Card Component
interface ResultCardProps {
  label: string;
  value: string;
  subValue?: string;
  color?: string;
  icon?: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  label,
  value,
  subValue,
  color = "text-primary",
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-background rounded-xl p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{label}</p>
          <p className={`text-2xl font-heading font-bold ${color}`}>{value}</p>
          {subValue && <p className="text-xs text-muted mt-1">{subValue}</p>}
        </div>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
    </motion.div>
  );
};

// Animated Counter
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = "",
  suffix = "",
  duration = 1,
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      setDisplayValue(Math.round(startValue + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};


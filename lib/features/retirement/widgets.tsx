/**
 * Reusable UI Components for Retirement Calculator
 * Matching the Dart/Flutter widgets structure
 */

import React from 'react';
import { formatCurrency } from '@/lib/utils/formatCurrency';

// Color palette matching Dart version
export const COLORS = {
  primaryGold: '#D4AF37',
  deepBlue: '#1E3A8A',
  softWhite: '#F8FAFC',
  subtleGrey: '#64748B',
  successGreen: '#10B981',
  warningOrange: '#F59E0B',
  errorRed: '#EF4444',
  retirementBlue: '#3B82F6',
};

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  error?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  placeholder,
  error,
}: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{prefix}</span>
        )}
        <input
          type="number"
          value={value || ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            let finalVal = val;
            if (min !== undefined) finalVal = Math.max(min, finalVal);
            if (max !== undefined) finalVal = Math.min(max, finalVal);
            onChange(finalVal);
          }}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-8' : ''} ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{suffix}</span>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface CurrencyFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  error?: string;
}

export function CurrencyField({
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
  error,
}: CurrencyFieldProps) {
  const formatDisplay = (val: number): string => {
    if (val === 0) return '0';
    return val.toLocaleString('en-IN');
  };

  const parseInput = (str: string): number => {
    const cleaned = str.replace(/,/g, '');
    if (cleaned === '' || cleaned === '0') return 0;
    return parseFloat(cleaned) || 0;
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <input
          type="text"
          value={formatDisplay(value)}
          onChange={(e) => {
            const val = parseInput(e.target.value);
            let finalVal = val;
            if (min !== undefined) finalVal = Math.max(min, finalVal);
            if (max !== undefined) finalVal = Math.min(max, finalVal);
            onChange(finalVal);
          }}
          placeholder={placeholder || '0'}
          className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface PercentSliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function PercentSliderField({
  label,
  value,
  onChange,
  min = 0,
  max = 30,
  step = 0.5,
}: PercentSliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">{value.toFixed(1)}%</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}

interface PercentFieldWithProgressProps {
  value: number;
  onChange: (value: number) => void;
  maxValue: number;
  min?: number;
  step?: number;
}

export function PercentFieldWithProgress({
  value,
  onChange,
  maxValue,
  min = 0,
  step = 0.1,
}: PercentFieldWithProgressProps) {
  const percentage = (value / maxValue) * 100;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="space-y-2">
      {/* Percentage Value */}
      <div className="text-2xl font-bold text-blue-600">
        {value.toFixed(1)}%
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      
      {/* Max Value and Input */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{maxValue}%</span>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            const finalVal = Math.max(min, Math.min(maxValue, val));
            onChange(finalVal);
          }}
          min={min}
          max={maxValue}
          step={step}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

interface KeyValueTileProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  subValue?: string;
}

export function KeyValueTile({ label, value, highlight, subValue }: KeyValueTileProps) {
  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'}`}>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>
        {typeof value === 'number' ? formatCurrency(value) : value}
      </p>
      {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
}

interface SummaryStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export function SummaryStat({ label, value, icon, color = COLORS.retirementBlue }: SummaryStatProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {icon && <div style={{ color }}>{icon}</div>}
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {typeof value === 'number' ? formatCurrency(value) : value}
      </p>
    </div>
  );
}


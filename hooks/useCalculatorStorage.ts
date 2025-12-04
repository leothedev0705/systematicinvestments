"use client";

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface SavedCalculation {
  id: string;
  calculatorType: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  savedAt: string;
  name?: string;
}

/**
 * Hook for saving/loading calculator calculations to localStorage
 */
export function useCalculatorStorage(calculatorType: string) {
  const [savedCalcs, setSavedCalcs] = useLocalStorage<SavedCalculation[]>(
    `calculator-${calculatorType}`,
    []
  );

  // Generate unique ID
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Save a new calculation
  const saveCalculation = useCallback((
    inputs: Record<string, any>,
    results: Record<string, any>,
    name?: string
  ) => {
    const newCalc: SavedCalculation = {
      id: generateId(),
      calculatorType,
      inputs,
      results,
      savedAt: new Date().toISOString(),
      name: name || `Calculation ${new Date().toLocaleDateString()}`
    };

    setSavedCalcs(prev => [newCalc, ...prev].slice(0, 10)); // Keep last 10
    return newCalc.id;
  }, [calculatorType, setSavedCalcs]);

  // Load a specific calculation
  const loadCalculation = useCallback((id: string) => {
    return savedCalcs.find(calc => calc.id === id);
  }, [savedCalcs]);

  // Delete a calculation
  const deleteCalculation = useCallback((id: string) => {
    setSavedCalcs(prev => prev.filter(calc => calc.id !== id));
  }, [setSavedCalcs]);

  // Clear all calculations
  const clearAllCalculations = useCallback(() => {
    setSavedCalcs([]);
  }, [setSavedCalcs]);

  // Update calculation name
  const updateCalculationName = useCallback((id: string, name: string) => {
    setSavedCalcs(prev => prev.map(calc => 
      calc.id === id ? { ...calc, name } : calc
    ));
  }, [setSavedCalcs]);

  return {
    savedCalcs,
    saveCalculation,
    loadCalculation,
    deleteCalculation,
    clearAllCalculations,
    updateCalculationName,
    hasCalculations: savedCalcs.length > 0
  };
}

export default useCalculatorStorage;


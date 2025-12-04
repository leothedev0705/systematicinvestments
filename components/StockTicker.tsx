"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockData {
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

// Sample stock data - In production, this would come from an API
const stockData: StockData[] = [
  { symbol: "NIFTY 50", value: 21456.80, change: 175.20, changePercent: 0.82 },
  { symbol: "SENSEX", value: 71234.56, change: 531.45, changePercent: 0.75 },
  { symbol: "NIFTY BANK", value: 46123.45, change: 234.12, changePercent: 0.51 },
  { symbol: "NIFTY IT", value: 32145.67, change: -123.45, changePercent: -0.38 },
  { symbol: "RELIANCE", value: 2456.80, change: 12.50, changePercent: 0.51 },
  { symbol: "TCS", value: 3456.90, change: -15.20, changePercent: -0.44 },
  { symbol: "HDFC BANK", value: 1654.30, change: 8.75, changePercent: 0.53 },
  { symbol: "INFY", value: 1456.25, change: -5.40, changePercent: -0.37 },
  { symbol: "ICICI BANK", value: 987.65, change: 4.32, changePercent: 0.44 },
  { symbol: "HDFC", value: 2654.80, change: 15.60, changePercent: 0.59 },
  { symbol: "BHARTI AIRTEL", value: 1234.56, change: 8.90, changePercent: 0.73 },
  { symbol: "SBIN", value: 654.32, change: 3.21, changePercent: 0.49 },
  { symbol: "BAJFINANCE", value: 7654.32, change: 45.67, changePercent: 0.60 },
  { symbol: "LT", value: 3456.78, change: 12.34, changePercent: 0.36 },
  { symbol: "ASIAN PAINTS", value: 3123.45, change: -8.90, changePercent: -0.28 },
  { symbol: "MARUTI", value: 9876.54, change: 23.45, changePercent: 0.24 },
  { symbol: "NESTLE", value: 24567.89, change: 123.45, changePercent: 0.51 },
  { symbol: "TITAN", value: 3456.78, change: 18.90, changePercent: 0.55 },
  { symbol: "ULTRACEMCO", value: 8765.43, change: 34.56, changePercent: 0.40 },
  { symbol: "WIPRO", value: 456.78, change: -2.34, changePercent: -0.51 },
];

// Format number with Indian numbering system
function formatNumber(num: number): string {
  return num.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

// Format percentage
function formatPercent(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export default function StockTicker() {
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate data for seamless loop
  const duplicatedData = [...stockData, ...stockData, ...stockData];

  return (
    <div 
      className="relative bg-[#0A0A0A] border-b border-white/10 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      {/* Scrolling ticker */}
      <div className="py-2 overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{
            x: isPaused ? 0 : [0, -100 * stockData.length * 1.5],
          }}
          transition={{
            x: {
              duration: 60,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            },
          }}
          style={{
            width: "fit-content",
          }}
        >
          {duplicatedData.map((stock, index) => {
            const isPositive = stock.changePercent >= 0;
            
            return (
              <motion.div
                key={`${stock.symbol}-${index}`}
                className="flex items-center gap-3 px-4 py-1 border-r border-white/10 last:border-r-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
              >
                {/* Symbol */}
                <span className="text-white font-semibold text-sm min-w-[120px]">
                  {stock.symbol}
                </span>
                
                {/* Value */}
                <span className="text-gray-300 text-sm font-mono min-w-[100px] text-right">
                  {formatNumber(stock.value)}
                </span>
                
                {/* Change */}
                <div className={`flex items-center gap-1 min-w-[80px] ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-sm font-semibold">
                    {formatPercent(stock.changePercent)}
                  </span>
                </div>
                
                {/* Absolute change */}
                <span className={`text-xs font-mono min-w-[70px] text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{formatNumber(stock.change)}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-2 right-4 z-20 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <span className="text-xs text-gray-400 font-medium">LIVE</span>
      </div>
    </div>
  );
}


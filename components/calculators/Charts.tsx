"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface LineChartProps {
  data: ChartDataPoint[];
  primaryColor?: string;
  secondaryColor?: string;
  showArea?: boolean;
  height?: number;
  formatValue?: (value: number) => string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  primaryColor = "#D4A853",
  secondaryColor = "#0A2540",
  showArea = true,
  height = 250,
  formatValue = (v) => `₹${(v / 100000).toFixed(1)}L`,
  primaryLabel = "Total Value",
  secondaryLabel = "Invested",
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsAnimated(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0)));
  const range = maxValue || 1;
  const padding = 40;
  const chartWidth = 100;
  const chartHeight = height - padding * 2;

  const getY = (value: number) => chartHeight - (value / range) * chartHeight + padding;
  const getX = (index: number) => (index / (data.length - 1)) * (chartWidth - 10) + 5;

  const primaryPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.value)}`).join(" ");
  const secondaryPath = data[0]?.secondaryValue !== undefined
    ? data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.secondaryValue || 0)}`).join(" ")
    : null;
  const areaPath = showArea ? `${primaryPath} L ${getX(data.length - 1)} ${chartHeight + padding} L ${getX(0)} ${chartHeight + padding} Z` : "";

  return (
    <div ref={containerRef} className="relative" style={{ height }}>
      <div className="flex items-center gap-4 mb-4 justify-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
          <span className="text-xs text-muted">{primaryLabel}</span>
        </div>
        {secondaryPath && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryColor }} />
            <span className="text-xs text-muted">{secondaryLabel}</span>
          </div>
        )}
      </div>
      <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <g key={ratio}>
            <line x1="0" y1={getY(range * ratio)} x2={chartWidth} y2={getY(range * ratio)} stroke="#E5E7EB" strokeWidth="0.2" />
            <text x="1" y={getY(range * ratio) - 1} fontSize="2.5" fill="#9CA3AF">{formatValue(range * ratio)}</text>
          </g>
        ))}
        {showArea && isAnimated && <motion.path d={areaPath} fill="url(#areaGradient)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />}
        {secondaryPath && isAnimated && <motion.path d={secondaryPath} fill="none" stroke={secondaryColor} strokeWidth="0.8" strokeDasharray="2,1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2 }} />}
        {isAnimated && <motion.path d={primaryPath} fill="none" stroke={primaryColor} strokeWidth="1" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />}
        {isAnimated && data.map((d, i) => <motion.circle key={i} cx={getX(i)} cy={getY(d.value)} r="1.5" fill={primaryColor} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.05 }} />)}
        {data.map((d, i) => {
          if (i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) {
            return <text key={i} x={getX(i)} y={height - 10} fontSize="2.5" fill="#9CA3AF" textAnchor="middle">{d.label}</text>;
          }
          return null;
        })}
      </svg>
    </div>
  );
};

interface PieChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartDataPoint[];
  size?: number;
  innerRadius?: number;
  showLabels?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200, innerRadius = 60, showLabels = true }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsAnimated(true); }, { threshold: 0.3 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = size / 2;
  const center = radius;
  let currentAngle = -90;

  const segments = data.map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const ix1 = center + innerRadius * Math.cos(startRad);
    const iy1 = center + innerRadius * Math.sin(startRad);
    const ix2 = center + innerRadius * Math.cos(endRad);
    const iy2 = center + innerRadius * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    return { ...d, path };
  });

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment, i) => (
          <motion.path key={i} d={segment.path} fill={segment.color} initial={{ scale: 0, opacity: 0 }} animate={isAnimated ? { scale: 1, opacity: 1 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }} style={{ transformOrigin: `${center}px ${center}px` }} />
        ))}
      </svg>
      {showLabels && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-muted">{d.label} ({Math.round((d.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface GaugeChartProps {
  value: number;
  color: string;
  label: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ value, color, label }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsAnimated(true); }, { threshold: 0.3 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = radius * Math.PI;

  const segments = [
    { color: "#3B82F6", label: "Very Conservative" },
    { color: "#22C55E", label: "Conservative" },
    { color: "#EAB308", label: "Moderate" },
    { color: "#F97316", label: "Moderately Aggressive" },
    { color: "#EF4444", label: "Aggressive" },
  ];

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {segments.map((seg, i) => {
          const startAngle = 180 + (i * 180) / 5;
          const endAngle = 180 + ((i + 1) * 180) / 5;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);
          return <path key={i} d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`} fill="none" stroke={seg.color} strokeWidth={strokeWidth} opacity={0.3} />;
        })}
        <motion.circle cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${(value / 100) * circumference} ${circumference}`} transform={`rotate(180 ${center} ${center})`} initial={{ strokeDasharray: `0 ${circumference}` }} animate={isAnimated ? { strokeDasharray: `${(value / 100) * circumference} ${circumference}` } : {}} transition={{ duration: 1.5, ease: "easeOut" }} />
        <motion.g initial={{ rotate: -90 }} animate={isAnimated ? { rotate: -90 + (value / 100) * 180 } : {}} transition={{ duration: 1.5, ease: "easeOut" }} style={{ transformOrigin: `${center}px ${center}px` }}>
          <path d={`M ${center} ${center - 8} L ${center + radius - 30} ${center} L ${center} ${center + 8} Z`} fill={color} />
          <circle cx={center} cy={center} r={10} fill={color} />
        </motion.g>
        <text x={center} y={center + 45} textAnchor="middle" fontSize="24" fontWeight="bold" fill={color}>{value}</text>
      </svg>
      <motion.p className="text-lg font-semibold text-center mt-2" style={{ color }} initial={{ opacity: 0, y: 10 }} animate={isAnimated ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1, duration: 0.5 }}>{label}</motion.p>
    </div>
  );
};

interface DataTableColumn {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  format?: (value: any) => string;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, any>[];
  maxRows?: number;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, maxRows = 10 }) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, maxRows);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border">
            {columns.map((col) => (
              <th key={col.key} className={`py-2 px-3 font-medium text-muted ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, i) => (
            <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-card-border/50 last:border-0">
              {columns.map((col) => (
                <td key={col.key} className={`py-2 px-3 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}>{col.format ? col.format(row[col.key]) : row[col.key]}</td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
      {data.length > maxRows && (
        <button onClick={() => setShowAll(!showAll)} className="w-full py-2 text-sm text-accent hover:underline">{showAll ? "Show Less" : `Show All ${data.length} Rows`}</button>
      )}
    </div>
  );
};


"use client";

import React, { useState, useMemo } from "react";
import { MapPin, Plane, Hotel, Utensils, Ticket, Shield, Wallet, Users, Calendar, Check } from "lucide-react";
import {
  CalculatorLayout,
  SliderInput,
  NumberInput,
  SelectInput,
  ViewToggle,
  ResultCard,
} from "@/components/calculators/CalculatorLayout";
import { PieChart } from "@/components/calculators/Charts";
import { calculateTravelBudget, formatCurrency, type TravelCosts } from "@/lib/calculations";
import { formatCurrencyPDF, type PDFConfig } from "@/lib/pdfGenerator";
import { motion } from "framer-motion";

export default function TravelCalculator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Traditional inputs
  const [destination, setDestination] = useState<"domestic" | "international">("domestic");
  const [travelers, setTravelers] = useState(2);
  const [duration, setDuration] = useState(5);
  const [totalBudget, setTotalBudget] = useState(100000);
  
  // Advanced inputs (itemized costs)
  const [flights, setFlights] = useState(30000);
  const [hotels, setHotels] = useState(25000);
  const [food, setFood] = useState(3000); // per day
  const [activities, setActivities] = useState(15000);
  const [visa, setVisa] = useState(5000);
  const [insurance, setInsurance] = useState(3000);
  const [miscellaneous, setMiscellaneous] = useState(10000);
  const [monthsUntilTrip, setMonthsUntilTrip] = useState(6);
  const [savingsReturn, setSavingsReturn] = useState(6);

  const results = useMemo(() => {
    if (isAdvanced) {
      const costs: TravelCosts = {
        flights,
        hotels,
        food,
        activities,
        visa,
        insurance,
        miscellaneous,
      };
      
      return calculateTravelBudget(
        destination,
        travelers,
        duration,
        costs,
        monthsUntilTrip,
        savingsReturn
      );
    } else {
      // Simple estimation based on total budget
      return {
        totalCost: totalBudget,
        perPersonCost: Math.round(totalBudget / travelers),
        monthlyRequired: Math.round(totalBudget / 6), // Default 6 months
        costBreakdown: [
          { category: "Flights", amount: Math.round(totalBudget * 0.3), percentage: 30 },
          { category: "Hotels", amount: Math.round(totalBudget * 0.25), percentage: 25 },
          { category: "Food", amount: Math.round(totalBudget * 0.15), percentage: 15 },
          { category: "Activities", amount: Math.round(totalBudget * 0.15), percentage: 15 },
          { category: "Miscellaneous", amount: Math.round(totalBudget * 0.15), percentage: 15 },
        ],
      };
    }
  }, [destination, travelers, duration, totalBudget, flights, hotels, food, activities, visa, insurance, miscellaneous, monthsUntilTrip, savingsReturn, isAdvanced]);

  const pieChartData = results.costBreakdown.map((item, i) => ({
    label: item.category,
    value: item.amount,
    color: ["#EF4444", "#3B82F6", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899", "#6B7280"][i] || "#9CA3AF",
  }));

  const destinationOptions = [
    { value: "domestic", label: "Domestic (Within India)" },
    { value: "international", label: "International" },
  ];

  const packingChecklist = [
    "Passport & Visa Documents",
    "Travel Insurance Papers",
    "Flight/Train Tickets",
    "Hotel Confirmations",
    "Foreign Currency/Cards",
    "Phone Charger & Adapter",
    "Medications",
    "Comfortable Walking Shoes",
  ];

  // PDF Configuration
  const pdfConfig: Omit<PDFConfig, 'calculatorName' | 'calculatorDescription' | 'assumptions'> = {
    inputs: [
      { label: "Destination", value: destination === "domestic" ? "Domestic (India)" : "International" },
      { label: "Number of Travelers", value: travelers },
      { label: "Trip Duration", value: duration, unit: " days" },
      ...(isAdvanced ? [
        { label: "Flights", value: `₹${flights.toLocaleString('en-IN')}` },
        { label: "Hotels", value: `₹${hotels.toLocaleString('en-IN')}` },
        { label: "Food (per day)", value: `₹${food.toLocaleString('en-IN')}` },
        { label: "Activities", value: `₹${activities.toLocaleString('en-IN')}` },
        ...(destination === "international" ? [
          { label: "Visa Fees", value: `₹${visa.toLocaleString('en-IN')}` },
          { label: "Travel Insurance", value: `₹${insurance.toLocaleString('en-IN')}` },
        ] : []),
        { label: "Miscellaneous", value: `₹${miscellaneous.toLocaleString('en-IN')}` },
        { label: "Months Until Trip", value: monthsUntilTrip },
      ] : [
        { label: "Total Budget", value: `₹${totalBudget.toLocaleString('en-IN')}` },
      ]),
    ],
    results: [
      { label: "Total Trip Cost", value: formatCurrencyPDF(results.totalCost), highlight: true },
      { label: "Per Person Cost", value: formatCurrencyPDF(results.perPersonCost) },
      { label: "Monthly Savings Needed", value: formatCurrencyPDF(results.monthlyRequired), subValue: isAdvanced ? `for ${monthsUntilTrip} months` : "for 6 months" },
      { label: "Daily Budget", value: formatCurrencyPDF(Math.round(results.totalCost / duration)) },
      { label: "Per Person Per Day", value: formatCurrencyPDF(Math.round(results.totalCost / duration / travelers)) },
    ],
    tables: [
      {
        title: "Cost Breakdown",
        headers: ["Category", "Amount", "Percentage"],
        rows: results.costBreakdown.map(item => [
          item.category,
          formatCurrencyPDF(item.amount),
          `${item.percentage}%`,
        ]),
      },
    ],
  };

  return (
    <CalculatorLayout
      title="Travel Budget Calculator"
      description="Plan your trip budget with detailed cost breakdown"
      icon={<MapPin className="w-7 h-7 text-white" />}
      color="from-teal-500 to-green-500"
      assumptions={[
        `Destination type: ${destination === "domestic" ? "Domestic" : "International"}`,
        `${travelers} travelers for ${duration} days`,
        isAdvanced ? `${monthsUntilTrip} months to save at ${savingsReturn}% returns` : "6 months saving period",
        destination === "international" ? "Visa & insurance costs included" : "No visa/insurance needed",
      ]}
      howItWorks="The travel budget calculator helps you plan and break down your trip costs. In basic mode, it provides an estimated breakdown based on typical spending patterns. In advanced mode, you can input specific costs for each category and calculate how much you need to save monthly to fund your trip."
      relatedCalculators={[
        { name: "Vacation Calculator", href: "/tools/vacation" },
        { name: "SIP Calculator", href: "/tools/sip" },
      ]}
      pdfConfig={pdfConfig}
      results={
        <div className="space-y-6">
          {/* Total Cost Summary */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-teal-50 to-green-50 border border-teal-200 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-6 h-6 text-teal-600" />
              <p className="text-sm text-teal-700 font-medium">
                Total Trip Cost ({destination === "domestic" ? "India" : "International"})
              </p>
            </div>
            <div className="text-4xl font-heading font-bold text-teal-700">
              {formatCurrency(results.totalCost)}
            </div>
            <p className="text-sm text-teal-600 mt-2">
              {formatCurrency(results.perPersonCost)} per person • {travelers} travelers • {duration} days
            </p>
          </motion.div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Per Person Cost"
              value={formatCurrency(results.perPersonCost)}
              icon={<Users className="w-5 h-5" />}
            />
            <ResultCard
              label="Monthly Savings Needed"
              value={formatCurrency(results.monthlyRequired)}
              subValue={isAdvanced ? `for ${monthsUntilTrip} months` : "for 6 months"}
              icon={<Wallet className="w-5 h-5" />}
              color="text-accent"
            />
            <ResultCard
              label="Daily Budget"
              value={formatCurrency(Math.round(results.totalCost / duration))}
              icon={<Calendar className="w-5 h-5" />}
            />
            <ResultCard
              label="Per Person Per Day"
              value={formatCurrency(Math.round(results.totalCost / duration / travelers))}
              icon={<Users className="w-5 h-5" />}
            />
          </div>

          {/* Cost Breakdown Pie Chart */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4 text-center">Cost Breakdown</h3>
            <PieChart data={pieChartData} size={200} innerRadius={50} />
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Expense Details</h3>
            <div className="space-y-3">
              {results.costBreakdown.map((item, i) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pieChartData[i]?.color }}
                    />
                    <span className="text-sm text-navy-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-primary">{formatCurrency(item.amount)}</span>
                    <span className="text-xs text-muted ml-2">({item.percentage}%)</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Packing Checklist */}
          <div className="bg-background rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-3">📋 Quick Checklist</h3>
            <div className="grid grid-cols-2 gap-2">
              {packingChecklist.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <div className="w-4 h-4 rounded border border-card-border flex items-center justify-center">
                    <Check className="w-3 h-3 text-transparent" />
                  </div>
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Money Saving Tips */}
          <div className="bg-primary/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-navy-700 mb-2">💰 Budget Travel Tips</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Book <strong>flights 6-8 weeks in advance</strong> for best prices
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Consider <strong>off-season travel</strong> for 30-50% savings on hotels
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                Use <strong>travel credit cards</strong> for airport lounge access and forex savings
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                {destination === "international" 
                  ? "Get a forex card for better exchange rates than cash"
                  : "Book hotels with free cancellation for flexibility"}
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <ViewToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />

      <SelectInput
        label="Destination Type"
        value={destination}
        onChange={(v) => setDestination(v as "domestic" | "international")}
        options={destinationOptions}
      />

      <SliderInput
        label="Number of Travelers"
        value={travelers}
        onChange={setTravelers}
        min={1}
        max={10}
        unit=" people"
      />

      <SliderInput
        label="Trip Duration"
        value={duration}
        onChange={setDuration}
        min={1}
        max={30}
        unit=" days"
      />

      {!isAdvanced && (
        <NumberInput
          label="Total Budget"
          value={totalBudget}
          onChange={setTotalBudget}
          prefix="₹"
          min={10000}
        />
      )}

      {isAdvanced && (
        <>
          <div className="border-t border-card-border my-6 pt-6">
            <h3 className="text-sm font-medium text-navy-700 mb-4 flex items-center gap-2">
              <Plane className="w-4 h-4 text-accent" />
              Itemized Costs
            </h3>

            <NumberInput
              label="Flights (Round Trip)"
              value={flights}
              onChange={setFlights}
              prefix="₹"
            />

            <NumberInput
              label="Hotels (Total)"
              value={hotels}
              onChange={setHotels}
              prefix="₹"
            />

            <NumberInput
              label="Food (Per Day)"
              value={food}
              onChange={setFood}
              prefix="₹"
            />

            <NumberInput
              label="Activities & Sightseeing"
              value={activities}
              onChange={setActivities}
              prefix="₹"
            />

            {destination === "international" && (
              <>
                <NumberInput
                  label="Visa Fees"
                  value={visa}
                  onChange={setVisa}
                  prefix="₹"
                />

                <NumberInput
                  label="Travel Insurance"
                  value={insurance}
                  onChange={setInsurance}
                  prefix="₹"
                />
              </>
            )}

            <NumberInput
              label="Miscellaneous / Shopping"
              value={miscellaneous}
              onChange={setMiscellaneous}
              prefix="₹"
            />
          </div>

          <div className="border-t border-card-border my-6 pt-6">
            <h3 className="text-sm font-medium text-navy-700 mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-accent" />
              Savings Plan
            </h3>

            <SliderInput
              label="Months Until Trip"
              value={monthsUntilTrip}
              onChange={setMonthsUntilTrip}
              min={1}
              max={24}
              unit=" months"
            />

            <SliderInput
              label="Savings Return Rate"
              value={savingsReturn}
              onChange={setSavingsReturn}
              min={3}
              max={10}
              step={0.5}
              unit="%"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}


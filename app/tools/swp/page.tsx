"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  Calculator, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Copy,
  Share2,
  Mail,
  Printer,
  MessageCircle,
  Linkedin,
  Twitter,
  Facebook,
  Check,
  Link as LinkIcon,
  ExternalLink
} from "lucide-react";
import { generateCalculatorPDF, formatCurrencyPDF, type PDFConfig } from "@/lib/pdfGenerator";

// Format currency in Indian format
function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Format number with Indian comma format
function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

export default function SWPCalculator() {
  // Inputs - exactly like Groww
  const [totalInvestment, setTotalInvestment] = useState(500000);
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [timePeriod, setTimePeriod] = useState(5);
  
  // UI State
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Get current URL for sharing
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'https://systematicinvestments.in/tools/swp';
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share functions
  const shareOnWhatsApp = () => {
    const text = `Check out this SWP Calculator! Calculate your systematic withdrawals easily.\n\nMy Results:\n• Investment: ₹${formatNumber(totalInvestment)}\n• Monthly Withdrawal: ₹${formatNumber(withdrawalPerMonth)}\n• Total Withdrawn: ₹${formatNumber(results.totalWithdrawal)}\n• Final Value: ₹${formatNumber(results.finalValue)}\n\n`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + getShareUrl())}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = `I just calculated my SWP returns! ₹${formatNumber(totalInvestment)} investment with ₹${formatNumber(withdrawalPerMonth)}/month withdrawal. Try it yourself:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'SWP Calculator - Plan Your Systematic Withdrawals';
    const body = `Hi,\n\nI found this useful SWP Calculator that helps plan systematic withdrawals from your investments.\n\nMy Calculation Results:\n• Total Investment: ₹${formatNumber(totalInvestment)}\n• Monthly Withdrawal: ₹${formatNumber(withdrawalPerMonth)}\n• Expected Return: ${expectedReturn}%\n• Time Period: ${timePeriod} years\n• Total Withdrawn: ₹${formatNumber(results.totalWithdrawal)}\n• Final Value: ₹${formatNumber(results.finalValue)}\n\nTry it yourself: ${getShareUrl()}\n\nBest regards`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const printPage = () => {
    window.print();
  };

  // Native share if available
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SWP Calculator - Systematic Investments',
          text: `Calculate your systematic withdrawals! Investment: ₹${formatNumber(totalInvestment)}, Monthly Withdrawal: ₹${formatNumber(withdrawalPerMonth)}`,
          url: getShareUrl(),
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShareOpen(!shareOpen);
    }
  };

  // Calculate SWP results
  const results = useMemo(() => {
    const monthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;
    const totalMonths = timePeriod * 12;
    
    let balance = totalInvestment;
    let totalWithdrawn = 0;
    const monthlyBreakdown: Array<{
      month: number;
      balanceAtBegin: number;
      withdrawal: number;
      interestEarned: number;
      balanceAtEnd: number;
    }> = [];

    for (let month = 1; month <= totalMonths; month++) {
      const balanceAtBegin = balance;
      
      // Withdraw first
      const withdrawal = Math.min(withdrawalPerMonth, balance);
      balance -= withdrawal;
      totalWithdrawn += withdrawal;
      
      // Then earn interest on remaining
      const interestEarned = balance * monthlyRate;
      balance += interestEarned;

      monthlyBreakdown.push({
        month,
        balanceAtBegin: Math.round(balanceAtBegin),
        withdrawal: Math.round(withdrawal),
        interestEarned: Math.round(interestEarned),
        balanceAtEnd: Math.round(balance),
      });

      if (balance <= 0) break;
    }

    return {
      totalInvestment,
      totalWithdrawal: Math.round(totalWithdrawn),
      finalValue: Math.max(0, Math.round(balance)),
      monthlyBreakdown,
    };
  }, [totalInvestment, withdrawalPerMonth, expectedReturn, timePeriod]);

  // PDF Generation
  const handleDownloadPDF = () => {
    const pdfConfig: PDFConfig = {
      calculatorName: "SWP Calculator",
      inputs: [
        { label: "Total Investment", value: `Rs. ${formatNumber(totalInvestment)}` },
        { label: "Withdrawal per Month", value: `Rs. ${formatNumber(withdrawalPerMonth)}` },
        { label: "Expected Return Rate (p.a.)", value: `${expectedReturn}%` },
        { label: "Time Period", value: `${timePeriod} Years` },
      ],
      results: [
        { label: "Total Investment", value: `Rs. ${formatNumber(results.totalInvestment)}`, highlight: false },
        { label: "Total Withdrawal", value: `Rs. ${formatNumber(results.totalWithdrawal)}`, highlight: true },
        { label: "Final Value", value: `Rs. ${formatNumber(results.finalValue)}` },
      ],
      tables: [
        {
          title: "Month-wise Breakdown",
          headers: ["Month", "Balance at Begin", "Withdrawal", "Interest Earned"],
          rows: results.monthlyBreakdown.slice(0, 12).map(row => [
            row.month,
            `Rs. ${formatNumber(row.balanceAtBegin)}`,
            `Rs. ${formatNumber(row.withdrawal)}`,
            `Rs. ${formatNumber(row.interestEarned)}`,
          ]),
        },
      ],
    };
    generateCalculatorPDF(pdfConfig);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/tools" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Tools</span>
            </Link>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#00D09C] hover:bg-[#00B88A] text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Calculator Section */}
          <div className="flex-1">
            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-8"
            >
              SWP (Systematic Withdrawal Plan) Calculator
            </motion.h1>

            {/* Calculator Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm"
            >
              {/* Input 1: Total Investment */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-gray-600 font-medium">Total investment</label>
                  <div className="flex items-center gap-1 bg-[#E8F5F1] rounded-lg px-3 py-2">
                    <span className="text-[#00D09C] font-medium">₹</span>
                    <input
                      type="text"
                      value={formatNumber(totalInvestment)}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/,/g, '')) || 0;
                        setTotalInvestment(Math.min(10000000, Math.max(10000, value)));
                      }}
                      className="w-24 bg-transparent text-[#00D09C] font-semibold text-right focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={10000000}
                  step={10000}
                  value={totalInvestment}
                  onChange={(e) => setTotalInvestment(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00D09C]"
                  style={{
                    background: `linear-gradient(to right, #00D09C 0%, #00D09C ${((totalInvestment - 10000) / (10000000 - 10000)) * 100}%, #E5E7EB ${((totalInvestment - 10000) / (10000000 - 10000)) * 100}%, #E5E7EB 100%)`
                  }}
                />
              </div>

              {/* Input 2: Withdrawal per month */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-gray-600 font-medium">Withdrawal per month</label>
                  <div className="flex items-center gap-1 bg-[#E8F5F1] rounded-lg px-3 py-2">
                    <span className="text-[#00D09C] font-medium">₹</span>
                    <input
                      type="text"
                      value={formatNumber(withdrawalPerMonth)}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/,/g, '')) || 0;
                        setWithdrawalPerMonth(Math.min(100000, Math.max(500, value)));
                      }}
                      className="w-20 bg-transparent text-[#00D09C] font-semibold text-right focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={withdrawalPerMonth}
                  onChange={(e) => setWithdrawalPerMonth(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00D09C]"
                  style={{
                    background: `linear-gradient(to right, #00D09C 0%, #00D09C ${((withdrawalPerMonth - 500) / (100000 - 500)) * 100}%, #E5E7EB ${((withdrawalPerMonth - 500) / (100000 - 500)) * 100}%, #E5E7EB 100%)`
                  }}
                />
              </div>

              {/* Input 3: Expected return rate */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-gray-600 font-medium">Expected return rate (p.a)</label>
                  <div className="flex items-center gap-1 bg-[#E8F5F1] rounded-lg px-3 py-2">
                    <input
                      type="text"
                      value={expectedReturn}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setExpectedReturn(Math.min(30, Math.max(1, value)));
                      }}
                      className="w-10 bg-transparent text-[#00D09C] font-semibold text-right focus:outline-none"
                    />
                    <span className="text-[#00D09C] font-medium">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00D09C]"
                  style={{
                    background: `linear-gradient(to right, #00D09C 0%, #00D09C ${((expectedReturn - 1) / (30 - 1)) * 100}%, #E5E7EB ${((expectedReturn - 1) / (30 - 1)) * 100}%, #E5E7EB 100%)`
                  }}
                />
              </div>

              {/* Input 4: Time period */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-gray-600 font-medium">Time period</label>
                  <div className="flex items-center gap-1 bg-[#E8F5F1] rounded-lg px-3 py-2">
                    <input
                      type="text"
                      value={timePeriod}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setTimePeriod(Math.min(30, Math.max(1, value)));
                      }}
                      className="w-8 bg-transparent text-[#00D09C] font-semibold text-right focus:outline-none"
                    />
                    <span className="text-[#00D09C] font-medium">Yr</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00D09C]"
                  style={{
                    background: `linear-gradient(to right, #00D09C 0%, #00D09C ${((timePeriod - 1) / (30 - 1)) * 100}%, #E5E7EB ${((timePeriod - 1) / (30 - 1)) * 100}%, #E5E7EB 100%)`
                  }}
                />
              </div>

              {/* Results Table */}
              <div className="border-t border-gray-200 pt-6">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Total investment</td>
                      <td className="py-3 text-right font-semibold text-gray-900">₹{formatNumber(results.totalInvestment)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Total withdrawal</td>
                      <td className="py-3 text-right font-semibold text-gray-900">₹{formatNumber(results.totalWithdrawal)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600">Final value</td>
                      <td className="py-3 text-right font-semibold text-gray-900">₹{formatNumber(results.finalValue)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Information Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 prose prose-gray max-w-none"
            >
              <p className="text-gray-600 leading-relaxed">
                <span className="text-[#00D09C] font-semibold hover:underline cursor-pointer">SWP</span> stands for systematic withdrawal plan. Under SWP, if you invest lump sum in a mutual fund, you can set an amount you'll withdraw regularly and the frequency at which you'll withdraw.
              </p>
              
              <p className="text-gray-600 leading-relaxed mt-4">
                For example, let's say you invested in a mutual fund an amount of ₹5 lakh for 5 years. Let's assume that you decided to withdraw an amount of ₹10,000 per month. So every month, your investment in the fund will reduce by ₹10,000. The amount left every month after withdrawal will continue to remain invested and earn returns.
              </p>

              <p className="text-gray-600 leading-relaxed mt-4">
                Use the above SWP calculator to know how much you can withdraw from your lumpsum investments.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How can a SWP calculator assist you?</h2>
              
              <p className="text-gray-600 leading-relaxed">
                As per the Systematic Withdrawal Plan, an individual needs to invest a particular amount and withdraw a certain amount of the corpus invested each month. After withdrawal, the amount will be deducted from the investment while it continues to accumulate interest.
              </p>

              <p className="text-gray-600 leading-relaxed mt-4">
                It is difficult to accurately calculate the monthly withdrawals and total matured sum. This <strong className="text-gray-900">Systematic Withdrawal Plan calculator</strong> easily computes your matured sum as per your monthly withdrawals precisely.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Example of Systematic Withdrawal Plan</h2>

              <p className="text-gray-600 leading-relaxed">
                As mentioned before, the SWP allows investors to generate both monthly revenue as well as an accumulated sum at the end of the maturity period. Here's an example withdrawal schedule:
              </p>

              <p className="text-gray-600 leading-relaxed mt-4">
                Based on your inputs of <strong className="text-gray-900">₹{formatNumber(totalInvestment)}</strong> investment with <strong className="text-gray-900">₹{formatNumber(withdrawalPerMonth)}</strong> monthly withdrawal at <strong className="text-gray-900">{expectedReturn}%</strong> return for <strong className="text-gray-900">{timePeriod} years</strong>:
              </p>

              {/* Month-wise Breakdown Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Month</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Balance at Begin</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Withdrawal</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Interest Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.monthlyBreakdown.slice(0, showBreakdown ? 24 : 12).map((row) => (
                      <tr key={row.month} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 text-gray-600">{row.month}</td>
                        <td className="border border-gray-200 px-4 py-2 text-gray-600">{row.balanceAtBegin > 0 ? `Rs. ${formatNumber(row.balanceAtBegin)}` : '-'}</td>
                        <td className="border border-gray-200 px-4 py-2 text-gray-600">Rs. {formatNumber(row.withdrawal)}</td>
                        <td className="border border-gray-200 px-4 py-2 text-gray-600">Rs. {formatNumber(row.interestEarned)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.monthlyBreakdown.length > 12 && (
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="mt-4 text-[#00D09C] hover:text-[#00B88A] font-medium flex items-center gap-1"
                  >
                    {showBreakdown ? (
                      <>Show Less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Show More Months <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How to use SWP calculator?</h2>

              <p className="text-gray-600 leading-relaxed">
                The calculator is user-friendly and easy to use. However, you need to ensure that all values are properly filled in.
              </p>

              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
                <li>Fill in the Total Investment amount - this is your lumpsum corpus</li>
                <li>Enter the monthly Withdrawal amount you want to receive</li>
                <li>Set the Expected Return Rate you anticipate from your investments</li>
                <li>Choose the Time Period for which you want to calculate</li>
                <li>The calculator will instantly show your total withdrawal and final remaining value</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How can a SWP calculator benefit you?</h2>

              <p className="text-gray-600 leading-relaxed">
                Retirees and senior citizens are among the most common investors in this scheme. Such individuals obviously require a fixed monthly financial input. An SWP can provide the same over and above the pension or even as an alternative.
              </p>

              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
                <li>A Systematic Withdrawal Plan ensures monthly returns while generating RoI on the total investment. This calculator can help easily compute both accurately.</li>
                <li>It's easy to set the amount which you wish to withdraw every month and calculate amount on maturity accordingly.</li>
                <li>It is easily accessible online.</li>
                <li>This <strong>SWP return calculator</strong> does not require any expertise to operate. Users need to just put variables in proper space and output is ready in no time.</li>
              </ul>

              {/* FAQs */}
              <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">FAQs</h2>

              <div className="space-y-4">
                {[
                  {
                    q: "Can I choose the withdrawal amount or is it fixed?",
                    a: "No, you can determine the monthly withdrawal amount as per requirements. You have flexibility to choose between different withdrawal amounts and frequencies."
                  },
                  {
                    q: "When to use SWP?",
                    a: "As per experts, SWP works best after retirement because an individual needs regular income. It's also useful for anyone who wants to generate regular cash flows from their lumpsum investments."
                  },
                  {
                    q: "Can individuals other than retirees invest in the SWP?",
                    a: "Yes, individuals who are not senior citizens or retirees can also invest in the Systematic Withdrawal Plan (SWP). As per SWP, an individual can invest a lumpsum amount and withdraw a certain amount from that each month."
                  },
                  {
                    q: "What happens if my corpus runs out before the time period?",
                    a: "If your withdrawal amount is higher than the returns generated, your corpus will deplete over time. The calculator shows the final value which indicates how much corpus remains at the end of your chosen period."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setShowFAQ(showFAQ === idx ? null : idx)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.q}</span>
                      {showFAQ === idx ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {showFAQ === idx && (
                      <div className="px-4 pb-4 text-gray-600">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#E8F5F1] rounded-full flex items-center justify-center">
                <Calculator className="w-8 h-8 text-[#00D09C]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Plan Your Withdrawals</h3>
              <p className="text-gray-600 text-sm mb-4">Get expert advice on systematic withdrawal planning</p>
              <Link
                href="/book-review"
                className="block w-full py-3 bg-[#00D09C] hover:bg-[#00B88A] text-white font-semibold rounded-lg transition-colors"
              >
                BOOK FREE CONSULTATION
              </Link>
            </motion.div>

            {/* Quick Links - Share & Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="w-5 h-5 text-[#00D09C]" />
                <h3 className="font-bold text-gray-900">Quick Links</h3>
              </div>

              {/* Copy Link */}
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                {copied ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#E8F5F1] flex items-center justify-center transition-colors">
                    <Copy className="w-4 h-4 text-gray-500 group-hover:text-[#00D09C]" />
                  </div>
                )}
                <span className={`font-medium ${copied ? 'text-green-600' : 'text-gray-700'}`}>
                  {copied ? 'Link Copied!' : 'Copy Calculator Link'}
                </span>
              </button>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={nativeShare}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#E8F5F1] flex items-center justify-center transition-colors">
                    <Share2 className="w-4 h-4 text-gray-500 group-hover:text-[#00D09C]" />
                  </div>
                  <span className="font-medium text-gray-700">Share Calculator</span>
                </button>

                {/* Share Dropdown */}
                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10"
                  >
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={shareOnWhatsApp}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="Share on WhatsApp"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-600">WhatsApp</span>
                      </button>
                      <button
                        onClick={shareOnTwitter}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Share on Twitter"
                      >
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                          <Twitter className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-600">Twitter</span>
                      </button>
                      <button
                        onClick={shareOnLinkedIn}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Share on LinkedIn"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center">
                          <Linkedin className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-600">LinkedIn</span>
                      </button>
                      <button
                        onClick={shareOnFacebook}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Share on Facebook"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                          <Facebook className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-600">Facebook</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Email */}
              <button
                onClick={shareViaEmail}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#E8F5F1] flex items-center justify-center transition-colors">
                  <Mail className="w-4 h-4 text-gray-500 group-hover:text-[#00D09C]" />
                </div>
                <span className="font-medium text-gray-700">Email Results</span>
              </button>

              {/* Print */}
              <button
                onClick={printPage}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#E8F5F1] flex items-center justify-center transition-colors">
                  <Printer className="w-4 h-4 text-gray-500 group-hover:text-[#00D09C]" />
                </div>
                <span className="font-medium text-gray-700">Print Page</span>
              </button>

              {/* Download PDF */}
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#E8F5F1] flex items-center justify-center transition-colors">
                  <Download className="w-4 h-4 text-gray-500 group-hover:text-[#00D09C]" />
                </div>
                <span className="font-medium text-gray-700">Download PDF Report</span>
              </button>

              <div className="border-t border-gray-100 mt-3 pt-3">
                <p className="text-xs text-gray-500 text-center">
                  Share this calculator with friends & family
                </p>
              </div>
            </motion.div>

            {/* Popular Calculators */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <h3 className="font-bold text-gray-900 mb-4">Popular Calculators</h3>
              <div className="space-y-3">
                {[
                  { name: "SIP Calculator", href: "/tools/sip" },
                  { name: "Retirement Calculator", href: "/tools/retirement" },
                  { name: "Risk Appetite Calculator", href: "/tools/risk-appetite" },
                  { name: "SIP Delay Calculator", href: "/tools/sip-delay" },
                  { name: "Child Education Calculator", href: "/tools/education" },
                  { name: "Vacation Calculator", href: "/tools/vacation" },
                ].map((calc) => (
                  <Link
                    key={calc.name}
                    href={calc.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#00D09C] transition-colors group"
                  >
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{calc.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#FFF8E7] rounded-2xl p-6"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#D4A853] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-600">
                    For sustainable withdrawals, keep your annual withdrawal rate below your expected return rate. This ensures your corpus lasts longer or even grows!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Systematic Investments. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/tools" className="text-gray-500 hover:text-gray-700 text-sm">All Calculators</Link>
              <Link href="/book-review" className="text-gray-500 hover:text-gray-700 text-sm">Book Consultation</Link>
              <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

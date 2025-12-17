"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Calculator,
  Target,
  PiggyBank,
  TrendingUp,
  Clock,
  GraduationCap,
  Plane,
  MapPin,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const calculators = [
  {
    id: "risk-appetite",
    name: "Risk Appetite Calculator",
    description: "Discover your risk profile and get personalized asset allocation recommendations",
    icon: Target,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50",
  },
  {
    id: "retirement",
    name: "Retirement Calculator",
    description: "Plan your retirement corpus and monthly SIP needed for a secure future",
    icon: PiggyBank,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "swp",
    name: "SWP Calculator",
    description: "Plan systematic withdrawals from your corpus and see how long it lasts",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
  },
  {
    id: "sip",
    name: "SIP Calculator",
    description: "Calculate future value of your SIP investments with detailed projections",
    icon: Calculator,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
  {
    id: "sip-delay",
    name: "SIP Delay Calculator",
    description: "Understand the cost of delaying your investments and how to recover",
    icon: Clock,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50",
  },
  {
    id: "education",
    name: "Child Education Calculator",
    description: "Plan for your child's education expenses including inflation",
    icon: GraduationCap,
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50",
  },
  {
    id: "vacation",
    name: "Vacation Calculator",
    description: "Save systematically for your dream vacation",
    icon: Plane,
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50",
  },
  {
    id: "travel",
    name: "Travel Budget Calculator",
    description: "Plan your trip budget with detailed cost breakdown",
    icon: MapPin,
    color: "from-teal-500 to-green-500",
    bgColor: "bg-teal-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-hero-gradient">
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
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container-custom py-12 sm:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Financial Planning Tools
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-4">
            Smart Financial Calculators
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Make informed financial decisions with our comprehensive suite of calculators.
            Plan your investments, retirement, education, and more.
          </p>
        </motion.div>

        {/* Calculator Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {calculators.map((calc) => (
            <motion.div key={calc.id} variants={itemVariants}>
              <Link href={`/tools/${calc.id}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-white rounded-2xl border border-card-border shadow-card overflow-hidden group cursor-pointer"
                >
                  {/* Gradient header */}
                  <div className={`h-2 bg-gradient-to-r ${calc.color}`} />
                  
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-2xl ${calc.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <calc.icon className={`w-7 h-7 bg-gradient-to-r ${calc.color} bg-clip-text`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text' }} />
                      <calc.icon className={`w-7 h-7 absolute opacity-100`} style={{ color: calc.color.includes('red') ? '#EF4444' : calc.color.includes('blue') ? '#3B82F6' : calc.color.includes('green') ? '#22C55E' : calc.color.includes('purple') ? '#A855F7' : calc.color.includes('amber') ? '#F59E0B' : calc.color.includes('cyan') ? '#06B6D4' : calc.color.includes('rose') ? '#F43F5E' : '#14B8A6' }} />
                    </div>
                    
                    <h3 className="text-lg font-heading font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                      {calc.name}
                    </h3>
                    
                    <p className="text-sm text-muted mb-4 line-clamp-2">
                      {calc.description}
                    </p>
                    
                    <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors">
                      Calculate Now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-primary rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                Need Personalized Financial Advice?
              </h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Our calculators give you a starting point. For a comprehensive financial plan
                tailored to your unique situation, book a free consultation with our experts.
              </p>
              <Link href="/book-review">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-accent inline-flex items-center gap-2 shadow-lg"
                >
                  Book Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}






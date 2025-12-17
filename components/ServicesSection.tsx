"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen,
  Target,
  BarChart3,
  Compass,
  Lightbulb,
  RefreshCw,
  TrendingUp,
  Shield,
  Wallet,
  Building2,
  Banknote,
  GraduationCap,
  Layers,
} from "lucide-react";

const services = [
  {
    icon: BookOpen,
    title: "Financial Education",
    description: "Educate about the need for financial planning",
  },
  {
    icon: Target,
    title: "Goal Understanding",
    description: "Assist in understanding your financial goals",
  },
  {
    icon: BarChart3,
    title: "Risk Profiling",
    description: "Help evaluate your financial risk profile",
  },
  {
    icon: Compass,
    title: "Corpus Planning",
    description: "Support in identifying the corpus needed for your goals",
  },
  {
    icon: Lightbulb,
    title: "Financial Concepts",
    description: "Help you understand key financial concepts",
  },
  {
    icon: RefreshCw,
    title: "Portfolio Review",
    description: "Support with portfolio review and rebalancing",
  },
];

const products = [
  { icon: TrendingUp, label: "Mutual Funds" },
  { icon: Shield, label: "Mediclaim" },
  { icon: Wallet, label: "Term Insurance" },
  { icon: Building2, label: "PMS" },
  { icon: Banknote, label: "Fixed Deposits" },
  { icon: GraduationCap, label: "Educational Loans" },
  { icon: Layers, label: "Other Solutions" },
];

export const ServicesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="heading-lg mb-4">How We Help You Invest with Confidence</h2>
          <p className="text-body max-w-2xl mx-auto">
            From understanding your goals to reviewing your portfolio, we provide 
            comprehensive support for your financial journey with clarity and expertise.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card-base p-6 group cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-lg transition-all duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-primary mb-2">
                {service.title}
              </h3>
              <p className="text-body-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Product Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-primary/5 rounded-3xl p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <h3 className="heading-sm mb-2">Product Expertise</h3>
            <p className="text-body-sm">
              Wide range of investment and protection solutions tailored to your needs
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {products.map((product, index) => (
              <motion.div
                key={product.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-card border border-card-border"
              >
                <product.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-navy-700">{product.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};






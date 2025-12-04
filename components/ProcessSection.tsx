"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Search, PenTool, Rocket, RefreshCw, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Understand your current financial picture, goals, and aspirations through detailed consultation.",
  },
  {
    number: "02",
    icon: PenTool,
    title: "Design",
    description:
      "Build a tailored financial plan and product mix aligned with your risk profile and timeline.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Implement",
    description:
      "Execute investments with discipline, clarity, and complete transparency at every step.",
  },
  {
    number: "04",
    icon: RefreshCw,
    title: "Review",
    description:
      "Periodic portfolio reviews and rebalancing to keep you on track towards your goals.",
  },
];

export const ProcessSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" ref={ref} className="section-padding bg-primary overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
            Our Approach
          </span>
          <h2 className="heading-lg text-white mb-4">Our Systematic Advisory Process</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            A structured, transparent approach to help you achieve your financial goals 
            with confidence.
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent origin-left -translate-y-1/2"
          />

          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="relative"
              >
                {/* Step indicator */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
                    className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-glow relative z-10"
                  >
                    <step.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                </div>

                {/* Content card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
                  <span className="text-sm font-heading font-bold text-accent mb-2 block">
                    Step {step.number}
                  </span>
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 right-0 translate-x-1/2 -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex gap-4"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-white/20 my-2" />
                )}
              </div>

              {/* Content */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex-1 border border-white/10 mb-2">
                <span className="text-sm font-heading font-bold text-accent mb-1 block">
                  Step {step.number}
                </span>
                <h3 className="text-lg font-heading font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


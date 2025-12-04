"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: "25+",
    label: "Years in the Business",
    description: "Trusted expertise since 1996",
  },
  {
    icon: TrendingUp,
    value: "25 Cr+",
    label: "Assets Under Management",
    description: "Growing wealth systematically",
  },
  {
    icon: Users,
    value: "1000+",
    label: "Happy Clients",
    description: "Families achieving their goals",
  },
];

export const StatsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-16 bg-primary">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-3 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center group"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors"
                >
                  <stat.icon className="w-8 h-8 text-accent" />
                </motion.div>
                <motion.span
                  className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2"
                  initial={{ scale: 0.5 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                >
                  {stat.value}
                </motion.span>
                <h3 className="text-lg font-semibold text-white/90 mb-1">
                  {stat.label}
                </h3>
                <p className="text-sm text-white/60">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


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
    <section ref={ref} className="relative py-12 bg-[#0B1F3B] border-y border-white/10">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start gap-4 group"
            >
              {/* Gold Icon in Dark Gray Square */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#1E293B] flex items-center justify-center border border-[#334155] group-hover:border-[#D4A853]/30 transition-all duration-300 shadow-lg"
              >
                <stat.icon className="w-8 h-8 text-[#D4A853]" />
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                {/* Large White Number */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="mb-2"
                >
                  <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white tracking-tight">
                    {stat.value}
                  </span>
                </motion.div>

                {/* White Title */}
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1.5 leading-tight">
                  {stat.label}
                </h3>

                {/* Lighter White Subtitle */}
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

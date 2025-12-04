"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Home,
  ShieldCheck,
  Heart,
  FileSearch,
  CalendarCheck,
  ClipboardList,
  PenTool,
  CheckCircle2,
} from "lucide-react";

const missionPoints = [
  {
    icon: Home,
    title: "Empower Families",
    description: "Help families become financially independent and self-reliant",
  },
  {
    icon: ShieldCheck,
    title: "Mitigate Risks",
    description: "Protect against significant financial risks and uncertainties",
  },
  {
    icon: Heart,
    title: "Secure Future",
    description: "Ensure a secure future for you and your loved ones",
  },
];

const offers = [
  {
    icon: FileSearch,
    title: "Free Portfolio Reviews",
    description: "Comprehensive analysis of your current investments at no cost",
  },
  {
    icon: CalendarCheck,
    title: "Half-Yearly Financial Check-ups",
    description: "Regular reviews to keep your financial plan on track",
  },
  {
    icon: ClipboardList,
    title: "Personalized Financial Assessments",
    description: "Detailed evaluation of your unique financial situation",
  },
  {
    icon: PenTool,
    title: "Personalized Financial Planning",
    description: "Custom strategies designed specifically for your goals",
  },
];

export const MissionOffersSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="mission" ref={ref} className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Mission Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Our Mission
            </span>
            <h2 className="heading-lg mb-6">What Drives Us Every Day</h2>
            <p className="text-body mb-8">
              Our mission is clear and unwavering: to make a meaningful difference 
              in the financial lives of families across India.
            </p>

            <div className="space-y-4">
              {missionPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex gap-4 p-5 bg-white rounded-2xl shadow-card border border-card-border group hover:shadow-soft transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                    <point.icon className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-1">
                      {point.title}
                    </h3>
                    <p className="text-body-sm">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Offers Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
              Exclusive Benefits
            </span>
            <h2 className="heading-lg mb-6">Exclusive Offers for Clients</h2>
            <p className="text-body mb-8">
              We believe in going the extra mile. These exclusive offers are designed 
              to help you stay on top of your finances.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="relative p-5 bg-white rounded-2xl shadow-card border border-card-border overflow-hidden group"
                >
                  {/* Background accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                      <offer.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-primary mb-2 text-sm">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">{offer.description}</p>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <CheckCircle2 className="w-4 h-4 text-accent/40" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


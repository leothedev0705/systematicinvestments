"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Shield, Eye, Scale, Users, Sparkles } from "lucide-react";

const values = [
  { icon: Heart, label: "Honesty", color: "bg-red-50 text-red-600" },
  { icon: Shield, label: "Integrity", color: "bg-blue-50 text-blue-600" },
  { icon: Eye, label: "Transparency", color: "bg-green-50 text-green-600" },
  { icon: Scale, label: "Ethical", color: "bg-purple-50 text-purple-600" },
  { icon: Users, label: "Customer-Centric Servicing", color: "bg-accent/10 text-accent-dark" },
];

export const ValuesPhilosophySection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Our Core
          </span>
          <h2 className="heading-lg mb-4">Our Values & Philosophy</h2>
          <p className="text-body max-w-2xl mx-auto">
            The principles that guide every decision we make for our clients.
          </p>
        </motion.div>

        {/* Values Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-card border border-card-border"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${value.color}`}>
                <value.icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-navy-700">{value.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative card-elevated p-8 sm:p-10 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>

              <h3 className="heading-sm mb-4">Our Philosophy</h3>

              <p className="text-xl sm:text-2xl font-heading font-medium text-navy-700 leading-relaxed">
                &quot;To make a meaningful difference in people&apos;s lives by equipping them 
                with the knowledge and tools to achieve their financial aspirations.&quot;
              </p>

              <div className="mt-8 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-heading font-bold text-primary">100K</p>
                  <p className="text-sm text-muted">Families to Protect</p>
                </div>
                <div className="w-px bg-card-border" />
                <div className="text-center">
                  <p className="text-3xl font-heading font-bold text-accent">29+</p>
                  <p className="text-sm text-muted">Years of Service</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};






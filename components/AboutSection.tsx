"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Target, Globe, Heart } from "lucide-react";

export const AboutSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="heading-lg mb-4">Who We Are</h2>
          <p className="text-body max-w-2xl mx-auto">
            Learn about our journey, our mission, and our commitment to securing 
            your financial future.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card-base p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="heading-sm">About Systematic Investments</h3>
              </div>

              <p className="text-body mb-6">
                At Systematic Investments, we&apos;re dedicated to empowering families with 
                tailored financial solutions. With a client-centric approach, we&apos;ve 
                served more than 1000 clients globally, managing assets worth 20–25 Cr.
              </p>

              <p className="text-body mb-6">
                Our mission is clear: to protect 100,000 families from significant financial 
                risks, including the loss of income before and after retirement.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-background-secondary rounded-xl">
                  <Globe className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-navy-700">Global Clientele</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-background-secondary rounded-xl">
                  <Heart className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-navy-700">Family-Focused</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* History Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="card-base p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-accent-dark">99</span>
                </div>
                <h3 className="heading-sm">Our Journey Since 1999</h3>
              </div>

              <p className="text-body mb-6">
                In the bustling world of finance, Systematic Investments stands as a beacon 
                of trust and dedication. Founded by the visionary Mr. Vivek Bhande, the company 
                has its roots deeply embedded in hard work and commitment.
              </p>

              <div className="relative p-6 bg-primary/5 rounded-xl border-l-4 border-accent mb-6">
                <Quote className="w-8 h-8 text-accent/30 absolute top-4 right-4" />
                <p className="text-navy-700 italic pr-8">
                  &quot;Since 1999, his relentless pursuit of excellence and unwavering integrity 
                  has sculpted Systematic Investments into a name that truly inspires trust.&quot;
                </p>
              </div>

              <p className="text-body">
                Today, with decades of experience and dedication, we proudly offer a range of 
                financial products designed to help clients achieve their goals with confidence 
                and security.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};



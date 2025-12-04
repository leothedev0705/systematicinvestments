"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Users, TrendingUp, Award } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const Hero: React.FC = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(#0B1F3B 1px, transparent 1px), linear-gradient(90deg, #0B1F3B 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent-dark rounded-full text-sm font-medium border border-accent/20">
                <Shield className="w-4 h-4" />
                Trusted Since 1996
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="heading-xl mb-6 text-balance"
            >
              Your Partner in{" "}
              <span className="relative">
                <span className="gold-gradient-text">Wealth Management</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6C50 2 150 2 198 6"
                    stroke="#D4A853"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeOpacity="0.4"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-body text-lg sm:text-xl mb-8 max-w-xl"
            >
              Systematic Investments is dedicated to empowering families with tailored 
              financial solutions, built on trust, expertise, and a client-centric approach. 
              Join 1000+ families who have secured their financial future with us.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link href="/book-review">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-base px-8 py-4 shadow-lg group inline-flex"
                >
                  Schedule a Free Portfolio Review
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Link>
              <motion.button
                onClick={() => scrollToSection("#services")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary text-base px-8 py-4"
              >
                Explore Our Services
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-8"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-navy-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-navy-600"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">1000+ Happy Clients</p>
                <p className="text-xs text-muted">Trusted by families across India</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                variants={floatVariants}
                initial="initial"
                animate="animate"
                className="relative z-10 bg-white rounded-3xl shadow-elevated p-8 border border-card-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary">Performance Metrics</h3>
                    <p className="text-sm text-muted">Our track record speaks volumes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-accent" />
                      <span className="text-navy-700 font-medium">Years of Experience</span>
                    </div>
                    <span className="text-2xl font-heading font-bold text-primary">25+</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      <span className="text-navy-700 font-medium">Assets Under Management</span>
                    </div>
                    <span className="text-2xl font-heading font-bold text-primary">25 Cr+</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-accent" />
                      <span className="text-navy-700 font-medium">Happy Clients</span>
                    </div>
                    <span className="text-2xl font-heading font-bold text-primary">1000+</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-card-border">
                  <p className="text-sm text-muted text-center">
                    Building wealth, one family at a time
                  </p>
                </div>
              </motion.div>

              {/* Background decorative elements */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-accent/10 rounded-3xl -z-10" />
              <div className="absolute -top-8 -right-8 w-full h-full bg-primary/5 rounded-3xl -z-20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


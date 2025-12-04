"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
  { name: "LIC", logo: "/images/partnered/LIC.PNG" },
  { name: "HDFC ERGO", logo: "/images/partnered/hdfc.PNG" },
  { name: "TATA AIA", logo: "/images/partnered/tata.PNG" },
  { name: "Star Health", logo: "/images/partnered/star.PNG" },
  { name: "New India Assurance", logo: "/images/partnered/newindia.PNG" },
];

// Duplicate for seamless loop
const allPartners = [...partners, ...partners, ...partners];

export default function PartnersCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Trusted Partnerships
          </span>
          <h2 className="heading-lg mb-4">Our Featured Partners</h2>
          <p className="text-body max-w-2xl mx-auto">
            We work with India's most trusted insurance and financial institutions to bring you the best products
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="overflow-hidden py-8">
            <motion.div
              className="flex gap-12"
              animate={{
                x: isPaused ? 0 : [0, -100 * partners.length * 1.5],
              }}
              transition={{
                x: {
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                },
              }}
              style={{
                width: "fit-content",
              }}
            >
              {allPartners.map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 w-48 h-32 flex items-center justify-center hover:shadow-xl hover:border-accent/30 transition-all duration-300 cursor-pointer group">
                    <div className="relative w-full h-full">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain transition-all duration-500"
                        sizes="(max-width: 768px) 120px, 160px"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pause Indicator */}
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-20"
            >
              Paused
            </motion.div>
          )}
        </div>

        {/* Partner Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700 font-medium">IRDAI Registered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-700 font-medium">AMFI Registered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm text-amber-700 font-medium">28+ Years Experience</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


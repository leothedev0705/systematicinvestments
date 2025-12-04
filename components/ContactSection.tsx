"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Calendar,
} from "lucide-react";

export const ContactSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" ref={ref} className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
              Get in Touch
            </span>
            <h2 className="heading-lg mb-4">
              Let&apos;s Talk About Your Financial Goals
            </h2>
            <p className="text-body mb-8">
              Ready to take control of your financial future? Reach out for a free 
              portfolio review or a discovery call. We&apos;re here to help you achieve 
              your financial aspirations.
            </p>

            {/* Contact details */}
            <div className="space-y-4 mb-8">
              <motion.a
                href="https://maps.google.com/?q=Shop+No+42/E3+Brahmand+Phase+6+Thane+West+400607"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-card border border-card-border hover:shadow-soft transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <MapPin className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-primary mb-1">
                    Our Office
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    Shop No. 42/E3, Brahmand Phase 6, Azad Nagar G B Road,
                    <br />
                    Opp. Universal School, Thane West 400607
                  </p>
                </div>
              </motion.a>

              <motion.a
                href="tel:+919821255653"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-card border border-card-border hover:shadow-soft transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-primary mb-1">
                    Phone
                  </p>
                  <p className="text-sm text-muted">+91 98212 55653</p>
                </div>
              </motion.a>

              <motion.a
                href="mailto:viv.bhande@gmail.com"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-card border border-card-border hover:shadow-soft transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-primary mb-1">
                    Email
                  </p>
                  <p className="text-sm text-muted">viv.bhande@gmail.com</p>
                </div>
              </motion.a>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-card border border-card-border">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-primary mb-1">
                    Business Hours
                  </p>
                  <p className="text-sm text-muted">
                    Mon - Sat: 10:00 AM - 7:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-review">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-accent text-base px-6 py-4 shadow-lg group inline-flex"
                >
                  <Calendar className="w-5 h-5" />
                  Book a Free Portfolio Review
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Link>
              <motion.a
                href="tel:+919821255653"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary text-base px-6 py-4"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </motion.a>
            </div>
          </motion.div>

          {/* Right Content - Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <div className="card-elevated h-full min-h-[400px] lg:min-h-full overflow-hidden">
              {/* Map placeholder header */}
              <div className="p-6 border-b border-card-border">
                <h3 className="font-heading font-semibold text-primary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Find Us in Thane West
                </h3>
              </div>

              {/* Map placeholder content */}
              <div className="relative h-[calc(100%-80px)] min-h-[320px] bg-navy-50">
                {/* Grid pattern background */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(#0B1F3B 1px, transparent 1px), linear-gradient(90deg, #0B1F3B 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                  }}
                />

                {/* Center marker */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-accent/40 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-glow">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                    {/* Pulse animation */}
                    <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
                  </motion.div>
                </div>

                {/* Location label */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white rounded-xl p-4 shadow-elevated">
                    <p className="font-heading font-semibold text-primary mb-1">
                      Systematic Investments
                    </p>
                    <p className="text-sm text-muted">
                      Brahmand Phase 6, Thane West, Maharashtra 400607
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


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

          {/* Right Content - Google Maps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <div className="card-elevated h-full min-h-[400px] lg:min-h-full overflow-hidden">
              {/* Map header */}
              <div className="p-6 border-b border-card-border">
                <h3 className="font-heading font-semibold text-primary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Find Us in Thane West
                </h3>
              </div>

              {/* Google Maps Embed */}
              <div className="relative h-[calc(100%-80px)] min-h-[320px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.7699377668597!2d72.96835647520797!3d19.21574168200985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b90b5a6f1233%3A0x5c2e1a8bde1b4f1a!2sBrahmand%20Phase%206%2C%20Azad%20Nagar%2C%20Thane%20West%2C%20Thane%2C%20Maharashtra%20400607!5e0!3m2!1sen!2sin!4v1701701234567!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Systematic Investments Location - Brahmand Phase 6, Thane West"
                  className="absolute inset-0"
                />
                
                {/* Location overlay card */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <a 
                    href="https://maps.google.com/?q=Shop+No+42/E3+Brahmand+Phase+6+Thane+West+400607"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-elevated hover:bg-white transition-colors"
                  >
                    <p className="font-heading font-semibold text-primary mb-1">
                      Systematic Investments
                    </p>
                    <p className="text-sm text-muted">
                      Shop No. 42/E3, Brahmand Phase 6, Thane West 400607
                    </p>
                    <p className="text-xs text-accent mt-2 font-medium">
                      Click to open in Google Maps →
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


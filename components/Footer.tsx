"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUp, Calculator, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Team", href: "#team" },
  { name: "Contact", href: "#contact" },
];

const resourceLinks = [
  { name: "Updates & Bonds", href: "/updates" },
  { name: "Learn Finance", href: "/learn" },
  { name: "Blog & Insights", href: "/blogs" },
];

const toolsLinks = [
  { name: "Retirement Calculator", href: "/tools/retirement" },
  { name: "SIP Calculator", href: "/tools/sip" },
  { name: "Goal Planner", href: "/tools/goal" },
  { name: "All Tools", href: "/tools" },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-white">
      {/* Main footer content */}
      <div className="container-custom py-12 sm:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4 bg-white rounded-xl p-3 inline-block shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Systematic Investment"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>

            <p className="text-white/70 mb-6 max-w-md leading-relaxed">
              Your Partner in Wealth Management. Empowering families with tailored 
              financial solutions, built on trust, expertise, and a client-centric approach.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-accent/20 border-2 border-primary flex items-center justify-center text-xs font-semibold text-accent"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-white/60">1000+ Happy Families</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Resources */}
            <h3 className="font-heading font-semibold text-white mb-4 mt-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Financial Tools */}
            <h3 className="font-heading font-semibold text-white mb-4 mt-6 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-accent" />
              Free Tools
            </h3>
            <ul className="space-y-3">
              {toolsLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919821255653"
                  className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  +91 98212 55653
                </a>
              </li>
              <li>
                <a
                  href="tel:+918291693953"
                  className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  +91 82916 93953
                </a>
              </li>
              <li>
                <a
                  href="mailto:info.systematic@gmail.com"
                  className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-accent" />
                  info.systematic@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Shop+No+42/E3+Brahmand+Phase+6+Thane+West+400607"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/70 hover:text-accent transition-colors text-sm"
                >
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Thane West, Maharashtra 400607</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60 text-center sm:text-left">
              © {currentYear} Systematic Investments. All rights reserved.
            </p>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent transition-colors group"
            >
              <ArrowUp className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};


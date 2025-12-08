"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Process", href: "#process" },
  { name: "Team", href: "#team" },
  { name: "Contact", href: "#contact" },
];

const externalLinks = [
  { name: "Updates", href: "/updates" },
  { name: "Learn", href: "/learn" },
  { name: "Tools", href: "/tools" },
  { name: "Insights", href: "/blogs" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-soft py-2"
            : "bg-transparent py-4"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center group"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="/images/logo.png"
                alt="Systematic Investment"
                width={180}
                height={60}
                className="h-12 sm:h-14 w-auto object-contain"
                priority
              />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                >
                  {link.name}
                </button>
              ))}
              {externalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors rounded-lg hover:bg-accent/10"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link href="/book-review">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-accent text-sm shadow-md inline-flex"
                >
                  Book Free Review
                </motion.span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden"
          >
            <div className="bg-white/98 backdrop-blur-lg border-b border-card-border shadow-elevated mx-4 rounded-2xl overflow-hidden">
              <div className="py-4 px-2">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(link.href)}
                    className="w-full px-4 py-3 text-left text-base font-medium text-navy-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                  >
                    {link.name}
                  </motion.button>
                ))}
                <Link href="/updates" onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    className="w-full px-4 py-3 text-left text-base font-medium text-accent hover:bg-accent/10 rounded-xl transition-colors inline-block"
                  >
                    📢 Updates & Bonds
                  </motion.span>
                </Link>
                <Link href="/learn" onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.05 }}
                    className="w-full px-4 py-3 text-left text-base font-medium text-accent hover:bg-accent/10 rounded-xl transition-colors inline-block"
                  >
                    🎓 Learn Finance
                  </motion.span>
                </Link>
                <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 2) * 0.05 }}
                    className="w-full px-4 py-3 text-left text-base font-medium text-accent hover:bg-accent/10 rounded-xl transition-colors inline-block"
                  >
                    📊 Financial Tools
                  </motion.span>
                </Link>
                <Link href="/blogs" onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 3) * 0.05 }}
                    className="w-full px-4 py-3 text-left text-base font-medium text-accent hover:bg-accent/10 rounded-xl transition-colors inline-block"
                  >
                    📰 Insights & News
                  </motion.span>
                </Link>
                <Link href="/book-review" className="w-full mt-2">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full btn-accent justify-center inline-flex"
                  >
                    Book Free Review
                  </motion.span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


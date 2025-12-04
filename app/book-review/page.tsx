"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  MessageSquare,
  Wallet,
  Clock,
  CheckCircle2,
  Shield,
  TrendingUp,
  Users,
  Send,
} from "lucide-react";

const investmentRanges = [
  "Less than ₹5 Lakhs",
  "₹5 Lakhs - ₹25 Lakhs",
  "₹25 Lakhs - ₹50 Lakhs",
  "₹50 Lakhs - ₹1 Crore",
  "₹1 Crore - ₹5 Crores",
  "More than ₹5 Crores",
  "Prefer not to say",
];

const investmentGoals = [
  "Retirement Planning",
  "Children's Education",
  "Wealth Creation",
  "Tax Planning",
  "Marriage Planning",
  "Emergency Fund",
  "Real Estate Purchase",
  "Business Expansion",
  "Other",
];

const preferredTimes = [
  "Morning (9 AM - 12 PM)",
  "Afternoon (12 PM - 3 PM)",
  "Evening (3 PM - 6 PM)",
  "Late Evening (6 PM - 8 PM)",
  "Weekend Only",
  "Any Time",
];

const benefits = [
  {
    icon: Shield,
    title: "100% Confidential",
    description: "Your information is completely secure",
  },
  {
    icon: TrendingUp,
    title: "Expert Analysis",
    description: "25+ years of market experience",
  },
  {
    icon: Users,
    title: "Personalized Advice",
    description: "Tailored to your unique goals",
  },
];

export default function BookReviewPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    occupation: "",
    investmentRange: "",
    goals: [] as string[],
    existingInvestments: "",
    preferredTime: "",
    preferredDate: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Google Apps Script Web App URL - Replace with your deployed script URL
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";
      
      // Prepare data for Google Sheets
      const submissionData = {
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        occupation: formData.occupation,
        investmentRange: formData.investmentRange,
        goals: formData.goals.join(", "),
        existingInvestments: formData.existingInvestments,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message,
      };

      if (GOOGLE_SCRIPT_URL) {
        // Submit to Google Sheets via Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", // Required for Google Apps Script
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });
        
        console.log("Form submitted to Google Sheets");
      } else {
        // Fallback: Log to console if no URL configured
        console.log("Form data (Google Sheets URL not configured):", submissionData);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your request. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-elevated p-8 sm:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-4">
            Thank You!
          </h1>
          <p className="text-muted mb-6">
            Your request for a free portfolio review has been submitted successfully. 
            Our team will contact you within 24 hours to schedule your consultation.
          </p>

          <div className="bg-primary/5 rounded-2xl p-4 mb-8">
            <p className="text-sm text-navy-700">
              <strong>What&apos;s Next?</strong>
              <br />
              Mr. Vivek Bhande or a team member will call you at your preferred time 
              to discuss your financial goals and review your portfolio.
            </p>
          </div>

          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-card-border sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Systematic Investment"
                width={150}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container-custom py-10 sm:py-16">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28">
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
                Free Consultation
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-4">
                Book Your Free Portfolio Review
              </h1>
              <p className="text-muted mb-8">
                Take the first step towards financial freedom. Get a comprehensive 
                analysis of your current investments and personalized recommendations 
                from our expert team.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-sm">
                        {benefit.title}
                      </h3>
                      <p className="text-xs text-muted">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="bg-primary rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/images/Founder1.png"
                    alt="Vivek Bhande"
                    width={60}
                    height={60}
                    className="w-14 h-14 rounded-xl object-cover object-top"
                  />
                  <div>
                    <p className="font-semibold">Vivek Bhande</p>
                    <p className="text-white/70 text-sm">Founder & Financial Expert</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm italic">
                  &quot;Every family deserves a clear financial roadmap. Let me help 
                  you build one that secures your future.&quot;
                </p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">25+</p>
                    <p className="text-xs text-white/60">Years Exp.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">1000+</p>
                    <p className="text-xs text-white/60">Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">25Cr+</p>
                    <p className="text-xs text-white/60">AUM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-elevated p-6 sm:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-heading font-semibold text-primary mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" />
                    Personal Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="18"
                        max="100"
                        placeholder="Your age"
                        className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your@email.com"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+91 98765 43210"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        placeholder="e.g., Business Owner, IT Professional, Doctor"
                        className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Investment Details */}
                <div className="pt-4 border-t border-card-border">
                  <h2 className="text-lg font-heading font-semibold text-primary mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-accent" />
                    Investment Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Current Investment Portfolio Value
                      </label>
                      <select
                        name="investmentRange"
                        value={formData.investmentRange}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select a range</option>
                        {investmentRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Investment Goals <span className="text-muted font-normal">(Select all that apply)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {investmentGoals.map((goal) => (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => handleGoalToggle(goal)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              formData.goals.includes(goal)
                                ? "bg-accent text-primary"
                                : "bg-primary/5 text-navy-700 hover:bg-primary/10"
                            }`}
                          >
                            {formData.goals.includes(goal) && (
                              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                            )}
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Existing Investments <span className="text-muted font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="existingInvestments"
                        value={formData.existingInvestments}
                        onChange={handleInputChange}
                        placeholder="e.g., Mutual Funds, FDs, Stocks, Insurance"
                        className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="pt-4 border-t border-card-border">
                  <h2 className="text-lg font-heading font-semibold text-primary mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Schedule Your Consultation
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Preferred Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">Select time slot</option>
                          {preferredTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Message */}
                <div className="pt-4 border-t border-card-border">
                  <h2 className="text-lg font-heading font-semibold text-primary mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    Additional Information
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      Message / Questions <span className="text-muted font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about your financial concerns, questions, or anything specific you'd like to discuss..."
                      className="w-full px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Privacy Note */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <p className="text-xs text-muted flex items-start gap-2">
                    <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                    Your information is 100% confidential and will only be used to 
                    contact you regarding your portfolio review. We never share your 
                    data with third parties.
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full btn-accent text-lg py-4 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Book My Free Review
                    </span>
                  )}
                </motion.button>

                {/* Contact Alternative */}
                <p className="text-center text-sm text-muted">
                  Prefer to talk directly?{" "}
                  <a
                    href="tel:+919821255653"
                    className="text-primary font-medium hover:text-accent transition-colors"
                  >
                    Call +91 98212 55653
                  </a>
                  {" or "}
                  <a
                    href="tel:+918291693953"
                    className="text-primary font-medium hover:text-accent transition-colors"
                  >
                    +91 82916 93953
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Newspaper,
  TrendingUp,
  Calendar,
  Share2,
  Download,
  ArrowRight,
  Bell,
  IndianRupee,
  Percent,
  Clock,
  Check,
} from "lucide-react";

// Sample updates data - In production, this would come from an API/CMS
const updates = [
  {
    id: 1,
    type: "bond",
    title: "RBI Floating Rate Savings Bonds 2024",
    description: "Government-backed savings bonds with floating interest rate linked to NSC. Current rate: 8.05% p.a. Ideal for conservative investors seeking safe returns.",
    rate: "8.05%",
    minInvestment: "₹1,000",
    tenure: "7 years",
    date: "December 2024",
    isNew: true,
    features: ["Government Guaranteed", "Tax as per slab", "Half-yearly interest"],
  },
  {
    id: 2,
    type: "bond",
    title: "Sovereign Gold Bonds (SGB) - Series IV",
    description: "Invest in gold digitally with additional 2.5% annual interest. Capital gains tax-free on maturity. Better than physical gold investment.",
    rate: "2.50%",
    minInvestment: "1 gram",
    tenure: "8 years (5 yr exit)",
    date: "November 2024",
    isNew: true,
    features: ["Tax-free on maturity", "2.5% annual bonus", "No storage cost"],
  },
  {
    id: 3,
    type: "news",
    title: "NPS Vatsalya Launched for Children",
    description: "New pension scheme for minors. Parents can now start retirement planning for children from birth. Contribution up to ₹50,000/year eligible for 80CCD(1B).",
    date: "October 2024",
    isNew: false,
    features: ["Start from birth", "Tax benefits under 80CCD(1B)", "Long-term wealth creation"],
  },
  {
    id: 4,
    type: "bond",
    title: "NHAI Tax-Free Bonds 2024",
    description: "AAA-rated infrastructure bonds offering tax-free interest. Limited issuance for retail investors. Lock-in period of 10-15 years.",
    rate: "5.75%",
    minInvestment: "₹10,000",
    tenure: "10 years",
    date: "October 2024",
    isNew: false,
    features: ["Tax-free interest", "AAA rated", "Quarterly interest option"],
  },
  {
    id: 5,
    type: "news",
    title: "New LTCG Tax Rules - FY 2024-25",
    description: "Equity LTCG tax increased to 12.5% from 10%. Exemption limit raised to ₹1.25 lakh from ₹1 lakh. Plan your tax harvesting accordingly.",
    date: "September 2024",
    isNew: false,
    features: ["12.5% tax rate", "₹1.25L exemption", "Effective from July 2024"],
  },
];

interface UpdateCardProps {
  update: typeof updates[0];
  onShare: (update: typeof updates[0]) => void;
  onDownload: (update: typeof updates[0]) => void;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update, onShare, onDownload }) => {
  const isBond = update.type === "bond";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* New badge */}
      {update.isNew && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-accent text-primary text-xs font-semibold rounded-full">
            <Bell className="w-3 h-3" />
            NEW
          </span>
        </div>
      )}

      {/* Type indicator */}
      <div className={`h-1.5 ${isBond ? 'bg-gradient-to-r from-accent to-accent-light' : 'bg-gradient-to-r from-primary to-primary-light'}`} />

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isBond ? 'bg-accent/10' : 'bg-primary/10'
          }`}>
            {isBond ? (
              <IndianRupee className={`w-5 h-5 sm:w-6 sm:h-6 ${isBond ? 'text-accent-dark' : 'text-primary'}`} />
            ) : (
              <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isBond ? 'bg-accent/20 text-accent-dark' : 'bg-primary/10 text-primary'
              }`}>
                {isBond ? 'Government Bond' : 'Scheme Launch'}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {update.date}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-heading font-semibold text-primary leading-tight pr-8 sm:pr-0">
              {update.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted mb-3 sm:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
          {update.description}
        </p>

        {/* Bond-specific details */}
        {isBond && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 p-2.5 sm:p-3 bg-background-secondary rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 text-accent-dark font-bold text-sm sm:text-lg">
                <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
                {update.rate}
              </div>
              <p className="text-[10px] sm:text-xs text-muted">Rate</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="font-bold text-primary text-sm sm:text-lg truncate px-1">{update.minInvestment}</div>
              <p className="text-[10px] sm:text-xs text-muted">Min</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 text-primary font-bold text-sm sm:text-lg">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{update.tenure}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted">Tenure</p>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
          {update.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs px-2 py-0.5 sm:py-1 bg-background-secondary text-muted rounded-full"
            >
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent-dark" />
              {feature}
            </span>
          ))}
          {update.features.length > 3 && (
            <span className="text-[11px] sm:text-xs text-muted">+{update.features.length - 3} more</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onShare(update)}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-accent hover:bg-accent-light text-primary rounded-xl text-xs sm:text-sm font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDownload(update)}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs sm:text-sm font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Download
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export const UpdatesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState<"all" | "bond" | "news">("all");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const filteredUpdates = updates.filter(
    (u) => filter === "all" || u.type === filter
  );

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShare = (update: typeof updates[0]) => {
    const text = `📢 *${update.title}*\n\n${update.description}\n\n${
      update.type === "bond"
        ? `💰 Rate: ${update.rate}\n📊 Min: ${update.minInvestment}\n⏰ Tenure: ${update.tenure}\n\n`
        : ""
    }🏢 Shared by Systematic Investments\n📞 +91 98212 55653\n🌐 www.systematicinvestments.in`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    showNotification("Opening WhatsApp...");
  };

  const handleDownload = async (update: typeof updates[0]) => {
    // Generate PDF content
    const content = `
SYSTEMATIC INVESTMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${update.type === "bond" ? "📈 BOND UPDATE" : "📰 NEWS UPDATE"}

${update.title}
Date: ${update.date}

${update.description}

${
  update.type === "bond"
    ? `
BOND DETAILS:
• Interest Rate: ${update.rate}
• Minimum Investment: ${update.minInvestment}
• Tenure: ${update.tenure}
`
    : ""
}
KEY FEATURES:
${update.features.map((f) => `• ${f}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For more information, contact:
Systematic Investments
📞 +91 98212 55653
📧 info.systematic@gmail.com
📍 Shop No. 42/E3, Brahmand Phase 6, Thane West 400607

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    // Create and download text file (simple approach)
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${update.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Download started!");
  };

  return (
    <section id="updates" ref={ref} className="section-padding bg-gradient-to-b from-background-secondary to-white">
      <div className="container-custom">
        {/* Toast notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg flex items-center gap-2 text-sm"
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-accent/20 text-accent-dark rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Latest Updates
          </span>
          <h2 className="heading-lg mb-3 sm:mb-4">Financial News & Bonds</h2>
          <p className="text-body max-w-2xl mx-auto px-4 sm:px-0">
            Stay informed with the latest investment opportunities, government bonds, 
            and important financial updates.
          </p>
        </motion.div>

        {/* Filter tabs - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 px-2 sm:px-0"
        >
          {[
            { key: "all", label: "All", fullLabel: "All Updates", icon: Newspaper },
            { key: "bond", label: "Bonds", fullLabel: "Bonds", icon: IndianRupee },
            { key: "news", label: "News", fullLabel: "News", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as "all" | "bond" | "news")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                filter === tab.key
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-muted hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="sm:hidden">{tab.label}</span>
              <span className="hidden sm:inline">{tab.fullLabel}</span>
            </button>
          ))}
        </motion.div>

        {/* Updates grid - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredUpdates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <UpdateCard
                update={update}
                onShare={handleShare}
                onDownload={handleDownload}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Subscribe CTA - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-16 bg-gradient-to-br from-primary via-primary-light to-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white mb-3 sm:mb-4">
              Never Miss an Update
            </h3>
            <p className="text-white/80 max-w-lg mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-2 sm:px-0">
              Get notified about new bonds, investment opportunities, and important 
              financial updates directly on WhatsApp.
            </p>
            <motion.a
              href="https://wa.me/919821255653?text=Hi!%20I%20want%20to%20receive%20financial%20updates%20and%20bond%20notifications."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent hover:bg-accent-light text-primary rounded-full text-sm sm:text-lg font-semibold transition-colors shadow-lg"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Subscribe on WhatsApp
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

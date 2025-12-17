"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Newspaper,
  TrendingUp,
  Calendar,
  Share2,
  ArrowRight,
  ArrowLeft,
  Bell,
  IndianRupee,
  Percent,
  Clock,
  Check,
  FileText,
  Search,
  BookOpen,
  Shield,
  Target,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Type definition for updates
interface Update {
  id: string;
  type: "bond" | "news" | "document";
  category: string;
  title: string;
  description: string;
  fullDescription?: string;
  rate?: string;
  minInvestment?: string;
  maxInvestment?: string;
  tenure?: string;
  date: string;
  isNew: boolean;
  features: string[];
  documentUrl?: string;
  imageUrl?: string;
}

const categories = [
  { key: "all", label: "All Updates", icon: Newspaper },
  { key: "bond", label: "Bonds & NCDs", icon: IndianRupee },
  { key: "news", label: "Market News", icon: TrendingUp },
  { key: "document", label: "Documents", icon: FileText },
];

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch updates from CMS API
  useEffect(() => {
    async function fetchUpdates() {
      try {
        const res = await fetch("/api/cms/updates");
        if (res.ok) {
          const data = await res.json();
          setUpdates(data);
        }
      } catch (error) {
        console.error("Failed to fetch updates:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUpdates();
  }, []);

  const filteredUpdates = updates.filter((u) => {
    const matchesFilter = filter === "all" || u.type === filter;
    const matchesSearch = u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShare = (update: Update) => {
    const text = `📢 *${update.title}*\n\n${update.description}\n\n${
      update.type === "bond" && update.rate
        ? `💰 Rate: ${update.rate}\n📊 Min: ${update.minInvestment}\n⏰ Tenure: ${update.tenure}\n\n`
        : ""
    }🏢 Shared by Systematic Investments\n📞 +91 98212 55653\n🌐 www.systematicinvestments.in`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Toast notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <Check className="w-5 h-5 text-green-400" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section with Background Image */}
        <section className="pt-28 pb-12 relative overflow-hidden">
          {/* Background Image - Stock market/finance themed */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary-light/85" />
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }} />
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="container-custom relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
                <Bell className="w-4 h-4" />
                Stay Updated with Latest Opportunities
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
                Updates & <span className="text-accent">Announcements</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Latest bonds, NCDs, government schemes, market news, and important 
                documents. Share with family or download for reference.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 border-b border-gray-100 bg-white sticky top-16 z-30 shadow-sm">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setFilter(cat.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                      filter === cat.key
                        ? "bg-primary text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Updates Grid */}
        <section className="py-12">
          <div className="container-custom">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredUpdates.length === 0 ? (
              <div className="text-center py-16">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No updates found</h3>
                <p className="text-gray-500">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpdates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
                  >
                    {/* New badge */}
                    {update.isNew && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          <Bell className="w-3 h-3" />
                          NEW
                        </span>
                      </div>
                    )}

                    {/* Type indicator */}
                    <div className={`h-1.5 flex-shrink-0 ${
                      update.type === "bond" ? "bg-gradient-to-r from-amber-400 to-amber-600" :
                      update.type === "news" ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                      "bg-gradient-to-r from-purple-400 to-purple-600"
                    }`} />

                    {/* Image - Fixed height to maintain card shape */}
                    <div className="relative w-full h-48 bg-gray-50 flex-shrink-0 overflow-hidden">
                      {update.imageUrl ? (
                        update.imageUrl.startsWith("data:") ? (
                          <img
                            src={update.imageUrl}
                            alt={update.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={update.imageUrl}
                            alt={update.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                            update.type === "bond" ? "bg-amber-50" :
                            update.type === "news" ? "bg-blue-50" : "bg-purple-50"
                          }`}>
                            {update.type === "bond" ? (
                              <IndianRupee className="w-8 h-8 text-amber-600" />
                            ) : update.type === "news" ? (
                              <Newspaper className="w-8 h-8 text-blue-600" />
                            ) : (
                              <FileText className="w-8 h-8 text-purple-600" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 relative flex-1 flex flex-col">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          update.type === "bond" ? "bg-amber-50" :
                          update.type === "news" ? "bg-blue-50" : "bg-purple-50"
                        }`}>
                          {update.type === "bond" ? (
                            <IndianRupee className="w-6 h-6 text-amber-600" />
                          ) : update.type === "news" ? (
                            <Newspaper className="w-6 h-6 text-blue-600" />
                          ) : (
                            <FileText className="w-6 h-6 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              update.type === "bond" ? "bg-amber-100 text-amber-700" :
                              update.type === "news" ? "bg-blue-100 text-blue-700" :
                              "bg-purple-100 text-purple-700"
                            }`}>
                              {update.category || update.type}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {update.date}
                            </span>
                          </div>
                          <h3 className="text-lg font-heading font-semibold text-gray-900 leading-tight">
                            {update.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {update.description}
                      </p>

                      {/* Bond-specific details */}
                      {update.type === "bond" && update.rate && (
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-green-600 font-bold">
                              <Percent className="w-3 h-3" />
                              {update.rate}
                            </div>
                            <p className="text-xs text-gray-500">Rate</p>
                          </div>
                          <div className="text-center border-x border-gray-200">
                            <div className="font-bold text-gray-900 text-sm">{update.minInvestment}</div>
                            <p className="text-xs text-gray-500">Min</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-sm">
                              <Clock className="w-3 h-3" />
                              {update.tenure}
                            </div>
                            <p className="text-xs text-gray-500">Tenure</p>
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {update.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            <Check className="w-3 h-3 text-green-500" />
                            {feature}
                          </span>
                        ))}
                        {update.features.length > 3 && (
                          <span className="text-xs text-gray-400 px-2 py-1">
                            +{update.features.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleShare(update)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary via-primary-light to-primary rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-4">
                  Get Updates on WhatsApp
                </h3>
                <p className="text-white/80 max-w-lg mx-auto mb-8">
                  Receive new bonds, investment opportunities, and market updates 
                  directly on WhatsApp. Never miss an opportunity!
                </p>
                <motion.a
                  href="https://wa.me/919821255653?text=Hi!%20I%20want%20to%20receive%20financial%20updates%20and%20bond%20notifications."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-semibold transition-colors shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                  Subscribe Now
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/learn" className="group">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
                    Financial Education
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Watch videos and presentations on money management, investing, and more.
                  </p>
                  <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Learning <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </Link>

              <Link href="/tools" className="group">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
                    Financial Calculators
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Plan your retirement, SIPs, goals with our free calculators.
                  </p>
                  <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Use Tools <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </Link>

              <Link href="/book-review" className="group">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
                    Free Portfolio Review
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized advice from our 26+ years experienced team.
                  </p>
                  <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Book Now <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}



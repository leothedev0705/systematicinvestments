"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Play,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Users,
  Star,
  Search,
  GraduationCap,
  TrendingUp,
  Shield,
  Calculator,
  FileText,
  Download,
  Share2,
  ChevronRight,
  Award,
  CheckCircle,
  PlayCircle,
  Presentation,
  Video,
  X,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Type definitions
interface LearnContent {
  id: string;
  category: string;
  type: "video" | "presentation";
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  downloadUrl?: string;
  duration: string;
  level: string;
  views: string;
  rating: number;
  instructor: string;
  topics: string[];
  isFeatured: boolean;
  isActive: boolean;
}

interface Category {
  key: string;
  label: string;
  fullLabel: string;
}

// Default categories (in case API doesn't return them)
const defaultCategories: Category[] = [
  { key: "all", label: "All", fullLabel: "All Content" },
  { key: "basics", label: "Basics", fullLabel: "Basics" },
  { key: "investing", label: "Invest", fullLabel: "Investing" },
  { key: "mfd", label: "MFD", fullLabel: "For MFDs" },
  { key: "retirement", label: "Retire", fullLabel: "Retirement" },
  { key: "tax", label: "Tax", fullLabel: "Tax Planning" },
];

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  all: BookOpen,
  basics: GraduationCap,
  investing: TrendingUp,
  mfd: Award,
  retirement: Shield,
  tax: Calculator,
};

// Educational content - Real YouTube finance education videos from Indian creators
const educationalContent = [
  // Basics
  {
    id: 1,
    category: "basics",
    type: "video",
    title: "Personal Finance Basics - Where to Start Your Financial Journey",
    description: "A comprehensive beginner's guide to personal finance. Learn about savings, budgeting, emergency funds, and creating your first financial plan.",
    thumbnail: "https://i.ytimg.com/vi/4j2emMn7UaI/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/4j2emMn7UaI",
    duration: "18 min",
    level: "Beginner",
    views: "1.2M",
    rating: 4.8,
    instructor: "CA Rachana Ranade",
    topics: ["Savings", "Budgeting", "Emergency Fund", "Financial Goals"],
    isFeatured: true,
  },
  {
    id: 2,
    category: "basics",
    type: "video",
    title: "Power of Compounding - How Money Grows",
    description: "Understand the magic of compound interest and why starting early is the biggest advantage in wealth creation.",
    thumbnail: "https://i.ytimg.com/vi/P1ww1IXRfTA/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/P1ww1IXRfTA",
    duration: "12 min",
    level: "Beginner",
    views: "890K",
    rating: 4.7,
    instructor: "Ankur Warikoo",
    topics: ["Compounding", "Time Value", "Early Investing", "Wealth Creation"],
  },
  {
    id: 3,
    category: "basics",
    type: "presentation",
    title: "Complete Guide to Personal Finance",
    description: "A comprehensive presentation covering all aspects of personal finance - from saving to investing to insurance.",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop",
    duration: "45 slides",
    level: "Beginner",
    views: "3.2K",
    rating: 4.9,
    instructor: "Systematic Investments",
    topics: ["Saving", "Investing", "Insurance", "Tax"],
    downloadUrl: "#",
  },
  // Investing
  {
    id: 4,
    category: "investing",
    type: "video",
    title: "Mutual Funds Explained in Hindi - Types & How to Invest",
    description: "Everything you need to know about mutual funds - types, how they work, expense ratio, and how to start investing in mutual funds.",
    thumbnail: "https://i.ytimg.com/vi/RbfWMOYDG0s/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/RbfWMOYDG0s",
    duration: "22 min",
    level: "Beginner",
    views: "3.8M",
    rating: 4.9,
    instructor: "Pranjal Kamra",
    topics: ["Mutual Funds", "SIP", "Expense Ratio", "NAV"],
    isFeatured: true,
  },
  {
    id: 5,
    category: "investing",
    type: "video",
    title: "SIP Investment Guide - How to Start & Best Practices",
    description: "Complete guide to SIP investing. Learn how SIP works, benefits of rupee cost averaging, and common mistakes to avoid.",
    thumbnail: "https://i.ytimg.com/vi/WsUVYf8aJNk/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/WsUVYf8aJNk",
    duration: "16 min",
    level: "Beginner",
    views: "2.1M",
    rating: 4.8,
    instructor: "Asset Yogi",
    topics: ["SIP", "Rupee Cost Averaging", "Mutual Funds", "Investment"],
  },
  {
    id: 6,
    category: "investing",
    type: "video",
    title: "How to Select Best Mutual Funds - Step by Step",
    description: "Learn how to analyze and select the best mutual funds based on returns, risk, fund manager, and expense ratio.",
    thumbnail: "https://i.ytimg.com/vi/hVHdE0Bj5JU/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/hVHdE0Bj5JU",
    duration: "20 min",
    level: "Intermediate",
    views: "1.5M",
    rating: 4.7,
    instructor: "CA Rachana Ranade",
    topics: ["Fund Selection", "Returns Analysis", "Risk Assessment", "AMC"],
  },
  // For MFDs
  {
    id: 7,
    category: "mfd",
    type: "video",
    title: "How to Become MFD - Mutual Fund Distributor Complete Guide",
    description: "Step-by-step guide to becoming a Mutual Fund Distributor. NISM exam, AMFI registration, ARN code, and starting your MFD business.",
    thumbnail: "https://i.ytimg.com/vi/NxPj9gIjDd0/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/NxPj9gIjDd0",
    duration: "28 min",
    level: "Professional",
    views: "450K",
    rating: 4.9,
    instructor: "Asset Yogi",
    topics: ["NISM Exam", "AMFI Registration", "ARN Code", "MFD Business"],
    isFeatured: true,
  },
  {
    id: 8,
    category: "mfd",
    type: "video",
    title: "NISM Series VA Exam Preparation - Complete Course",
    description: "Everything you need to clear NISM Mutual Fund Distributors exam. Key topics, practice questions, and exam tips.",
    thumbnail: "https://i.ytimg.com/vi/UyVP2GkLdKw/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/UyVP2GkLdKw",
    duration: "45 min",
    level: "Professional",
    views: "280K",
    rating: 4.8,
    instructor: "Finance Tube",
    topics: ["NISM Exam", "Certification", "Study Material", "Exam Tips"],
  },
  {
    id: 9,
    category: "mfd",
    type: "presentation",
    title: "MFD Business Plan Template",
    description: "Ready-to-use business plan template for new and aspiring Mutual Fund Distributors. Includes financial projections.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    duration: "30 slides",
    level: "Professional",
    views: "2.1K",
    rating: 4.7,
    instructor: "Systematic Investments",
    topics: ["Business Model", "Revenue Projections", "Marketing Plan", "Growth Strategy"],
    downloadUrl: "#",
  },
  // Retirement
  {
    id: 10,
    category: "retirement",
    type: "video",
    title: "Retirement Planning India - How Much Money You Need?",
    description: "Calculate your retirement corpus. Learn about inflation impact, healthcare costs, and creating a retirement income strategy.",
    thumbnail: "https://i.ytimg.com/vi/VyLPMH8OGXM/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/VyLPMH8OGXM",
    duration: "24 min",
    level: "Intermediate",
    views: "1.8M",
    rating: 4.9,
    instructor: "Labour Law Advisor",
    topics: ["Retirement Corpus", "Inflation", "Pension Planning", "FIRE"],
    isFeatured: true,
  },
  {
    id: 11,
    category: "retirement",
    type: "video",
    title: "NPS Complete Guide - National Pension System Explained",
    description: "Everything about NPS - account types, tax benefits under 80CCD, fund choices, and withdrawal rules explained in detail.",
    thumbnail: "https://i.ytimg.com/vi/xBmC7Eg8mMY/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/xBmC7Eg8mMY",
    duration: "20 min",
    level: "Intermediate",
    views: "2.4M",
    rating: 4.8,
    instructor: "CA Rachana Ranade",
    topics: ["NPS", "80CCD", "Pension", "Tax Benefits"],
  },
  // Tax Planning
  {
    id: 12,
    category: "tax",
    type: "video",
    title: "Income Tax New vs Old Regime - Which is Better for You?",
    description: "Detailed comparison of new and old tax regime with calculations. Find out which regime saves more tax based on your salary.",
    thumbnail: "https://i.ytimg.com/vi/VU6rLiT0KqQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/VU6rLiT0KqQ",
    duration: "18 min",
    level: "Beginner",
    views: "4.2M",
    rating: 4.9,
    instructor: "CA Rachana Ranade",
    topics: ["Tax Regime", "80C Deductions", "Tax Calculation", "Tax Saving"],
    isFeatured: true,
  },
  {
    id: 13,
    category: "tax",
    type: "video",
    title: "Section 80C Deductions - Complete Tax Saving Options",
    description: "All tax saving investments under Section 80C - ELSS, PPF, NPS, LIC, home loan principal, and more. Maximize your ₹1.5 lakh limit.",
    thumbnail: "https://i.ytimg.com/vi/8K8Hkgln8mw/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/8K8Hkgln8mw",
    duration: "15 min",
    level: "Beginner",
    views: "2.8M",
    rating: 4.8,
    instructor: "Pranjal Kamra",
    topics: ["80C", "ELSS", "PPF", "Tax Saving", "Deductions"],
  },
  {
    id: 14,
    category: "tax",
    type: "presentation",
    title: "Complete Tax Planning Guide FY 2024-25",
    description: "Comprehensive presentation on tax planning strategies for the current financial year.",
    thumbnail: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=600&auto=format&fit=crop",
    duration: "50 slides",
    level: "Intermediate",
    views: "2.8K",
    rating: 4.9,
    instructor: "Systematic Investments",
    topics: ["Tax Slabs", "Deductions", "Capital Gains", "Tax-Free Income"],
    downloadUrl: "#",
  },
];

// Video Modal Component
const VideoModal = ({ video, onClose }: { video: LearnContent; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <div className="aspect-video bg-black">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-heading font-bold text-primary mb-2">{video.title}</h3>
          <p className="text-muted text-sm sm:text-base mb-4">{video.description}</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {video.topics.map((topic, idx) => (
              <span key={idx} className="px-2 sm:px-3 py-1 bg-accent/10 text-accent-dark rounded-full text-xs sm:text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function LearnPage() {
  const [educationalContent, setEducationalContent] = useState<LearnContent[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<LearnContent | null>(null);

  // Fetch content from CMS API
  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/cms/learn");
        if (res.ok) {
          const data = await res.json();
          setEducationalContent(data.content?.filter((c: LearnContent) => c.isActive) || []);
          if (data.categories?.length > 0) {
            setCategories([{ key: "all", label: "All", fullLabel: "All Content" }, ...data.categories]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const filteredContent = educationalContent.filter((item) => {
    const matchesFilter = filter === "all" || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featuredContent = educationalContent.filter(item => item.isFeatured);

  const handleShare = (item: LearnContent) => {
    const text = `🎓 *${item.title}*\n\n${item.description}\n\n🎬 Watch on Systematic Investments\n📞 +91 98212 55653`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-background-secondary via-white to-background-secondary">
        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && selectedVideo.type === "video" && (
            <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
          )}
        </AnimatePresence>

        {/* Hero Section with Background Image */}
        <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden">
          {/* Background Image - Education/learning themed */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary-light/85" />
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
          </div>
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="container-custom relative z-10 px-4 sm:px-6">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 sm:mb-6 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs sm:text-sm mb-4 sm:mb-6">
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Free Financial Education
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 sm:mb-6">
                Learn & <span className="text-accent">Grow</span>
              </h1>
              <p className="text-base sm:text-xl text-white/80 leading-relaxed mb-6 sm:mb-8">
                Master personal finance, investing, and wealth management with our 
                curated videos and presentations.
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-8">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-accent">{educationalContent.length}+</p>
                  <p className="text-xs sm:text-sm text-white/60">Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-accent">50K+</p>
                  <p className="text-xs sm:text-sm text-white/60">Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-accent">4.8</p>
                  <p className="text-xs sm:text-sm text-white/60">Avg Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="py-8 sm:py-12 -mt-6 sm:-mt-8 relative z-10">
          <div className="container-custom px-4 sm:px-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-card-border">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-heading font-bold text-primary flex items-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-accent fill-accent" />
                  Featured Lessons
                </h2>
                <span className="text-xs sm:text-sm text-muted">{featuredContent.length} videos</span>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {featuredContent.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => item.type === "video" && setSelectedVideo(item)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-2 sm:mb-3">
                      {/* Actual Thumbnail Image */}
                      {item.thumbnail && (
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <PlayCircle className="w-8 h-8 sm:w-12 sm:h-12 text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-lg" />
                      </div>
                      <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/80 rounded text-white text-[10px] sm:text-xs font-medium">
                        {item.duration}
                      </div>
                    </div>
                    <h3 className="font-semibold text-primary text-xs sm:text-base line-clamp-2 group-hover:text-accent-dark transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] sm:text-sm text-muted mt-0.5 sm:mt-1">{item.views} views</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-4 sm:py-8 border-b border-card-border bg-white sticky top-16 z-30 shadow-sm">
          <div className="container-custom px-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm sm:text-base"
                />
              </div>

              {/* Filter Tabs - Horizontally scrollable on mobile */}
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
                {categories.map((cat) => {
                  const IconComponent = categoryIcons[cat.key] || BookOpen;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setFilter(cat.key)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        filter === cat.key
                          ? "bg-primary text-white shadow-lg"
                          : "bg-background-secondary text-muted hover:bg-gray-200"
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="sm:hidden">{cat.label}</span>
                      <span className="hidden sm:inline">{cat.fullLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-8 sm:py-12">
          <div className="container-custom px-4 sm:px-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-muted mb-2">No lessons found</h3>
                <p className="text-muted text-sm sm:text-base">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredContent.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl sm:rounded-2xl border border-card-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Thumbnail / Header */}
                    <div 
                      className="relative aspect-video bg-gray-100 cursor-pointer overflow-hidden"
                      onClick={() => item.type === "video" && setSelectedVideo(item)}
                    >
                      {/* Actual Thumbnail Image */}
                      {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light" />
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        {item.type === "video" ? (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1 drop-shadow-lg" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Presentation className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                      
                      {/* Duration badge */}
                      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 px-2 py-0.5 sm:py-1 bg-black/80 rounded text-white text-[10px] sm:text-xs flex items-center gap-1 font-medium">
                        {item.type === "video" ? <Video className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                        {item.duration}
                      </div>
                      
                      {/* Level badge */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 py-0.5 sm:py-1 bg-white/95 rounded-full text-[10px] sm:text-xs font-medium text-primary shadow-sm">
                        {item.level}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] sm:text-xs font-medium text-accent-dark uppercase tracking-wide">
                          {categories.find(c => c.key === item.category)?.fullLabel || item.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent fill-accent" />
                          <span className="text-xs sm:text-sm font-medium text-primary">{item.rating}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-lg font-heading font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent-dark transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted mb-3 sm:mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                        {item.topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 bg-background-secondary text-muted rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Meta & Actions */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-card-border">
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-sm text-muted">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            {item.views}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                            {item.instructor}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={() => handleShare(item)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background-secondary hover:bg-accent/20 flex items-center justify-center text-muted hover:text-accent-dark transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          {item.type === "presentation" && item.downloadUrl && (
                            <a
                              href={item.downloadUrl}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background-secondary hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Learning Path Section */}
        <section className="py-12 sm:py-16 bg-background-secondary">
          <div className="container-custom px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-3 sm:mb-4">
                Recommended Learning Paths
              </h2>
              <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto">
                Follow these structured paths to master financial planning step by step.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Beginner Path */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-card-border shadow-sm"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-accent-dark" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-primary mb-2">
                  Beginner&apos;s Path
                </h3>
                <p className="text-muted text-xs sm:text-sm mb-4">
                  Start your financial journey with the fundamentals.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-dark flex-shrink-0" />
                    Financial Planning 101
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-dark flex-shrink-0" />
                    Understanding Inflation
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-dark flex-shrink-0" />
                    Tax Saving Basics
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-dark flex-shrink-0" />
                    Mutual Funds Explained
                  </li>
                </ul>
                <button 
                  onClick={() => setFilter("basics")}
                  className="w-full py-2.5 sm:py-3 bg-accent/20 hover:bg-accent/30 text-accent-dark rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Start Learning <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Investor Path */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-card-border shadow-sm"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-primary mb-2">
                  Investor&apos;s Path
                </h3>
                <p className="text-muted text-xs sm:text-sm mb-4">
                  Master investing and wealth building strategies.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    SIP vs Lumpsum
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Asset Allocation
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Retirement Planning
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Tax Optimization
                  </li>
                </ul>
                <button 
                  onClick={() => setFilter("investing")}
                  className="w-full py-2.5 sm:py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Start Learning <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* MFD Path */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-card-border shadow-sm sm:col-span-2 lg:col-span-1"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-accent-dark" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-primary mb-2">
                  MFD Professional Path
                </h3>
                <p className="text-muted text-xs sm:text-sm mb-4">
                  Build a successful career as a Mutual Fund Distributor.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-dark flex-shrink-0" />
                    How to Become MFD
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-dark flex-shrink-0" />
                    Client Relationship
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-dark flex-shrink-0" />
                    Business Planning
                  </li>
                  <li className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-dark flex-shrink-0" />
                    Growth Strategies
                  </li>
                </ul>
                <button 
                  onClick={() => setFilter("mfd")}
                  className="w-full py-2.5 sm:py-3 bg-accent/10 hover:bg-accent/20 text-accent-dark rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Start Learning <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16">
          <div className="container-custom px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary via-primary-light to-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-accent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white mb-3 sm:mb-4">
                  Want Personalized Guidance?
                </h3>
                <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base">
                  Book a free consultation with our experts and get personalized 
                  advice on your financial journey.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Link href="/book-review">
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent hover:bg-accent-light text-primary rounded-full text-sm sm:text-base font-semibold transition-colors shadow-lg w-full sm:w-auto justify-center"
                    >
                      Book Free Consultation
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.span>
                  </Link>
                  <Link href="/updates">
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm sm:text-base font-semibold transition-colors border border-white/30 w-full sm:w-auto justify-center"
                    >
                      View Updates
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

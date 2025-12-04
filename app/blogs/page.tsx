"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  ChevronRight,
  Search,
  Bookmark,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import {
  blogPosts,
  categories,
  getFeaturedBlogs,
  getTrendingBlogs,
  formatDate,
  getTimeAgo,
  type BlogCategory,
} from "@/data/blogs";
import StockTicker from "@/components/StockTicker";

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPosts = getFeaturedBlogs();
  const trendingPosts = getTrendingBlogs();
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const heroPost = featuredPosts[0];
  const secondaryFeatured = featuredPosts.slice(1, 3);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Stock Ticker */}
      <StockTicker />

      {/* Premium Header */}
      <header className="bg-[#0A0A0A] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          {/* Top bar */}
          <div className="border-b border-white/10 px-4 py-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Main nav */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Systematic Investments"
                  width={160}
                  height={50}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                <div className="hidden sm:block border-l border-white/20 pl-3">
                  <span className="text-sm font-semibold tracking-wider text-amber-400">INSIGHTS</span>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-amber-400/50 transition-colors placeholder-gray-500"
                  />
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Category tabs */}
          <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 min-w-max">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-amber-400 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All
              </button>
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as BlogCategory)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    selectedCategory === key
                      ? 'bg-amber-400 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section - Featured Articles */}
        {selectedCategory === 'all' && !searchQuery && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Featured */}
              {heroPost && (
                <Link href={`/blogs/${heroPost.slug}`} className="lg:col-span-2 group">
                  <motion.article
                    whileHover={{ y: -4 }}
                    className="relative h-[500px] rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={heroPost.image}
                      alt={heroPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span 
                          className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded"
                          style={{ backgroundColor: categories[heroPost.category].color }}
                        >
                          {categories[heroPost.category].name}
                        </span>
                        {heroPost.trending && (
                          <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </span>
                        )}
                      </div>
                      
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-amber-400 transition-colors">
                        {heroPost.title}
                      </h1>
                      
                      <p className="text-gray-300 text-lg mb-4 line-clamp-2">
                        {heroPost.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{heroPost.author.name}</span>
                        <span>•</span>
                        <span>{getTimeAgo(heroPost.publishedAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {heroPost.readTime} min read
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              )}

              {/* Secondary Featured */}
              <div className="flex flex-col gap-6">
                {secondaryFeatured.map((post) => (
                  <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex-1">
                    <motion.article
                      whileHover={{ y: -4 }}
                      className="relative h-full min-h-[235px] rounded-2xl overflow-hidden"
                    >
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span 
                          className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded mb-3"
                          style={{ backgroundColor: categories[post.category].color }}
                        >
                          {categories[post.category].name}
                        </span>
                        
                        <h2 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-amber-400 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{getTimeAgo(post.publishedAt)}</span>
                          <span>•</span>
                          <span>{post.readTime} min</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Trending Strip */}
        {selectedCategory === 'all' && !searchQuery && trendingPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded">
                <TrendingUp className="w-4 h-4" />
                TRENDING NOW
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {trendingPosts.slice(0, 3).map((post, index) => (
                <Link key={post.id} href={`/blogs/${post.slug}`} className="group">
                  <article className="flex gap-4">
                    <span className="text-5xl font-black text-gray-200 group-hover:text-amber-400 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span 
                        className="inline-block text-[10px] font-bold uppercase tracking-wider mb-2"
                        style={{ color: categories[post.category].color }}
                      >
                        {categories[post.category].name}
                      </span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">{getTimeAgo(post.publishedAt)}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Articles Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'Latest Articles' : categories[selectedCategory].name}
            </h2>
            <span className="text-sm text-gray-500">{filteredPosts.length} articles</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/blogs/${post.slug}`} className="group">
                    <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span 
                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white"
                            style={{ backgroundColor: categories[post.category].color }}
                          >
                            {categories[post.category].name}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                              {post.author.avatar && (
                                <Image
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">{post.author.name}</p>
                              <p className="text-xs text-gray-500">{getTimeAgo(post.publishedAt)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {post.readTime} min
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Newsletter CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-[#0A0A0A] rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl" />
            
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-3 py-1 bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded mb-4">
                Newsletter
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Ahead of the Markets
              </h3>
              <p className="text-gray-400 mb-6">
                Get exclusive MFD insights, market analysis, and regulatory updates delivered to your inbox every morning.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Subscribe
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                Join 5,000+ MFDs who trust our insights. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Systematic Investments"
                width={140}
                height={45}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <span className="text-amber-400 text-sm font-semibold">INSIGHTS</span>
            </div>
            
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Systematic Investments. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/tools" className="text-sm text-gray-400 hover:text-white transition-colors">
                Tools
              </Link>
              <Link href="/book-review" className="text-sm text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


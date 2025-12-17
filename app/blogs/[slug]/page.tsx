"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Bookmark, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Copy, 
  Check,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getBlogBySlug,
  getRelatedBlogs,
  categories,
  formatDate,
  getTimeAgo,
  blogPosts,
  type BlogPost,
} from "@/data/blogs";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const foundPost = getBlogBySlug(slug);
    if (foundPost) {
      setPost(foundPost);
      setRelatedPosts(getRelatedBlogs(slug, 3));
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / winHeight) * 100;
      setScrollProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (!post) return;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h1>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/blogs" className="text-amber-600 hover:text-amber-700 font-medium">
            ← Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  const category = categories[post.category];

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <motion.div
          className="h-full bg-amber-400"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="bg-[#0A0A0A] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Systematic Investments"
                width={140}
                height={45}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <span className="hidden sm:inline text-amber-400 text-sm font-semibold">INSIGHTS</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <Link
                href="/blogs"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Articles</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 pb-16 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                  <Link href="/blogs" className="hover:text-white transition-colors">
                    Insights
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span style={{ color: category.color }}>{category.name}</span>
                </div>

                {/* Category & Trending Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span 
                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </span>
                  {post.trending && (
                    <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                      {post.author.avatar && (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{post.author.name}</p>
                      <p className="text-xs text-gray-400">{post.author.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime} min read
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3"
              >
                {/* Excerpt/Lead */}
                <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-amber-400 pl-6">
                  {post.excerpt}
                </p>

                {/* Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-amber-400 prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-table:text-sm prose-th:bg-gray-100 prose-th:py-3 prose-th:px-4 prose-td:py-3 prose-td:px-4 prose-td:border-b prose-td:border-gray-100 prose-ul:list-disc prose-li:text-gray-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                </div>

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Tags:</span>
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                  <p className="text-sm font-medium text-gray-900 mb-4">Share this article</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#0d65d9] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              </motion.article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24">
                  {/* Author Card */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Written by</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        {post.author.avatar && (
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{post.author.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-[#0A0A0A] rounded-2xl p-6 text-white">
                    <p className="text-sm font-medium text-amber-400 mb-2">Need Expert Advice?</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Get personalized financial guidance from our experts.
                    </p>
                    <Link
                      href="/book-review"
                      className="block w-full py-3 bg-amber-400 hover:bg-amber-500 text-black text-sm font-semibold text-center rounded-lg transition-colors"
                    >
                      Book Free Consultation
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blogs/${relatedPost.slug}`} className="group">
                    <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span 
                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white"
                            style={{ backgroundColor: categories[relatedPost.category].color }}
                          >
                            {categories[relatedPost.category].name}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-500">{getTimeAgo(relatedPost.publishedAt)}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Never Miss an Update
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for the latest MFD news, market insights, and regulatory updates.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#0A0A0A] hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white py-12">
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
          </div>
        </div>
      </footer>
    </div>
  );
}






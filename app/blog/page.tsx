"use client";

import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight, Star } from "lucide-react";
import { getAllPosts, getFeaturedPosts } from "@/lib/blog-posts";

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const regularPosts = allPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050307]">
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tight mb-4">
            GitCheck Blog
          </h1>
          <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto">
            Insights on developer analytics, GitHub best practices, and data-driven career growth
          </p>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-purple-500" />
              <h2 className="text-2xl font-bold text-black dark:text-white">Featured Articles</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-500/20 dark:border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/40 dark:hover:border-purple-500/50 transition-all duration-300 h-full"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-xs text-black/40 dark:text-white/40">•</span>
                      <span className="text-xs text-black/60 dark:text-white/60">{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-black/60 dark:text-white/60 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-black/40 dark:text-white/40">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-purple-500 dark:text-purple-400 group-hover:gap-2 transition-all">
                        Read more
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Latest Articles</h2>
          <div className="grid gap-6">
            {regularPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <motion.article
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 hover:border-black/20 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="text-xs text-black/40 dark:text-white/40">•</span>
                        <span className="text-xs text-black/60 dark:text-white/60">{post.readTime}</span>
                      </div>

                      <h3 className="text-lg font-bold text-black dark:text-white mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-sm text-black/60 dark:text-white/60 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-black/40 dark:text-white/40">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold text-purple-500 dark:text-purple-400 group-hover:gap-2 transition-all">
                      Read more
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="pt-16 md:pt-24 border-t border-black/[0.06] dark:border-white/[0.06] mt-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs text-black/40 dark:text-white/40">
              {[
                { label: "Documentation", href: "/docs" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Refund Policy", href: "/refund" },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="hover:text-black/70 dark:hover:text-white/70 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="text-xs text-black/40 dark:text-white/40 font-mono">
              © 2025 • Built for{" "}
              <a
                href="https://goktug.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
              >
                developer
              </a>
              {" "}by developers
            </div>
          </motion.div>
        </footer>
      </main>
    </div>
  );
}

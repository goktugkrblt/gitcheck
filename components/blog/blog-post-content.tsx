"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from "lucide-react";
import { BlogPost } from "@/lib/blog-posts";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Article Header */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-500 dark:text-purple-400 uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20">
            <Tag className="w-3 h-3" />
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-black/60 dark:text-white/60 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {post.date}
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </div>
          <span>•</span>
          <span>{post.author}</span>
        </div>

        {/* Excerpt */}
        <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed border-l-4 border-purple-500 pl-4 py-2">
          {post.excerpt}
        </p>

        {/* Share Button */}
        <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share Article
          </button>
        </div>
      </motion.article>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 pt-8 border-t border-black/10 dark:border-white/10"
      >
        <h3 className="text-sm font-semibold text-black/60 dark:text-white/60 uppercase tracking-wider mb-4">
          Related Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {post.keywords.map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 text-xs font-medium text-black/70 dark:text-white/70 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full"
            >
              {keyword}
            </span>
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
  );
}

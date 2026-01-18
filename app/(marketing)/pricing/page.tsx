"use client";

import { Navbar } from "@/components/navbar";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050307] transition-colors duration-300">
      {/* Fixed Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #919191 1px, transparent 1px),
              linear-gradient(to bottom, #919191 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,transparent_0%,rgba(255,255,255,0.6)_100%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,transparent_0%,#050307_100%)]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs text-black/60 dark:text-white/60 font-mono tracking-wider mb-6">
            <Sparkles className="h-3 w-3" />
            SIMPLE PRICING
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight mb-4">
            Pay only for what you need
          </h1>
          <p className="text-base text-black/60 dark:text-white/60 max-w-2xl mx-auto">
            Get started with a free analysis, then unlock deeper insights with PRO analyses.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative group"
          >
            <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-6 h-full transition-all duration-300 hover:border-black/20 dark:hover:border-white/20">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  Free Analysis
                </h3>
                <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                  Try GitCheck with your first analysis
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-black dark:text-white">
                    $0
                  </span>
                  <span className="text-black/40 dark:text-white/40 text-sm">
                    / analysis
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  "Basic developer score (0-100)",
                  "Global ranking",
                  "Public profile analytics",
                  "Language breakdown",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-black/60 dark:text-white/60 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-black/70 dark:text-white/70">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-black/10 dark:border-white/10">
                <p className="text-xs text-black/50 dark:text-white/50">
                  Perfect for trying out GitCheck
                </p>
              </div>
            </div>
          </motion.div>

          {/* PRO Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-purple-500 text-white rounded-full">
                RECOMMENDED
              </span>
            </div>

            <div className="relative bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-2 border-purple-500/50 rounded-2xl p-6 h-full transition-all duration-300 shadow-2xl shadow-purple-500/10">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  PRO Analysis
                </h3>
                <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                  Deep insights and advanced metrics
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-black dark:text-white">
                    $4
                  </span>
                  <span className="text-black/40 dark:text-white/40 text-sm">
                    first analysis
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-black dark:text-white">
                    $2
                  </span>
                  <span className="text-black/40 dark:text-white/40 text-sm">
                    subsequent analyses
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  "Everything in Free",
                  "Advanced statistical analysis",
                  "Percentile-based ranking",
                  "Detailed impact metrics",
                  "Code quality assessment",
                  "Consistency scoring",
                  "Collaboration insights",
                  "Career narrative generation",
                  "Professional metrics",
                  "Repository deep-dive",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-black/70 dark:text-white/70">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-black/20 dark:border-white/20">
                <p className="text-xs text-black/50 dark:text-white/50">
                  Pay per analysis • No subscription required
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-8">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Enter username",
                desc: "Type any GitHub username",
              },
              {
                step: "2",
                title: "Choose analysis",
                desc: "Free or PRO level insights",
              },
              {
                step: "3",
                title: "Get results",
                desc: "View your comprehensive report",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-xl p-5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-black/60 dark:text-white/60">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Do I need an account?",
                a: "No. GitCheck is a public analytics service - simply enter any GitHub username to analyze. No registration or authentication required.",
              },
              {
                q: "What's the difference between Free and PRO?",
                a: "Free analysis provides basic scoring and metrics. PRO includes advanced statistical analysis, percentile rankings, detailed breakdowns, and AI-generated career insights.",
              },
              {
                q: "How does payment work?",
                a: "Your first PRO analysis costs $4, and subsequent PRO analyses are $2 each. No subscriptions - pay only when you need a PRO analysis.",
              },
              {
                q: "Is my GitHub data secure?",
                a: "Yes. We only access publicly visible GitHub data. No authentication required, no access to private repositories.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-xl p-5 hover:border-black/20 dark:hover:border-white/20 transition-colors duration-300"
              >
                <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

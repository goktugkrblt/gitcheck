"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight, Sparkles, Code2, Activity, Layers, Shield, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const [profileCount, setProfileCount] = useState(6);

  useEffect(() => {
    fetch('/api/profile-count')
      .then(res => res.json())
      .then(data => setProfileCount(data.count))
      .catch(() => setProfileCount(6));
  }, []);

  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">      
      {/* Fixed Grid Background */}
<div className="fixed inset-0 pointer-events-none z-0">
  <div 
    className="absolute inset-0 opacity-[0.004]"
    style={{
      backgroundImage: `radial-gradient(circle, #919191 1px, transparent 1px)`,
      backgroundSize: '250px 250px',
    }}
  />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,transparent_0%,#1f1f1f_100%)]" />
</div>

{/* Animated Lines - LESS & SLOWER */}
<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
  {Array.from({ length: 8 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-px opacity-20"
      style={{
        left: `${(i * 25)}%`,
        height: "100%",
        background: "linear-gradient(to bottom, transparent, #919191 50%, transparent)"
      }}
      animate={{
        y: ["-100%", "100%"]
      }}
      transition={{
        duration: 6 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 6,
        ease: "linear"
      }}
    />
  ))}
</div>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 pt-12 z-10">
        <div className="max-w-5xl mx-auto w-full py-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center space-y-12"
          >
            {/* Logo at top */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <Link href="/">
                <motion.div 
                  className="flex items-center gap-3 cursor-pointer group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >              
                  <svg fill="#ededed" width={50} height={50} className="gitcheck-logo" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 245 245"><path d="M185.8,232.75c9.45-10.21,14.43-20.71,10.61-35.01-3.06-11.43-16.92-24.07-17.7-32.75-.63-6.99,4.82-11.41,11.39-10.36,3.39.54,7.83,6.36,10.94,1.42,2.68-4.25-2.55-8.92-6.08-10.4-13.81-5.82-28.46,6.66-25.94,21.63,1.6,9.54,10.16,16.72,14.56,24.99,3.82,7.17,7.21,17.59.1,23.85l-.74-.57c-3.08-19.66-14.33-38.23-26.34-53.5-1.01-1.28-7.78-8.71-7.78-9.33,0-.46.35-.74.67-.99,1.18-.91,4.66-2.18,6.32-3.16,5.5-3.27,9.63-7.39,13.21-12.74,14.05,2.14,27.19-7.72,29.33-22.13,2.18-14.68-6.37-25.09-20.84-24.72-.71.02-1.89.65-2.27.03-4.48-29.93-33.71-44.47-61.11-38.79-17.89,3.71-32.53,17.11-37.76,35.12-1.66.48-3.3.38-5.04.82-5.22,1.33-9.45,6.28-10.86,11.48-2.74,10.11,1.79,21.25,11.35,25.29-.48,13.41,9.63,23,20.87,27.66.05.29.11.67-.03.91-.31.54-9.44,5.46-10.74,6.1-2.12,1.05-7.03,3.62-9.15,2.96-4.11-1.28-13.8-13.56-14.39-17.86-.35-2.55.49-5.15.62-7.63.17-3.33.54-12.69-4.38-12.16-2.65.28-2.93,3.72-3.57,5.68-.09.29-.12.93-.64.66-.43-.22-3.1-4.45-3.89-5.33-9.26-10.38-17.82-.52-16.66,10.78.72,6.98,6.47,13.72,12.06,17.24.79.5,2.74,1.1,3.15,1.51.69.68,3.03,6.49,3.82,7.97,3.61,6.79,10.03,15.86,17.07,19.08,5.63,2.58,11.55.6,17.02-1.51,1.22-.47,6.1-3.05,6.71-3.11.42-.04.49.17.75.45-6.25,17.06-10.31,35.22-8.09,53.58l2.76,14.82c-.36.56-.55.08-.96-.01-8.95-2.11-21.45-9.12-29.2-14.29C-4.7,190.53-17.92,106.22,25.83,48.42c49.53-65.43,145.86-64.24,194.47,1.67,42.04,57.01,29.09,139.38-28.69,179.14-.63.43-5.56,3.75-5.81,3.52Z"/></svg>               
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#2a2a2a] bg-[#252525] backdrop-blur-sm group cursor-pointer"
              whileHover={{ scale: 1.03, borderColor: "#333" }}
            >
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="h-4 w-4 text-[#666]" />
              </motion.div>
              <span className="text-[13px] sm:text-sm text-[#919191] font-mono tracking-wider">
                  NEXT-GEN DEVELOPER ANALYTICS
                </span>
            </motion.div>

            <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
  <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-[#e0e0e0] leading-none tracking-tighter">
     GITHUB
    <br />
    <span className="inline-flex items-center gap-4">     
      <motion.span className="inline-block relative" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
        {"CHECKED".split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              duration: 0.6,
              delay: 0.5 + (i * 0.08),
              repeat: Infinity,
              repeatDelay: 5
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </span>
  </h1>
</motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-[#919191] max-w-3xl mx-auto font-light tracking-wide"
              >
                Transform your code contributions into<br className="hidden md:inline lg:hidden" /> quantifiable career metrics.<br className="hidden md:inline lg:hidden" /> Powered by advanced algorithms.<br className="hidden md:inline lg:hidden" /> Built for developers.
              </motion.p>             
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-8"
            >
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <motion.div className="relative inline-block group" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="relative bg-[#e0e0e0] text-[#1f1f1f] hover:bg-[#d0d0d0] px-12 py-8 text-lg font-bold rounded-xl tracking-wide transition-colors duration-300">
                      <Target style={{ width: '18px', height: '18px' }} />
                      VIEW MY ANALYSIS
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ArrowRight style={{ width: '16px', height: '16px' }} />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <Link href="/login">
                  <motion.div className="relative inline-block group" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg"
                      disabled={isLoading}
                      className="relative bg-[#e0e0e0] text-[#1f1f1f] hover:bg-[#d0d0d0] px-12 py-8 text-lg font-bold rounded-xl tracking-wide transition-colors duration-300 disabled:opacity-50"
                    >
                      <Github style={{ width: '18px', height: '18px' }} />
                      {isLoading ? "LOADING..." : "SIGN IN WITH GITHUB"}
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ArrowRight style={{ width: '16px', height: '16px' }} />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-center justify-center gap-12 text-sm font-mono text-[#666]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#919191] rounded-full animate-pulse" />
                <span>{profileCount} SCANS</span>
              </div>              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#919191] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span>REAL-TIME</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16 px-4 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#252525] text-xs text-[#666] font-mono tracking-widest mb-8">
              CORE FEATURES
            </div>
            <h2 className="text-4xl mb-8 md:text-7xl lg:text-6xl font-black text-[#e0e0e0] leading-none tracking-tighter">
              Precision Metrics
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: "CODE ANALYSIS", description: "Deep algorithmic assessment of repository quality, structure, and impact", number: "01" },
              { icon: Activity, title: "LIVE TRACKING", description: "Real-time performance metrics updated with every commit you make", number: "02" },
              { icon: Layers, title: "SKILL MAPPING", description: "Comprehensive breakdown of your technical stack and expertise areas", number: "03" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: i * 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5 }}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-[#252525] border border-[#2a2a2a] rounded-2xl p-10 hover:border-[#333] transition-all duration-500 h-full overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-6xl font-black text-[#919191] mb-6 group-hover:text-[#fff] transition-colors duration-300">
                      {feature.number}
                    </div>

                    <motion.div className="w-14 h-14 rounded-xl bg-[#2a2a2a] flex items-center justify-center mb-8 group-hover:bg-[#303030] transition-colors duration-300">
                      <feature.icon className="h-7 w-7 text-[#919191] group-hover:text-[#b0b0b0] transition-colors duration-300" />
                    </motion.div>

                    <h3 className="text-2xl font-black text-[#e0e0e0] mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[#919191] leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#919191] to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRO Features Section */}
<section className="relative py-16 px-4 z-10">
  <div className="max-w-5xl mx-auto">
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-100px" }} 
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <div className="inline-block px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#252525] text-xs text-[#666] font-mono tracking-widest mb-8">
        PREMIUM ANALYTICS
      </div>
      <h2 className="text-4xl mb-8 md:text-7xl lg:text-6xl font-black text-[#e0e0e0] leading-none tracking-tighter">
        Unlock<br className="md:hidden lg:hidden" /> Deep Insights
      </h2>
      <p className="text-[#919191] text-lg max-w-2xl mx-auto">
        Advanced analysis with<br className="md:hidden lg:hidden" /> lifetime access for <span className="text-[#e0e0e0] font-bold">$4.99</span>
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {[
        { 
          icon: Code2, 
          title: "README Quality Analysis", 
          description: "Comprehensive documentation scoring based on structure, completeness, and professional presentation",
          weight: "20%",
          number: "01"
        },
        { 
          icon: Shield, 
          title: "Repository Health", 
          description: "Maintenance frequency, issue response times, security checks, and community engagement metrics",
          weight: "25%",
          number: "02"
        },
        { 
          icon: Activity, 
          title: "Developer Patterns", 
          description: "Commit patterns by hour, productivity peaks, collaboration style, and consistency analysis",
          weight: "30%",
          number: "03"
        },
        { 
          icon: Target, 
          title: "Career Insights", 
          description: "Experience level indicators, specialization scoring, and professional growth trajectory",
          weight: "25%",
          number: "04"
        },
      ].map((feature, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            delay: i * 0.15,
            duration: 0.6,
          }}
          whileHover={{ y: -5 }}
          className="group"
        >
          <div className="relative bg-[#252525] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#333] transition-all duration-500 h-full">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="text-5xl font-black text-[#919191] mb-4 group-hover:text-[#fff] transition-colors duration-300">
                  {feature.number}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] flex items-center justify-center group-hover:bg-[#303030] transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-[#919191] group-hover:text-[#b0b0b0] transition-colors duration-300" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-[#e0e0e0]">
                    {feature.title}
                  </h3>
                  <span className="text-xs font-mono text-[#666] bg-[#2a2a2a] px-2 py-1 rounded">
                    {feature.weight}
                  </span>
                </div>
                <p className="text-[#919191] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* PRO CTA */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="bg-[#252525] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#333] transition-all duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-2xl font-black text-[#e0e0e0] mb-2">
              Get Lifetime PRO Access
            </h3>
            <p className="text-[#919191]">
              One-time payment • No subscription<br className="inline md:hidden lg:hidden" /> • Instant unlock
            </p>
          </div>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-[#e0e0e0] text-[#1f1f1f] hover:bg-[#d0d0d0] font-bold px-8 py-6 text-base rounded-xl transition-colors duration-300"
                >
                  <Target className="w-5 h-5 mr-2" />
                  View Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          ) : (
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  disabled={isLoading}
                  className="bg-[#e0e0e0] text-[#1f1f1f] hover:bg-[#d0d0d0] font-bold px-8 py-6 text-base rounded-xl transition-colors duration-300 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isLoading ? "Loading..." : "Upgrade for $4.99"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  </div>
</section>

      {/* FAQ Section */}
<section className="relative py-16 px-4 z-10">
  <div className="max-w-5xl mx-auto">
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-100px" }} 
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <div className="inline-block px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#252525] text-xs text-[#666] font-mono tracking-widest mb-8">
        QUESTIONS
      </div>
      <h2 className="text-4xl md:text-6xl font-black text-[#e0e0e0] leading-none tracking-tighter">
        Frequently Asked
      </h2>
    </motion.div>

    <div className="space-y-4">
      {[
        {
          q: "Is my GitHub data secure?",
          a: "Yes. We only access public repository data via GitHub OAuth. We never request write permissions or access to private repos. All data is transmitted over encrypted connections."
        },
        {
          q: "What's included in the PRO plan?",
          a: "PRO includes 4 advanced analytics modules: README Quality Analysis (20%), Repository Health (25%), Developer Patterns (30%), and Career Insights (25%). You get a comprehensive developer score with detailed breakdowns."
        },
        {
          q: "Is this a subscription or one-time payment?",
          a: "It's a one-time payment of $4.99 for lifetime access. No recurring charges, no hidden fees. Pay once, keep PRO features forever."
        },
        {
          q: "Can I cancel my PRO access?",
          a: "Since it's a one-time purchase with lifetime access, there's no subscription to cancel. You own PRO features permanently after purchase."
        },
        {
          q: "How is my developer score calculated?",
          a: "Your score is calculated from 4 weighted components: README Quality (20%), Repository Health (25%), Developer Patterns (30%), and Career Insights (25%). Each analyzes different aspects of your GitHub presence."
        },
        {
          q: "Do I need to reconnect my GitHub account regularly?",
          a: "No. Once you sign in with GitHub OAuth, you stay authenticated. You can revoke access anytime from your GitHub Settings if needed."
        },
        {
          q: "What programming languages are supported?",
          a: "GitCheck analyzes all programming languages that GitHub recognizes. We track language usage, detect your primary tech stack, and show language evolution over time."
        },
        {
          q: "How often is my data updated?",
          a: "FREE users can re-analyze anytime. PRO analysis results are cached for 1 hour for performance, then auto-refresh. You can manually refresh anytime via the dashboard."
        }
      ].map((faq, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <details className="group bg-[#252525] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#333] transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer p-6 flex items-center justify-between list-none">
              <h3 className="text-lg font-bold text-[#e0e0e0] pr-4">
                {faq.q}
              </h3>
              <motion.div
                className="flex-shrink-0 w-6 h-6 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#919191] font-bold group-open:rotate-45 transition-all duration-500"
                whileHover={{ scale: 1.1 }}
              >
                +
              </motion.div>
            </summary>
            <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-[#919191] leading-relaxed opacity-0 group-open:opacity-100 transition-opacity duration-500 delay-100">
                  {faq.a}
                </div>
              </div>
            </div>
          </details>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
           <div className="relative border border-[#2a2a2a] rounded-3xl p-6 md:p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]">
              <div style={{
                backgroundImage: `linear-gradient(to right, #919191 1px, transparent 1px), linear-gradient(to bottom, #919191 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }} className="absolute inset-0" />
            </div>

            <div className="relative z-10">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="inline-block mb-8">
                <div className="w-16 h-16 rounded-full border border-[#333] flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-[#919191]" />
                </div>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#e0e0e0] mb-6 tracking-tighter leading-tight">
                Supercharge<br className="inline md:inline lg:hidden" /> Your GitHub Presence
              </h2>
              <p className="text-sm md:text-base text-[#919191] mb-4 md:mb-6 max-w-3xl mx-auto font-light leading-relaxed">
                Unlock the full potential of your GitHub profile. Gain instant insights into your contributions, activity patterns, and coding strengths. Track your growth over time, identify your most productive habits, and visualize your technical skills—all in a single, easy-to-understand dashboard.
              </p>
              <p className="text-sm md:text-base text-[#919191] mb-8 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                No setup, no hassle, just actionable analytics designed for developers like you. Make informed decisions, improve your coding efficiency, and showcase your achievements effortlessly.
              </p>
            </div>
          </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#2a2a2a] py-16 px-4 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-[#252525] border border-[#2a2a2a] flex items-center justify-center group-hover:border-[#333] transition-colors">
                  <svg fill="#ededed" width={40} height={40} className="gitcheck-logo" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 245 245"><path d="M185.8,232.75c9.45-10.21,14.43-20.71,10.61-35.01-3.06-11.43-16.92-24.07-17.7-32.75-.63-6.99,4.82-11.41,11.39-10.36,3.39.54,7.83,6.36,10.94,1.42,2.68-4.25-2.55-8.92-6.08-10.4-13.81-5.82-28.46,6.66-25.94,21.63,1.6,9.54,10.16,16.72,14.56,24.99,3.82,7.17,7.21,17.59.1,23.85l-.74-.57c-3.08-19.66-14.33-38.23-26.34-53.5-1.01-1.28-7.78-8.71-7.78-9.33,0-.46.35-.74.67-.99,1.18-.91,4.66-2.18,6.32-3.16,5.5-3.27,9.63-7.39,13.21-12.74,14.05,2.14,27.19-7.72,29.33-22.13,2.18-14.68-6.37-25.09-20.84-24.72-.71.02-1.89.65-2.27.03-4.48-29.93-33.71-44.47-61.11-38.79-17.89,3.71-32.53,17.11-37.76,35.12-1.66.48-3.3.38-5.04.82-5.22,1.33-9.45,6.28-10.86,11.48-2.74,10.11,1.79,21.25,11.35,25.29-.48,13.41,9.63,23,20.87,27.66.05.29.11.67-.03.91-.31.54-9.44,5.46-10.74,6.1-2.12,1.05-7.03,3.62-9.15,2.96-4.11-1.28-13.8-13.56-14.39-17.86-.35-2.55.49-5.15.62-7.63.17-3.33.54-12.69-4.38-12.16-2.65.28-2.93,3.72-3.57,5.68-.09.29-.12.93-.64.66-.43-.22-3.1-4.45-3.89-5.33-9.26-10.38-17.82-.52-16.66,10.78.72,6.98,6.47,13.72,12.06,17.24.79.5,2.74,1.1,3.15,1.51.69.68,3.03,6.49,3.82,7.97,3.61,6.79,10.03,15.86,17.07,19.08,5.63,2.58,11.55.6,17.02-1.51,1.22-.47,6.1-3.05,6.71-3.11.42-.04.49.17.75.45-6.25,17.06-10.31,35.22-8.09,53.58l2.76,14.82c-.36.56-.55.08-.96-.01-8.95-2.11-21.45-9.12-29.2-14.29C-4.7,190.53-17.92,106.22,25.83,48.42c49.53-65.43,145.86-64.24,194.47,1.67,42.04,57.01,29.09,139.38-28.69,179.14-.63.43-5.56,3.75-5.81,3.52Z"/></svg>               
                </div>
              </div>
            </Link>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#666] mt-12 mb-6">
            <Link href="/privacy" className="hover:text-[#919191] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#444]">•</span>
            <Link href="/terms" className="hover:text-[#919191] transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#444]">•</span>
            <Link href="/data-usage" className="hover:text-[#919191] transition-colors">
              Data Usage
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs font-mono text-[#666]">
            © 2025 • BUILT FOR{" "}
            <a 
              href="https://goktug.info" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block group relative"
            >
              <motion.span
                className="text-[#919191] font-bold relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                DEVELOPER
              </motion.span>
              <motion.span
                className="absolute inset-0 bg-[#919191] blur-md opacity-0 group-hover:opacity-20"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
              />
            </a>
            {" "}BY DEVELOPERS
          </div>
        </div>
      </footer>
    </div>
  );
}
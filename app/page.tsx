"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion } from "framer-motion";
import { UsernameInput } from "@/components/username-input";

export default function HomePage() {

  const [profileCount, setProfileCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // ✅ NEW: Leaderboard state
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardCount, setLeaderboardCount] = useState(0);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const prefersReducedMotion = useReducedMotion();

  const headerY = useTransform(smoothProgress, [0, 0.3], !isMobile && !prefersReducedMotion ? [0, -100] : [0, 0]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.2], !isMobile && !prefersReducedMotion ? [1, 0] : [1, 1]);
  const headerScale = useTransform(smoothProgress, [0, 0.2], !isMobile && !prefersReducedMotion ? [1, 0.95] : [1, 1]);

  // Fetch profile count
  useEffect(() => {
    fetch('/api/profile-count')
      .then(res => res.json())
      .then(data => setProfileCount(data.count || 0))
      .catch(() => setProfileCount(0));
  }, []);

  // ✅ NEW: Fetch real leaderboard
  useEffect(() => {
    setLeaderboardLoading(true);
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeaderboard(data.leaderboard);
          setLeaderboardCount(data.count);
        } else {
          setLeaderboard([]);
          setLeaderboardCount(0);
        }
      })
      .catch(err => {
        console.error('Failed to load leaderboard:', err);
        setLeaderboard([]);
        setLeaderboardCount(0);
      })
      .finally(() => {
        setLeaderboardLoading(false);
      });
  }, []);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      
      {/* ✨ ANIMATED BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"
            animate={!isMobile && !prefersReducedMotion ? {
              x: [0, 100, -50, 0],
              y: [0, -50, 100, 0],
              scale: [1, 1.2, 0.8, 1],
            } : {}}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
            animate={!isMobile && !prefersReducedMotion ? {
              x: [0, -100, 50, 0],
              y: [0, 50, -100, 0],
              scale: [1, 0.8, 1.2, 1],
            } : {}}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"
            animate={!isMobile && !prefersReducedMotion ? {
              x: [0, -80, 80, 0],
              y: [0, 80, -80, 0],
              scale: [1, 1.1, 0.9, 1],
            } : {}}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {!isMobile && !prefersReducedMotion && (
          <motion.div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
            }}
          />
        )}

        {mounted && !prefersReducedMotion && [...Array(isMobile ? 5 : 15)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: Math.random() > 0.5 ? '50%' : '8px',
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {mounted && !isMobile && !prefersReducedMotion && (
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <radialGradient id="particle-gradient">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[...Array(30)].map((_, i) => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              return (
                <motion.g key={`particle-${i}`}>
                  <motion.circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="2"
                    fill="url(#particle-gradient)"
                    animate={{
                      cx: [`${x}%`, `${(x + 10) % 100}%`, `${x}%`],
                      cy: [`${y}%`, `${(y + 10) % 100}%`, `${y}%`],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: Math.random() * 10 + 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.g>
              );
            })}
          </svg>
        )}

        {mounted && !isMobile && !prefersReducedMotion && [...Array(6)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              width: '100%',
              top: `${(i + 1) * 15}%`,
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
          />
        ))}

        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }} />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        
        {!isMobile && (
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>

      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        
      {/* HEADER SECTION */}
<div className="max-w-5xl mx-auto px-4 md:px-12 py-6 md:py-12">
  
  {/* ✅ TOP BAR: Logo (centered on mobile, left on desktop) */}
  <div className="flex items-center justify-center md:justify-start mb-12 md:mb-20">
    {/* Logo */}
    <motion.div
      initial={{ opacity: 0, scale: isMobile ? 1 : 0.5, rotate: isMobile ? 0 : -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: isMobile ? 0 : 1, type: "spring" }}
    >
      <Link href="/" className="inline-flex items-center gap-2 group">
        <motion.div
          whileHover={!isMobile ? {
            rotate: [0, -10, 10, -10, 10, 0],
            scale: 1.3,
            y: [0, -5, 0, -3, 0]
          } : {}}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <svg fill="#ffffff" width={40} height={40} xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 245 245">
            <motion.path
              d="M185.8,232.75c9.45-10.21,14.43-20.71,10.61-35.01-3.06-11.43-16.92-24.07-17.7-32.75-.63-6.99,4.82-11.41,11.39-10.36,3.39.54,7.83,6.36,10.94,1.42,2.68-4.25-2.55-8.92-6.08-10.4-13.81-5.82-28.46,6.66-25.94,21.63,1.6,9.54,10.16,16.72,14.56,24.99,3.82,7.17,7.21,17.59.1,23.85l-.74-.57c-3.08-19.66-14.33-38.23-26.34-53.5-1.01-1.28-7.78-8.71-7.78-9.33,0-.46.35-.74.67-.99,1.18-.91,4.66-2.18,6.32-3.16,5.5-3.27,9.63-7.39,13.21-12.74,14.05,2.14,27.19-7.72,29.33-22.13,2.18-14.68-6.37-25.09-20.84-24.72-.71.02-1.89.65-2.27.03-4.48-29.93-33.71-44.47-61.11-38.79-17.89,3.71-32.53,17.11-37.76,35.12-1.66.48-3.30.38-5.04.82-5.22,1.33-9.45,6.28-10.86,11.48-2.74,10.11,1.79,21.25,11.35,25.29-.48,13.41,9.63,23,20.87,27.66.05.29.11.67-.03.91-.31.54-9.44,5.46-10.74,6.1-2.12,1.05-7.03,3.62-9.15,2.96-4.11-1.28-13.8-13.56-14.39-17.86-.35-2.55.49-5.15.62-7.63.17-3.33.54-12.69-4.38-12.16-2.65.28-2.93,3.72-3.57,5.68-.09.29-.12.93-.64.66-.43-.22-3.10-4.45-3.89-5.33-9.26-10.38-17.82-.52-16.66,10.78.72,6.98,6.47,13.72,12.06,17.24.79.5,2.74,1.1,3.15,1.51.69.68,3.03,6.49,3.82,7.97,3.61,6.79,10.03,15.86,17.07,19.08,5.63,2.58,11.55.6,17.02-1.51,1.22-.47,6.10-3.05,6.71-3.11.42-.04.49.17.75.45-6.25,17.06-10.31,35.22-8.09,53.58l2.76,14.82c-.36.56-.55.08-.96-.01-8.95-2.11-21.45-9.12-29.2-14.29C-4.7,190.53-17.92,106.22,25.83,48.42c49.53-65.43,145.86-64.24,194.47,1.67,42.04,57.01,29.09,139.38-28.69,179.14-.63.43-5.56,3.75-5.81,3.52Z"
              initial={{ pathLength: isMobile ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: isMobile ? 0 : 2, ease: "easeInOut" }}
            />
          </svg>
          <motion.span
            className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100"
            initial={{ y: 0, opacity: 0 }}
            whileHover={{ y: -10, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
              <path d="M8 15c1.5 1.5 3 2 4 2s2.5-.5 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  </div>

  {/* ✅ CONTENT: Hero + Leaderboard - ortada, üstten hizalı */}
  <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
    
    {/* Hero Content */}
    <motion.div
      className="flex-1 max-w-2xl"
      style={!isMobile && !prefersReducedMotion ? { 
        y: headerY,
        opacity: headerOpacity,
        scale: headerScale
      } : {}}
    >
     {/* Badge */}
<motion.div
  initial={{ opacity: 0, y: isMobile ? 0 : -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: isMobile ? 0 : 0.3, duration: isMobile ? 0 : 0.6 }}
  className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6 md:mb-8 backdrop-blur-sm w-fit"
>
  {/* Animated glow */}
  <motion.div
    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-sm"
    animate={!isMobile ? {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3]
    } : {}}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
  
  {/* Custom SVG Icon */}
  <motion.svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    className="relative"
    animate={!isMobile ? { 
      rotate: [0, 360],
    } : {}}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    {/* Outer ring */}
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="url(#gradient1)"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Inner star/sparkle */}
    <motion.path
      d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
      fill="url(#gradient2)"
      animate={!isMobile ? { 
        scale: [1, 1.2, 1],
        opacity: [0.8, 1, 0.8]
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </motion.svg>
  
  <span className="text-xs text-white/80 font-mono uppercase tracking-widest relative">
    AI-Powered Analytics
  </span>
</motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: isMobile ? 0 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isMobile ? 0 : 0.5, duration: isMobile ? 0 : 0.8 }}
        className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 md:mb-6"
      >
        GitHub
        <br />
        Checked
      </motion.h1>

      {/* Terminal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0 : 0.65 }}
        className="text-sm text-white/40 font-mono mb-4 md:mb-6"
      >
        <span className="text-white/30">$</span> analyze --profile --repos --activity
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: isMobile ? 0 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isMobile ? 0 : 0.7, duration: isMobile ? 0 : 0.8 }}
        className="text-base md:text-lg text-white/60 mb-8 md:mb-10 max-w-xl leading-relaxed"
      >
        Quantifiable metrics from your GitHub activity.
        <br className="hidden lg:block" />
        Advanced analysis for developers who care about data.
      </motion.p>

      {/* CTA - Username Input */}
      <motion.div
        initial={{ opacity: 0, y: isMobile ? 0 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isMobile ? 0 : 0.9, duration: isMobile ? 0 : 0.8 }}
        className="w-full"
      >
        <UsernameInput isMobile={isMobile} />

        {/* Profile Count with Scanning Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isMobile ? 0 : 1.1 }}
          className="flex items-center gap-3 mt-6"
        >
          {/* Scanning Indicator */}
          <motion.div
            className="relative w-2 h-2"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 rounded-full bg-red-500" />
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/50"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>

          {/* Text */}
          <span className="text-sm text-white/40 font-mono">
            {profileCount > 0 ? `${profileCount.toLocaleString()} profiles analyzed` : 'Loading...'}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>

    {/* Leaderboard - Sağ (Desktop) */}
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: isMobile ? 0 : 1.2, duration: isMobile ? 0 : 0.8 }}
      className="hidden lg:block w-[260px] flex-shrink-0"
    >
      <LeaderboardCard 
        profiles={leaderboard}
        count={leaderboardCount}
        loading={leaderboardLoading}
        isMobile={isMobile} 
      />
    </motion.div>
  </div>

  {/* Mobile Leaderboard */}
  <motion.div className="lg:hidden mb-12 mt-8">
    <LeaderboardCard 
      profiles={leaderboard}
      count={leaderboardCount}
      loading={leaderboardLoading}
      isMobile={isMobile} 
    />
  </motion.div>
</div>

        {/* REST OF CONTENT */}
        <main className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* How It Works Section */}
          <ScrollRevealSection isMobile={isMobile}>
            <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-10">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Enter Username",
                  desc: "Simply enter any public GitHub username. No authentication required, no OAuth permissions.",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )
                },
                {
                  step: "02",
                  title: "Statistical Analysis",
                  desc: "Our algorithm analyzes 100+ repositories, commits, PRs, and contribution patterns in 30-45 seconds.",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )
                },
                {
                  step: "03",
                  title: "Get Insights",
                  desc: "Receive a 0-100 developer score, global ranking, and detailed breakdown of your GitHub activity.",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-white/20 transition-all duration-300 group"
                >
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-6xl font-black text-white/5 group-hover:text-white/10 transition-all">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 text-blue-400 group-hover:text-blue-300 transition-colors relative z-10">
                    {item.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 relative z-10">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollRevealSection>

          {/* Key Features Section */}
          <ScrollRevealSection delay={0.2} isMobile={isMobile}>
            <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-10">
              Key Features
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Statistical Scoring",
                  desc: "0-100 percentile-based scores using z-score normalization across 100K+ developer baseline.",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Global Leaderboard",
                  desc: "See your real-time rank among all analyzed developers. Track your position and percentile.",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  color: "from-purple-500 to-pink-500"
                },
                {
                  title: "24-Hour Cache",
                  desc: "Smart caching system prevents API abuse. Cached responses served in ~50ms vs. 30-45s full analysis.",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  color: "from-yellow-500 to-orange-500"
                },
                {
                  title: "Privacy First",
                  desc: "No authentication, no OAuth. Only public GitHub data accessed. Zero tracking cookies or sessions.",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  color: "from-green-500 to-emerald-500"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={!isMobile ? { y: -5 } : {}}
                  className="p-5 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-white/20 transition-all duration-300 group"
                >
                  {/* Icon with gradient */}
                  <div className={`mb-4 w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-0.5 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full rounded-lg bg-black flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </ScrollRevealSection>

          {/* About Section - Updated */}
          <ScrollRevealSection delay={0.3} isMobile={isMobile}>
            <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-8">
              About GitCheck
            </h2>

            <div className="space-y-4 text-sm md:text-base text-white/60 leading-relaxed">
              <p>
                GitCheck is a public GitHub analytics platform that transforms raw GitHub data into meaningful developer insights. Using advanced statistical algorithms and z-score normalization, we calculate a 0-100 developer score based on four weighted components: <strong className="text-white/80">Impact (35%)</strong>, <strong className="text-white/80">Code Quality (30%)</strong>, <strong className="text-white/80">Consistency (20%)</strong>, and <strong className="text-white/80">Collaboration (15%)</strong>.
              </p>
              <p>
                Built with Next.js 16, React 19, TypeScript, and PostgreSQL on Neon, GitCheck processes GitHub GraphQL and REST API data to analyze up to 100 repositories per profile. Our scoring system compares developers against a baseline population of 100,000+ users, ensuring percentile-based scores remain meaningful over time.
              </p>
              <p>
                <strong className="text-white/80">Privacy is paramount.</strong> We require no authentication or OAuth permissions—simply enter any public GitHub username to analyze. All data accessed is already publicly available on GitHub. We implement 24-hour smart caching, IP-based rate limiting (5 req/15min), and honeypot bot protection to ensure fair usage.
              </p>
              <p className="text-white/80 font-medium">
                Whether you're tracking personal growth, evaluating candidates, or benchmarking against peers, GitCheck provides the quantifiable metrics you need.
              </p>
            </div>
          </ScrollRevealSection>

          {/* Comparison Table Section */}
          <ScrollRevealSection delay={0.25} isMobile={isMobile}>
            <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-10">
              Free vs PRO
            </h2>

            {/* Header */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-6 pb-4 border-b border-white/10">
              <div className="text-xs md:text-sm text-white/60 font-mono uppercase tracking-wider">
                Feature
              </div>
              <div className="text-center text-xs md:text-sm text-white/60 font-mono uppercase tracking-wider">
                Free
              </div>
              <div className="text-center text-xs md:text-sm text-white/60 font-mono uppercase tracking-wider">
                PRO
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-3 md:space-y-4">
              {[
                { feature: "Basic Profile Stats", free: true, pro: true },
                { feature: "Repository Analysis", free: true, pro: true },
                { feature: "Contribution Timeline", free: true, pro: true },
                { feature: "Language Breakdown", free: true, pro: true },
                { feature: "README Quality Score", free: false, pro: true },
                { feature: "Repository Health Check", free: false, pro: true },
                { feature: "Developer Patterns", free: false, pro: true },
                { feature: "Career Growth Insights", free: false, pro: true },
                { feature: "AI Recommendations", free: false, pro: true },
                { feature: "Detailed Breakdown", free: false, pro: true },
              ].map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-4 md:gap-6 items-center p-3 md:p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/15 transition-all duration-200"
                >
                  {/* Feature Name */}
                  <div className="text-xs md:text-sm text-white/80">
                    {row.feature}
                  </div>

                  {/* Free Column */}
                  <div className="flex justify-center">
                    {row.free ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="#22c55e"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-white/20 text-sm">—</div>
                    )}
                  </div>

                  {/* PRO Column */}
                  <div className="flex justify-center">
                    {row.pro ? (
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="#a855f7"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-white/20 text-sm">—</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollRevealSection>
          {/* FAQ */}
          <ScrollRevealSection delay={0.3} isMobile={isMobile}>
            <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-10">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                { 
                  q: "Is my GitHub data secure?", 
                  a: "Yes. We only access public repository data via GitHub OAuth. We never request write permissions or access to private repos. All data is transmitted over encrypted connections and we don't store your GitHub credentials." 
                },
                { 
                  q: "What's included in the PRO plan?", 
                  a: "PRO includes 5 advanced analytics modules: README Quality Analysis (20%), Repository Health (25%), Developer Patterns (30%), Career Insights (25%), and AI Career Analysis (bonus). You get comprehensive scoring, detailed breakdowns, and personalized AI-powered career recommendations." 
                },
                { 
                  q: "How does the payment work?", 
                  a: "It's a simple one-time payment of $2.99 to unlock your PRO analysis. No subscriptions, no recurring charges. After payment via Stripe, you'll have instant access to all advanced features and insights for your profile." 
                },
                { 
                  q: "Can I request a refund?", 
                  a: "Yes. If you're not satisfied with your PRO analysis, contact us within 7 days of purchase for a full refund, no questions asked." 
                },
                { 
                  q: "How is my developer score calculated?", 
                  a: "Your score is calculated from 4 weighted components analyzing different aspects of your GitHub presence: README Quality (20%), Repository Health (25%), Developer Patterns (30%), and Career Insights (25%). Each component uses multiple metrics and advanced algorithms." 
                },
                { 
                  q: "Do I need to reconnect my GitHub account regularly?", 
                  a: "No. Once you sign in with GitHub OAuth, you stay authenticated. You can revoke access anytime from your GitHub Settings under Applications if needed." 
                },
                { 
                  q: "What programming languages are supported?", 
                  a: "GitCheck analyzes all programming languages that GitHub recognizes. We track language usage across your repositories, detect your primary tech stack, and show language evolution over time with detailed statistics." 
                },
                { 
                  q: "How often is my data updated?", 
                  a: "FREE users can re-analyze their profile anytime by clicking the analyze button. PRO analysis results are cached for 1 hour for performance, then auto-refresh. You can manually refresh anytime via the dashboard." 
                },
                { 
                  q: "Can I analyze other developers' profiles?", 
                  a: "You can only analyze your own authenticated GitHub profile. This ensures privacy and prevents misuse of the platform." 
                },
                { 
                  q: "What browsers are supported?", 
                  a: "GitCheck works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience." 
                },
                { 
                  q: "Is there an API available?", 
                  a: "Currently, GitCheck is only available through our web interface. We're considering API access for enterprise customers in the future." 
                },
                { 
                  q: "How can I contact support?", 
                  a: "You can reach our support team through the contact form on our website or email us directly. We typically respond within 24 hours on business days." 
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="border-l-2 border-white/10 pl-6"
                >
                  <h3 className="text-sm font-bold text-white/90 mb-2">{faq.q}</h3>
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </ScrollRevealSection>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-20 mb-8 md:mb-12 px-4 md:px-8"
          >
            <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 md:p-8">
              <h3 className="text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Disclaimer
              </h3>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                GitCheck provides automated analysis of publicly available GitHub profiles using our proprietary algorithms.
                This is <strong className="text-white/70">not a professional developer assessment</strong> or evaluation service.
                Our scoring system analyzes visible GitHub activity, repository metrics, and contribution patterns to generate
                insights for educational and informational purposes only. Results should not be used as the sole basis for
                employment decisions or professional evaluations. Actual developer capabilities, experience, and skills may
                vary significantly from automated metrics.
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <footer className="pt-8 md:pt-12 border-t border-white/[0.06] mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs text-white/40">
                {[
                  { label: "Documentation", href: "/docs" },
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="text-xs text-white/40 font-mono">
                © 2025 • Built for{" "}
                <a 
                  href="https://goktug.info" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  developer
                </a>
                {" "}by developers
              </div>
            </motion.div>
          </footer>

        </main>
      </div>
    </div>
  );
}

// ✅ NEW: Leaderboard Card Component with Real Data Support
// ✅ FIXED: Leaderboard Card Component - Hydration Error Fixed
function LeaderboardCard({ 
  profiles, 
  count,
  loading,
  isMobile 
}: { 
  profiles: any[], 
  count: number,
  loading: boolean,
  isMobile: boolean 
}) {
  return (
    <div className="border border-white/[0.08] rounded-xl bg-white/[0.02] p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
        <Trophy className="h-3.5 w-3.5 text-white/60" />
        <h3 className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
          Top Developers
        </h3>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-1.5">
              <div className="w-5 h-5 rounded-full bg-white/5 animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-white/5 animate-pulse" />
              <div className="flex-1 h-3 bg-white/5 rounded animate-pulse" />
              <div className="w-8 h-3 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && count === 0 && (
        <div className="py-8 text-center">
          <div className="flex justify-center mb-3">
            <svg className="w-10 h-10 text-white/20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-xs text-white/60 mb-2 font-medium">No rankings yet</p>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Be the first to analyze
            <br />
            your GitHub profile!
          </p>
        </div>
      )}

      {/* List - Clickable Links */}
      {!loading && count > 0 && (
        <div className="space-y-1.5">
          {profiles.map((profile, i) => (
            <motion.a
              key={profile.username}
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: isMobile ? 0 : 0.2 + (i * 0.05), 
                duration: isMobile ? 0 : 0.3 
              }}
              whileHover={!isMobile ? { 
                x: 2, 
                backgroundColor: "rgba(255,255,255,0.05)" 
              } : {}}
              className="flex items-center gap-2 p-1.5 rounded-lg transition-all duration-200 cursor-pointer group"
            >
              {/* Rank */}
              <div className={`
                w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold flex-shrink-0
                ${profile.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : ''}
                ${profile.rank === 2 ? 'bg-gray-400/20 text-gray-400' : ''}
                ${profile.rank === 3 ? 'bg-orange-600/20 text-orange-600' : ''}
                ${profile.rank > 3 ? 'bg-white/5 text-white/40' : ''}
              `}>
                {profile.rank}
              </div>

              {/* Avatar */}
              <img 
                src={profile.avatar} 
                alt={profile.username}
                className="w-6 h-6 rounded-full border border-white/10 flex-shrink-0"
                loading="lazy"
              />

              {/* Username */}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-white/90 font-medium truncate group-hover:text-white transition-colors">
                  {profile.username}
                </div>
              </div>

              {/* Score - No Star Icon */}
              <div className="flex-shrink-0">
                <span className="text-[10px] font-mono text-white/60 group-hover:text-white/80 transition-colors">
                  {profile.score.toFixed(2)}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* Footer - ✅ FIXED: No conditional rendering inside */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isMobile ? 0 : 0.8 }}
          className="text-[9px] text-white/40 font-mono leading-tight"
        >
          {count > 0 ? (
            <span>
              {count} developer{count > 1 ? 's' : ''} ranked
              <br />
              Updated live
            </span>
          ) : (
            <span>
              Start your journey
              <br />
              Analyze your profile
            </span>
          )}
        </motion.p>
      </div>
    </div>
  );
}

// ScrollRevealSection Component - No animations, just styling
function ScrollRevealSection({ children, delay = 0, isMobile }: { children: React.ReactNode; delay?: number; isMobile: boolean }) {
  return (
    <section className="mb-12 md:mb-20 pt-12 md:pt-20 border-t border-white/[0.06]">
      {children}
    </section>
  );
}
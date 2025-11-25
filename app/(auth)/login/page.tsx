"use client";

import { handleSignIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Github, Code2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden flex items-center justify-center">
      {/* Fixed Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #919191 1px, transparent 1px),
              linear-gradient(to bottom, #919191 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,transparent_0%,#1f1f1f_100%)]" />
      </div>

      {/* Logo - Top Left */}
      <Link href="/">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed top-8 left-8 z-50 flex items-center gap-3 cursor-pointer group"
          whileHover={{ scale: 1.03 }}
        >
          <div className="w-10 h-10 rounded-lg bg-[#252525] border border-[#2a2a2a] flex items-center justify-center group-hover:border-[#333] transition-colors duration-300">
          <svg fill="#ededed" width={40} height={40} className="gitrack-logo" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 245 245"><path d="M185.8,232.75c9.45-10.21,14.43-20.71,10.61-35.01-3.06-11.43-16.92-24.07-17.7-32.75-.63-6.99,4.82-11.41,11.39-10.36,3.39.54,7.83,6.36,10.94,1.42,2.68-4.25-2.55-8.92-6.08-10.4-13.81-5.82-28.46,6.66-25.94,21.63,1.6,9.54,10.16,16.72,14.56,24.99,3.82,7.17,7.21,17.59.1,23.85l-.74-.57c-3.08-19.66-14.33-38.23-26.34-53.5-1.01-1.28-7.78-8.71-7.78-9.33,0-.46.35-.74.67-.99,1.18-.91,4.66-2.18,6.32-3.16,5.5-3.27,9.63-7.39,13.21-12.74,14.05,2.14,27.19-7.72,29.33-22.13,2.18-14.68-6.37-25.09-20.84-24.72-.71.02-1.89.65-2.27.03-4.48-29.93-33.71-44.47-61.11-38.79-17.89,3.71-32.53,17.11-37.76,35.12-1.66.48-3.3.38-5.04.82-5.22,1.33-9.45,6.28-10.86,11.48-2.74,10.11,1.79,21.25,11.35,25.29-.48,13.41,9.63,23,20.87,27.66.05.29.11.67-.03.91-.31.54-9.44,5.46-10.74,6.1-2.12,1.05-7.03,3.62-9.15,2.96-4.11-1.28-13.8-13.56-14.39-17.86-.35-2.55.49-5.15.62-7.63.17-3.33.54-12.69-4.38-12.16-2.65.28-2.93,3.72-3.57,5.68-.09.29-.12.93-.64.66-.43-.22-3.1-4.45-3.89-5.33-9.26-10.38-17.82-.52-16.66,10.78.72,6.98,6.47,13.72,12.06,17.24.79.5,2.74,1.1,3.15,1.51.69.68,3.03,6.49,3.82,7.97,3.61,6.79,10.03,15.86,17.07,19.08,5.63,2.58,11.55.6,17.02-1.51,1.22-.47,6.1-3.05,6.71-3.11.42-.04.49.17.75.45-6.25,17.06-10.31,35.22-8.09,53.58l2.76,14.82c-.36.56-.55.08-.96-.01-8.95-2.11-21.45-9.12-29.2-14.29C-4.7,190.53-17.92,106.22,25.83,48.42c49.53-65.43,145.86-64.24,194.47,1.67,42.04,57.01,29.09,139.38-28.69,179.14-.63.43-5.56,3.75-5.81,3.52Z"/></svg>                          
          </div>
        </motion.div>
      </Link>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Card */}
          <div className="relative bg-[#252525] border border-[#2a2a2a] rounded-3xl p-12 overflow-hidden">
            {/* Inner Grid */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div style={{
                backgroundImage: `linear-gradient(to right, #919191 1px, transparent 1px), linear-gradient(to bottom, #919191 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }} className="absolute inset-0" />
            </div>

            <div className="relative z-10 space-y-8 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#1f1f1f] text-xs text-[#666] font-mono tracking-wider"
              >
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="h-3 w-3" />
                </motion.div>
                SECURE LOGIN
              </motion.div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl font-black text-[#e0e0e0] tracking-tighter">
                  WELCOME BACK
                </h1>
                <p className="text-[#919191] font-light">
                  Sign in to access your GitHub analytics dashboard and track your developer growth.
                </p>
              </div>

              {/* Sign In Button */}
              <form action={handleSignIn} className="space-y-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#e0e0e0] text-[#1f1f1f] hover:bg-[#d0d0d0] py-7 text-base font-bold rounded-2xl transition-colors duration-300"
                  >
                   <Github style={{ width: '18px', height: '18px' }} />
                    SIGN IN WITH GITHUB
                  </Button>
                </motion.div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2a2a2a]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-[#252525] text-[#666] font-mono">
                      SECURE OAUTH 2.0
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                    { label: "FREE FOREVER", icon: "✓" },
                    { label: "NO CREDIT CARD", icon: "✓" },
                    { label: "2MIN SETUP", icon: "✓" },
                    { label: "INSTANT ACCESS", icon: "✓" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-center gap-2 text-xs font-mono text-[#666]"
                    >
                      <span className="text-[#919191]">{item.icon}</span>
                      {item.label}
                    </motion.div>
                  ))}
                </div>
              </form>                           
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
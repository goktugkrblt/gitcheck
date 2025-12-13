"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      {/* Advanced Grid Background - SAME AS HOMEPAGE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Main Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,20,20,0.8),transparent)]" />
        
        {/* Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm cursor-pointer">Back to Home</span>
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm">
            Last updated: December 4, 2025
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="space-y-8 text-white/60 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Introduction</h2>
              <p>
                GitCheck ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our GitHub analytics service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">GitHub OAuth Data</h3>
              <p>When you sign in with GitHub, we collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your GitHub username and profile information</li>
                <li>Public repository data and commit history</li>
                <li>Pull request and issue statistics</li>
                <li>Programming language usage</li>
                <li>Contribution activity and patterns</li>
                <li>Follower and organization information</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Account Information</h3>
              <p>We store:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your email address (from GitHub)</li>
                <li>Profile avatar URL</li>
                <li>Account creation date</li>
                <li>Subscription status (FREE/PRO)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Usage Data</h3>
              <p>We automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Analysis timestamps</li>
                <li>Feature usage statistics</li>
                <li>Session data and login history</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">Provide Analytics:</strong> Calculate developer scores, generate insights, and track metrics</li>
                <li><strong className="text-white/80">Improve Services:</strong> Enhance algorithms and add new features</li>
                <li><strong className="text-white/80">Authentication:</strong> Manage your account and maintain security</li>
                <li><strong className="text-white/80">Communication:</strong> Send service updates and respond to inquiries</li>
                <li><strong className="text-white/80">PRO Features:</strong> Deliver premium analysis for subscribed users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Data Storage and Security</h2>
              
              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Storage</h3>
              <p>
                Your data is stored in secure PostgreSQL databases hosted on Neon (neon.tech) with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted connections (SSL/TLS)</li>
                <li>Regular automated backups</li>
                <li>Geographic redundancy</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Caching</h3>
              <p>
                We implement caching mechanisms to improve performance:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Server-side cache: 1 hour TTL for analysis results</li>
                <li>Client-side session storage: Temporary storage during your session</li>
                <li>Cache is automatically cleared when you log out</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Security Measures</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>NextAuth.js for secure authentication</li>
                <li>GitHub OAuth 2.0 authorization flow</li>
                <li>Environment variable protection for sensitive keys</li>
                <li>No storage of GitHub access tokens (session-based only)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Data Sharing and Third Parties</h2>
              <p>We do not sell your personal data. We may share data with:</p>
              
              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Service Providers</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">Vercel:</strong> Hosting and deployment platform</li>
                <li><strong className="text-white/80">Neon:</strong> Database hosting service</li>
                <li><strong className="text-white/80">GitHub:</strong> OAuth authentication and API access</li>
                <li><strong className="text-white/80">Stripe:</strong> Payment processing for PRO subscriptions (when applicable)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Legal Requirements</h3>
              <p>
                We may disclose your information if required by law, regulation, legal process, or governmental request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">Access:</strong> Request a copy of your stored data</li>
                <li><strong className="text-white/80">Correction:</strong> Update inaccurate information</li>
                <li><strong className="text-white/80">Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong className="text-white/80">Portability:</strong> Export your analytics data</li>
                <li><strong className="text-white/80">Opt-out:</strong> Revoke GitHub OAuth access at any time</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, disconnect your GitHub account in your GitHub Settings → Applications → GitCheck, or contact us directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Profile data: Retained while your account is active</li>
                <li>Analysis results: Cached for up to 1 hour, then regenerated on demand</li>
                <li>Session data: Cleared after 30 days of inactivity</li>
                <li>Deleted accounts: All associated data removed within 30 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">GitHub API Usage</h2>
              <p>
                GitCheck uses the GitHub API to fetch your public repository data. We:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Only access public repositories and profile information</li>
                <li>Do not request write permissions</li>
                <li>Comply with GitHub's API Terms of Service</li>
                <li>Respect GitHub's rate limits and best practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Cookies and Tracking</h2>
              <p>We use essential cookies for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication session management</li>
                <li>Security and fraud prevention</li>
                <li>Performance optimization</li>
              </ul>
              <p className="mt-4">
                We do not use third-party advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Children's Privacy</h2>
              <p>
                GitCheck is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">International Users</h2>
              <p>
                Your data may be transferred to and processed in countries other than your country of residence. By using GitCheck, you consent to the transfer of your information to our servers and service providers located globally.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last updated" date. Significant changes will be communicated via email or prominent notice on our website.
              </p>
            </section>
           
          </div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap gap-4 justify-center text-sm text-white/40"
        >
          <Link href="/terms" className="hover:text-white/70 transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/data-usage" className="hover:text-white/70 transition-colors">
            Data Usage
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-white/70 transition-colors">
            Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
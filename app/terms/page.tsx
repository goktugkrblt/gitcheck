"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
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
            <span className="text-sm  cursor-pointer">Back to Home</span>
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
            Terms of Service
          </h1>
          <p className="text-white/40  text-sm">
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
              <h2 className="text-2xl font-bold text-white/90 mb-4">Agreement to Terms</h2>
              <p>
                By accessing or using GitCheck ("Service," "Platform," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Description of Service</h2>
              <p>
                GitCheck is a GitHub analytics platform that provides:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Developer scoring and performance metrics</li>
                <li>Repository analysis and insights</li>
                <li>Contribution tracking and visualization</li>
                <li>FREE and PRO subscription tiers</li>
                <li>Advanced analytics for PRO subscribers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Account Registration and GitHub OAuth</h2>
              
              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">GitHub Authentication</h3>
              <p>
                To use GitCheck, you must authenticate via GitHub OAuth. By signing in, you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authorize GitCheck to access your public GitHub profile data</li>
                <li>Grant read-only access to your public repositories</li>
                <li>Confirm you have the right to share this information</li>
                <li>Agree to GitHub's Terms of Service and Privacy Policy</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Account Responsibilities</h3>
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the security of your GitHub account</li>
                <li>All activity that occurs under your account</li>
                <li>Notifying us of unauthorized access</li>
                <li>Ensuring your GitHub profile data is accurate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Subscription Plans</h2>
              
              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">FREE Plan</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Basic GitHub profile analysis</li>
                <li>Core metrics and statistics</li>
                <li>Limited historical data</li>
                <li>No cost, available indefinitely</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">PRO Plan ($2.99 one-time)</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Lifetime access with one-time payment</li>
                <li>Advanced developer scoring algorithm</li>
                <li>README Quality Analysis (20% weight)</li>
                <li>Repository Health Metrics (25% weight)</li>
                <li>Developer Patterns Insights (30% weight)</li>
                <li>Career Readiness Analysis (25% weight)</li>
                <li>Comprehensive code quality assessment</li>
                <li>No recurring charges or subscriptions</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Payment Terms</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>PRO access is activated immediately upon payment</li>
                <li>All sales are final - no refunds</li>
                <li>Pricing subject to change for new purchases only</li>
                <li>Existing PRO users retain lifetime access</li>
                <li>Payments processed securely via Stripe</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Acceptable Use</h2>
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Abuse, harass, or harm the Service or other users</li>
                <li>Reverse engineer, decompile, or extract source code</li>
                <li>Use automated tools to scrape data excessively</li>
                <li>Bypass rate limits or security measures</li>
                <li>Share PRO account access with others</li>
                <li>Violate GitHub's Terms of Service or API guidelines</li>
                <li>Use the Service for illegal or unauthorized purposes</li>
                <li>Transmit malware, viruses, or malicious code</li>
                <li>Impersonate others or provide false information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Data Accuracy and Limitations</h2>
              <p>
                GitCheck analyzes publicly available GitHub data. We strive for accuracy but:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Scores and metrics are algorithmic estimates, not guarantees</li>
                <li>Analysis is based on public repository data only</li>
                <li>Results may not reflect private contributions</li>
                <li>GitHub API rate limits may delay analysis</li>
                <li>Cached data may be up to 1 hour old</li>
              </ul>
              <p className="mt-4">
                GitCheck is for informational purposes only and should not be solely relied upon for employment, academic, or financial decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Our Content</h3>
              <p>
                GitCheck's algorithms, scoring systems, UI/UX, branding, and code are proprietary and protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Your Data</h3>
              <p>
                You retain all rights to your GitHub data. By using GitCheck, you grant us a license to process and analyze your public GitHub data to provide the Service.
              </p>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Generated Reports</h3>
              <p>
                Analysis reports and visualizations generated by GitCheck are for your personal use. You may share them, but you may not sell or commercially exploit them without our permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Service Availability</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>Scheduled maintenance will be announced in advance when possible</li>
                <li>GitHub API outages may affect analysis capabilities</li>
                <li>We reserve the right to modify or discontinue features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Disclaimer of Warranties</h2>
              <p className="uppercase font-bold text-white/80">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p className="mt-4">
                We disclaim all warranties, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accuracy, reliability, or completeness of analysis</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement of third-party rights</li>
                <li>Uninterrupted or error-free operation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Limitation of Liability</h2>
              <p className="uppercase font-bold text-white/80">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, GITCHECK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
              <p className="mt-4">
                Our total liability for any claim arising from your use of the Service shall not exceed the amount you paid for PRO access ($2.99) or $100, whichever is greater.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Indemnification</h2>
              <p>
                You agree to indemnify and hold GitCheck harmless from any claims, damages, losses, or expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Your use or misuse of the Service</li>
                <li>Your GitHub account or data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Termination</h2>
              
              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">By You</h3>
              <p>
                You may terminate your account at any time by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Revoking GitHub OAuth access in your GitHub Settings</li>
                <li>Contacting us to request account deletion</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">By Us</h3>
              <p>
                We may suspend or terminate your access if you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Abuse the Service or other users</li>
                <li>Request termination</li>
              </ul>

              <p className="mt-4">
                Upon termination, your data will be deleted within 30 days. PRO access fees are non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting with an updated "Last updated" date. Continued use after changes constitutes acceptance of the new Terms.
              </p>
              <p className="mt-4">
                Material changes will be communicated via email or prominent notice on the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Third-Party Services</h2>
              <p>
                GitCheck integrates with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">GitHub:</strong> Subject to GitHub's Terms of Service and API guidelines</li>
                <li><strong className="text-white/80">Stripe:</strong> Payment processing subject to Stripe's terms</li>
                <li><strong className="text-white/80">Vercel:</strong> Hosting platform</li>
                <li><strong className="text-white/80">Neon:</strong> Database services</li>
              </ul>
              <p className="mt-4">
                We are not responsible for third-party services or their policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Dispute Resolution</h2>
              <p>
                Any disputes arising from these Terms or your use of GitCheck shall be resolved through:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Good faith negotiation</li>
                <li>Mediation (if negotiation fails)</li>
                <li>Binding arbitration (if mediation fails)</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will remain in full force and effect.
              </p>
            </section>          

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and Data Usage Policy, constitute the entire agreement between you and GitCheck regarding the Service.
              </p>
            </section>

          </div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap gap-4 justify-center text-sm  text-white/40"
        >
          <Link href="/privacy" className="hover:text-white/70 transition-colors">
            Privacy Policy
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
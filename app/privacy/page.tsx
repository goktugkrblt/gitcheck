"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* ✨ STATIC BACKGROUND (NO ANIMATION) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        
        {/* Gradient Mesh - Static */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        
        {/* Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
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
            Last updated: January 14, 2026
          </p>
        </motion.div>

        {/* Content - ESKİ CONTENT AYNI KALACAK */}
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
                GitCheck ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our public GitHub analytics service.
              </p>
              <p className="mt-4">
                <strong className="text-white/80">Important:</strong> GitCheck is a public analytics service. We do not require account creation or authentication. All analysis is performed on publicly available GitHub data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Information We Collect</h2>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Public GitHub Data</h3>
              <p>When you analyze a GitHub username, we collect and process publicly available data from GitHub's API:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>GitHub username and public profile information</li>
                <li>Public repository metadata (names, descriptions, stars, forks)</li>
                <li>Commit counts and contribution statistics</li>
                <li>Programming language usage from public repositories</li>
                <li>Public follower/following counts</li>
                <li>Account creation and last activity dates</li>
              </ul>
              <p className="mt-4 text-white/50 italic">
                We only access data that is already publicly visible on GitHub. We never access private repositories or non-public information.
              </p>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Analysis Results</h3>
              <p>We store calculated analytics for analyzed usernames:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Developer score (0-100 percentile ranking)</li>
                <li>Component scores (impact, quality, consistency, collaboration)</li>
                <li>Repository statistics and metrics</li>
                <li>Last analysis timestamp</li>
                <li>Global ranking position</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Technical Data</h3>
              <p>We automatically collect minimal technical information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address (for rate limiting and bot protection only)</li>
                <li>Request timestamps</li>
                <li>User agent information</li>
                <li>No personal identifiers or tracking cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">How We Use Your Information</h2>
              <p>We use collected information solely to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">Provide Analytics:</strong> Calculate developer scores using our statistical algorithms and display metrics</li>
                <li><strong className="text-white/80">Improve Services:</strong> Enhance scoring accuracy and optimize platform performance</li>
                <li><strong className="text-white/80">Prevent Abuse:</strong> Implement rate limiting and bot protection to ensure fair usage</li>
                <li><strong className="text-white/80">Performance:</strong> Cache analysis results to reduce API calls and improve response times</li>
                <li><strong className="text-white/80">Global Rankings:</strong> Maintain leaderboard and ranking statistics</li>
              </ul>
              <p className="mt-4 text-white/50 italic">
                We do not use your data for advertising, marketing, or any purpose unrelated to providing GitHub analytics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Data Storage and Security</h2>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Storage</h3>
              <p>
                Analysis results are stored in PostgreSQL databases hosted on Neon (neon.tech) with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted connections (SSL/TLS)</li>
                <li>Regular automated backups</li>
                <li>Geographic redundancy for reliability</li>
                <li>Serverless architecture for scalability</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">24-Hour Cache System</h3>
              <p>
                To respect GitHub API limits and improve performance, we implement a 24-hour caching system:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Each GitHub username can be analyzed once every 24 hours</li>
                <li>Cached results are served instantly for subsequent requests within the 24-hour window</li>
                <li>Cache automatically expires after 24 hours, allowing fresh analysis</li>
                <li>No personally identifiable information is cached beyond public GitHub data</li>
              </ul>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Security Measures</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP-based rate limiting (5 requests per 15 minutes)</li>
                <li>Honeypot fields and timing checks for bot detection</li>
                <li>Minimum 2-second interval between requests</li>
                <li>Environment variable protection for API keys</li>
                <li>No user accounts or passwords to compromise</li>
                <li>GitHub Personal Access Tokens secured server-side only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Data Sharing and Third Parties</h2>
              <p><strong className="text-white/80">We do not sell, rent, or share your data with third parties for marketing purposes.</strong></p>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Service Providers</h3>
              <p>We use the following trusted service providers to operate our platform:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">Vercel:</strong> Hosting and deployment (edge functions, serverless)</li>
                <li><strong className="text-white/80">Neon:</strong> PostgreSQL database hosting with encryption</li>
                <li><strong className="text-white/80">GitHub API:</strong> Public data access for analysis (read-only)</li>
              </ul>
              <p className="mt-4 text-white/50 italic">
                All service providers are contractually obligated to protect user data and use it only for providing their services.
              </p>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Public Leaderboard</h3>
              <p>
                Analysis results may appear on our public leaderboard, displaying:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>GitHub username (already public information)</li>
                <li>Developer score and ranking</li>
                <li>Last analysis timestamp</li>
              </ul>
              <p className="mt-4">
                All displayed information is derived from public GitHub data. If you wish to remove your profile from our database, please contact us.
              </p>

              <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">Legal Requirements</h3>
              <p>
                We may disclose information if required by law, regulation, legal process, or governmental request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Your Rights</h2>
              <p>Since we only store publicly available GitHub data, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">Access:</strong> View your analysis results at any time by entering your GitHub username</li>
                <li><strong className="text-white/80">Deletion:</strong> Request removal of your profile from our database (contact us via GitHub)</li>
                <li><strong className="text-white/80">Correction:</strong> Analysis automatically updates based on your current GitHub profile</li>
                <li><strong className="text-white/80">Portability:</strong> All displayed data can be exported from the dashboard</li>
                <li><strong className="text-white/80">Opt-out:</strong> Simply don't use the service - no account or authentication required</li>
              </ul>
              <p className="mt-4 text-white/50 italic">
                Since all analyzed data is publicly available on GitHub, removing it from GitCheck does not affect the source data on GitHub.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">Analysis Results:</strong> Cached for 24 hours, then regenerated on next request</li>
                <li><strong className="text-white/80">Profile Data:</strong> Retained indefinitely for leaderboard and historical tracking</li>
                <li><strong className="text-white/80">IP Addresses:</strong> Temporarily stored for rate limiting (cleared after 15 minutes)</li>
                <li><strong className="text-white/80">Request Logs:</strong> Kept for 30 days for security and debugging purposes</li>
                <li><strong className="text-white/80">Deletion Requests:</strong> Honored within 7 days upon valid request</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">GitHub API Usage</h2>
              <p>
                GitCheck uses GitHub's REST and GraphQL APIs with server-side Personal Access Tokens. We:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white/80">Read-Only Access:</strong> Only fetch public data, never request write permissions</li>
                <li><strong className="text-white/80">No Authentication Required:</strong> Users don't need to grant us OAuth access</li>
                <li><strong className="text-white/80">API Compliance:</strong> Fully comply with GitHub's API Terms of Service</li>
                <li><strong className="text-white/80">Rate Limits:</strong> Respect GitHub's rate limits (5,000 requests/hour) through caching</li>
                <li><strong className="text-white/80">GraphQL Optimization:</strong> Use GraphQL to fetch 100 repositories efficiently</li>
                <li><strong className="text-white/80">Fallback System:</strong> Automatic fallback to REST API if GraphQL fails</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white/90 mb-4">Cookies and Tracking</h2>
              <p><strong className="text-white/80">We do not use cookies.</strong></p>
              <p className="mt-4">
                GitCheck operates without user authentication, sessions, or cookies. All state is managed client-side temporarily and cleared when you close the browser.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>No authentication cookies</li>
                <li>No tracking pixels or analytics cookies</li>
                <li>No third-party advertising networks</li>
                <li>No persistent user identifiers</li>
              </ul>
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
          <Link href="/docs" className="hover:text-white/70 transition-colors">
            Documentation
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
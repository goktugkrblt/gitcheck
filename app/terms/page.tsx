"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050307] relative overflow-hidden">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 dark:bg-pink-500/10 rounded-full blur-[120px]" />
        </div>

        <div
          className="absolute inset-0 dark:block hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        <div
          className="absolute inset-0 dark:hidden block"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.6)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-black/40 dark:text-white/40 text-sm">
            Last updated: January 14, 2026
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="space-y-8 text-black/60 dark:text-white/60 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Agreement to Terms</h2>
              <p>
                By accessing or using GitCheck ("Service," "Platform," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p className="mt-4">
                GitCheck is a <strong className="text-black dark:text-white">public analytics platform</strong> that does not require user accounts or authentication. By entering a GitHub username for analysis, you acknowledge that you understand and accept these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Description of Service</h2>
              <p>
                GitCheck provides GitHub profile analytics and developer scoring based on publicly available data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Statistical developer scoring (0-100 percentile scale)</li>
                <li>Repository analysis and metrics</li>
                <li>Global leaderboard and ranking system</li>
                <li>Performance insights and visualizations</li>
                <li>24-hour caching for analyzed profiles</li>
              </ul>
              <p className="mt-4 text-black/50 dark:text-white/50 italic">
                All analysis is performed on publicly accessible GitHub data through GitHub's official API.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Acceptable Use</h2>

              <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-3 mt-6">You May:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Analyze any public GitHub profile (including your own or others')</li>
                <li>View and share analysis results</li>
                <li>Use the platform for personal or professional evaluation</li>
                <li>Reference GitCheck in your portfolio or resume</li>
              </ul>

              <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-3 mt-6">You May Not:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-black dark:text-white/80">Abuse the Service:</strong> Attempt to bypass rate limits, caching, or bot protection</li>
                <li><strong className="text-black dark:text-white/80">Automated Access:</strong> Use bots, scrapers, or automated tools without permission</li>
                <li><strong className="text-black dark:text-white/80">Manipulate Results:</strong> Artificially inflate GitHub metrics to game the scoring system</li>
                <li><strong className="text-black dark:text-white/80">Harass Others:</strong> Use analysis results to defame, harass, or discriminate against individuals</li>
                <li><strong className="text-black dark:text-white/80">Reverse Engineer:</strong> Attempt to extract, copy, or reverse engineer our scoring algorithms</li>
                <li><strong className="text-black dark:text-white/80">Overload Systems:</strong> Make excessive requests that could harm service availability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Rate Limits and Restrictions</h2>
              <p>
                To ensure fair usage and protect our infrastructure, we enforce the following limits:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-black dark:text-white/80">IP Rate Limit:</strong> 5 analysis requests per 15-minute window</li>
                <li><strong className="text-black dark:text-white/80">Request Interval:</strong> Minimum 2 seconds between consecutive requests</li>
                <li><strong className="text-black dark:text-white/80">Cache Duration:</strong> Profiles can be re-analyzed once every 24 hours</li>
                <li><strong className="text-black dark:text-white/80">Bot Protection:</strong> Automated requests must pass honeypot and timing validation</li>
              </ul>
              <p className="mt-4">
                Violation of these limits may result in temporary or permanent IP blocks.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Public Data and Privacy</h2>
              <p>
                <strong className="text-black dark:text-white/80">Important:</strong> GitCheck only accesses and analyzes publicly available GitHub data. By using this service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>You acknowledge that analyzed data is already public on GitHub</li>
                <li>You understand that analysis results may appear on our public leaderboard</li>
                <li>You accept that we store calculated metrics in our database</li>
                <li>You agree to our Privacy Policy regarding data collection and storage</li>
              </ul>
              <p className="mt-4 text-black/50 dark:text-white/50 italic">
                We never access private repositories, non-public data, or require OAuth authentication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-3 mt-6">Our IP</h3>
              <p>
                GitCheck's scoring algorithms, statistical models, user interface, codebase, and branding are proprietary intellectual property protected by copyright and trademark laws.
              </p>

              <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-3 mt-6">Your Data</h3>
              <p>
                You retain all rights to your GitHub data. Our analysis and derived scores are our intellectual property, but you may reference and share your results freely.
              </p>

              <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-3 mt-6">GitHub's Rights</h3>
              <p>
                All GitHub data accessed through our service remains subject to GitHub's Terms of Service. We comply with GitHub's API Terms and attribution requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Disclaimers</h2>

              <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-3 mt-6">Service "As Is"</h3>
              <p>
                GitCheck is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Accuracy or completeness of analysis results</li>
                <li>Uninterrupted or error-free service operation</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement of third-party rights</li>
              </ul>

              <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-3 mt-6">Score Interpretation</h3>
              <p>
                Developer scores are <strong className="text-black dark:text-white">statistical estimates</strong> based on publicly observable metrics. They should not be used as the sole basis for employment decisions, compensation, or professional evaluation.
              </p>
              <p className="mt-4 text-black/50 dark:text-white/50 italic">
                GitCheck scores measure GitHub activity patterns, not developer skill, work ethic, or professional competence.
              </p>

              <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-3 mt-6">External Dependencies</h3>
              <p>
                We rely on GitHub's API availability and data accuracy. We are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>GitHub API downtime or rate limit changes</li>
                <li>Inaccuracies in GitHub's publicly reported metrics</li>
                <li>Changes to GitHub's Terms of Service or API structure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, GitCheck and its developers shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Decisions made based on analysis results</li>
                <li>Service interruptions or data loss</li>
                <li>Third-party actions based on published scores</li>
              </ul>
              <p className="mt-4">
                In no event shall our total liability exceed $0 USD, as this is a free service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless GitCheck, its developers, and service providers from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your violation of these Terms</li>
                <li>Your misuse of the Service</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you submit or actions you take on the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Service Modifications</h2>
              <p>
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify, suspend, or discontinue the Service at any time</li>
                <li>Update scoring algorithms and methodology</li>
                <li>Change rate limits and usage restrictions</li>
                <li>Remove or modify features without notice</li>
              </ul>
              <p className="mt-4">
                We will make reasonable efforts to notify users of significant changes via the platform or our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Account Termination</h2>
              <p>
                Since GitCheck does not require user accounts, "termination" refers to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-black dark:text-white/80">IP Blocking:</strong> We may block IP addresses that violate these Terms</li>
                <li><strong className="text-black dark:text-white/80">Profile Removal:</strong> We may remove profiles from our database upon valid request</li>
                <li><strong className="text-black dark:text-white/80">Access Restriction:</strong> We may restrict access to specific features or the entire platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Turkey, without regard to its conflict of law provisions.
              </p>
              <p className="mt-4">
                Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts located in Istanbul, Turkey.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to this page with an updated "Last updated" date.
              </p>
              <p className="mt-4">
                Continued use of the Service after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Contact</h2>
              <p>
                For questions about these Terms, please contact us through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>GitHub: Open an issue on our repository</li>
                <li>Website: Visit our homepage for contact information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black/90 dark:text-white/90 mb-4">Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
              </p>
            </section>

          </div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-wrap gap-4 justify-center text-sm text-black/40 dark:text-white/40"
        >
          <Link href="/privacy" className="hover:text-black/70 dark:hover:text-white/70 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-black/70 dark:hover:text-white/70 transition-colors">
            Refund Policy
          </Link>
          <span>•</span>
          <Link href="/docs" className="hover:text-black/70 dark:hover:text-white/70 transition-colors">
            Documentation
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-black/70 dark:hover:text-white/70 transition-colors">
            Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

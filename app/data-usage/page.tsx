"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function DataUsagePage() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.004]"
          style={{
            backgroundImage: `radial-gradient(circle, #919191 1px, transparent 1px)`,
            backgroundSize: '250px 250px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-[#666] hover:text-[#919191] mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-mono cursor-pointer">Back to Home</span>
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black text-[#e0e0e0] mb-4 tracking-tighter">
            Data Usage Policy
          </h1>
          <p className="text-[#666] font-mono text-sm">
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
          <div className="space-y-8 text-[#919191] leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Overview</h2>
              <p>
                This Data Usage Policy explains how GitCheck collects, processes, analyzes, and utilizes your GitHub data to provide our analytics service. This policy supplements our Privacy Policy and Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">GitHub Data Collection</h2>
              
              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Public Repository Data</h3>
              <p>We collect and analyze the following from your public GitHub repositories:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Repository metadata:</strong> Names, descriptions, creation dates, stars, forks, watchers</li>
                <li><strong>Commit history:</strong> Commit messages, timestamps, frequency patterns, authorship</li>
                <li><strong>Code statistics:</strong> Lines of code, file counts, language distribution</li>
                <li><strong>Branch information:</strong> Active branches, default branch, branch protection</li>
                <li><strong>Pull requests:</strong> Created PRs, merge status, review participation</li>
                <li><strong>Issues:</strong> Opened issues, closed issues, response times</li>
                <li><strong>Documentation:</strong> README files, Wiki pages, docs folders</li>
                <li><strong>CI/CD:</strong> GitHub Actions workflows, test configurations</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Profile Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Username and display name</li>
                <li>Avatar URL</li>
                <li>Bio and location</li>
                <li>Account creation date</li>
                <li>Follower and following counts</li>
                <li>Organization memberships</li>
                <li>Public email (if provided)</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Activity Metrics</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contribution graph data</li>
                <li>Commit frequency and patterns</li>
                <li>Active hours and days</li>
                <li>Streak information</li>
                <li>Language usage over time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Data Processing and Analysis</h2>
              
              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">FREE Tier Analysis</h3>
              <p>For FREE users, we calculate:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Basic metrics:</strong> Total repos, stars, forks, commits, PRs</li>
                <li><strong>Activity stats:</strong> Current streak, longest streak, contributions</li>
                <li><strong>Language breakdown:</strong> Primary languages with percentages</li>
                <li><strong>Top repositories:</strong> Most starred/forked projects</li>
                <li><strong>Contribution patterns:</strong> Activity heatmap, most active days</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">PRO Tier Advanced Analysis</h3>
              <p>PRO subscribers receive comprehensive analysis across four domains:</p>

              <h4 className="text-lg font-semibold text-[#e0e0e0] mb-2 mt-4">1. README Quality Analysis (20% of score)</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Documentation length and completeness</li>
                <li>Presence of key sections (Installation, Usage, Contributing)</li>
                <li>Badge usage (build status, coverage, version)</li>
                <li>Structure and formatting quality</li>
                <li>Example code snippets</li>
                <li>License information</li>
              </ul>

              <h4 className="text-lg font-semibold text-[#e0e0e0] mb-2 mt-4">2. Repository Health (25% of score)</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Maintenance frequency (recent commits)</li>
                <li>Issue response time and resolution rate</li>
                <li>PR merge rate and review quality</li>
                <li>Security: Dependabot alerts, vulnerability scanning</li>
                <li>Community engagement (stars, forks, contributors)</li>
                <li>Branch protection and code review policies</li>
              </ul>

              <h4 className="text-lg font-semibold text-[#e0e0e0] mb-2 mt-4">3. Developer Patterns (30% of score)</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Commit patterns by hour (0-23 heatmap)</li>
                <li>Language evolution tracking</li>
                <li>Productivity peak identification</li>
                <li>Collaboration style (solo vs team projects)</li>
                <li>Consistency of contributions</li>
                <li>Weekend vs weekday activity ratio</li>
              </ul>

              <h4 className="text-lg font-semibold text-[#e0e0e0] mb-2 mt-4">4. Career Insights (25% of score)</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Experience level (based on account age and depth)</li>
                <li>Specialization score (technology focus areas)</li>
                <li>Consistency rating (commitment patterns)</li>
                <li>Learning curve (skill development trajectory)</li>
                <li>Portfolio quality assessment</li>
                <li>Professional presentation indicators</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Scoring Algorithm</h2>
              
              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Overall Developer Score (0-100)</h3>
              <p>The comprehensive score is calculated as:</p>
              <div className="bg-[#252525] border border-[#2a2a2a] rounded-lg p-6 my-4 font-mono text-sm">
                <p>Score = (README × 0.20) + (Repo Health × 0.25) + (Dev Patterns × 0.30) + (Career × 0.25)</p>
              </div>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Grade Assignment</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>S Grade:</strong> 95-100 (Elite)</li>
                <li><strong>A Grade:</strong> 85-94 (Excellent)</li>
                <li><strong>B Grade:</strong> 70-84 (Very Good)</li>
                <li><strong>C Grade:</strong> 55-69 (Good)</li>
                <li><strong>D Grade:</strong> 40-54 (Fair)</li>
                <li><strong>F Grade:</strong> 0-39 (Needs Improvement)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Data Storage and Caching</h2>
              
              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Database Storage (PostgreSQL via Neon)</h3>
              <p>We permanently store:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>User profile:</strong> GitHub username, email, avatar, bio</li>
                <li><strong>Analysis snapshots:</strong> Historical scores and metrics</li>
                <li><strong>Subscription status:</strong> FREE/PRO tier and purchase date</li>
                <li><strong>Session data:</strong> Login timestamps, last analysis date</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Server-Side Caching (1 hour TTL)</h3>
              <p>Analysis results are cached to improve performance:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>PRO analysis results cached for 60 minutes</li>
                <li>Automatic cache invalidation after TTL expires</li>
                <li>Manual refresh available via "Recalculate" button</li>
                <li>Cache keys based on username and analysis type</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Client-Side Session Storage</h3>
              <p>Temporary storage during your session:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Recent analysis results for instant loading</li>
                <li>Cleared when you close the browser tab</li>
                <li>Not shared across devices</li>
                <li>Used only for UI performance optimization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">GitHub API Usage</h2>
              
              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">API Endpoints We Access</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><code>/user</code> - Basic profile information</li>
                <li><code>/users/:username/repos</code> - Repository list</li>
                <li><code>/repos/:owner/:repo</code> - Repository details</li>
                <li><code>/repos/:owner/:repo/commits</code> - Commit history</li>
                <li><code>/repos/:owner/:repo/pulls</code> - Pull request data</li>
                <li><code>/repos/:owner/:repo/issues</code> - Issue tracking</li>
                <li><code>/repos/:owner/:repo/languages</code> - Language statistics</li>
                <li><code>/repos/:owner/:repo/readme</code> - README content</li>
                <li><code>/users/:username/events</code> - Contribution activity</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Rate Limits and Optimization</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We respect GitHub's rate limits (5,000 requests/hour for authenticated users)</li>
                <li>Intelligent caching reduces redundant API calls</li>
                <li>Parallel processing for faster analysis</li>
                <li>Exponential backoff for rate limit handling</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Permissions Required</h3>
              <p>GitCheck requests OAuth scopes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>read:user</strong> - Read profile information</li>
                <li><strong>repo</strong> (public only) - Access public repository data</li>
              </ul>
              <p className="mt-4">
                We do NOT request write permissions or access to private repositories.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Data Processing Location</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Application hosting:</strong> Vercel (global CDN)</li>
                <li><strong>Database:</strong> Neon PostgreSQL (EU/US regions)</li>
                <li><strong>GitHub API:</strong> api.github.com (GitHub's infrastructure)</li>
                <li><strong>Payment processing:</strong> Stripe (when applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Data Retention</h2>
              
              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Active Accounts</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Profile data retained indefinitely while account is active</li>
                <li>Analysis snapshots kept for historical comparison</li>
                <li>Cache automatically expires and refreshes</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Inactive Accounts</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accounts inactive for 12+ months may be archived</li>
                <li>Archived data can be restored upon login</li>
                <li>Session data cleared after 30 days of inactivity</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Deleted Accounts</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All user data deleted within 30 days of account deletion</li>
                <li>Backups purged within 90 days</li>
                <li>Aggregated anonymous analytics may be retained</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Data Accuracy and Updates</h2>
              <p>
                GitCheck analyzes your GitHub data as of the moment you run an analysis. To ensure accuracy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>FREE users can re-analyze anytime</li>
                <li>PRO users can refresh analysis after cache expires (1 hour)</li>
                <li>New repositories appear in next analysis</li>
                <li>Historical data reflects GitHub's permanent record</li>
                <li>Deleted repositories are removed from future analyses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Data Sharing and Third Parties</h2>
              <p>
                We do NOT sell your data. We only share data with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>GitHub:</strong> To fetch your public data via their API</li>
                <li><strong>Vercel:</strong> For hosting and processing</li>
                <li><strong>Neon:</strong> For secure database storage</li>
                <li><strong>Stripe:</strong> For payment processing (PRO users only)</li>
                <li><strong>Legal authorities:</strong> If required by law</li>
              </ul>
              <p className="mt-4">
                All third-party processors are contractually bound to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Your Data Rights</h2>
              
              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Access</h3>
              <p>
                View your analyzed data anytime in your dashboard. Request a complete data export by contacting us.
              </p>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Correction</h3>
              <p>
                Data is fetched directly from GitHub. To correct it, update your GitHub profile, then re-analyze.
              </p>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Deletion</h3>
              <p>
                Revoke GitHub OAuth access or request account deletion. All data removed within 30 days.
              </p>

              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-3 mt-6">Portability</h3>
              <p>
                Export your analysis results in JSON format (feature coming soon).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Updates to This Policy</h2>
              <p>
                We may update this Data Usage Policy to reflect changes in our practices or legal requirements. Significant updates will be communicated via email or prominent website notice.
              </p>
            </section>           

          </div>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-[#2a2a2a] flex flex-wrap gap-4 justify-center text-sm font-mono text-[#666]"
        >
          <Link href="/privacy" className="hover:text-[#919191] transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#919191] transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-[#919191] transition-colors">
            Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
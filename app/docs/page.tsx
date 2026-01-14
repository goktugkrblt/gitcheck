"use client";

import Link from "next/link";
import { ArrowLeft, Code, Zap, Shield, TrendingUp, Database, GitBranch, Award, BarChart3, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
        </div>

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

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
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
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Documentation
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Learn how GitCheck analyzes GitHub profiles and calculates developer scores using advanced statistical algorithms.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
        >
          <a href="#how-it-works" className="group">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
              <Code className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-white font-bold mb-2">How It Works</h3>
              <p className="text-white/40 text-sm">Understanding the analysis process</p>
            </div>
          </a>
          <a href="#scoring-system" className="group">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-white font-bold mb-2">Scoring System</h3>
              <p className="text-white/40 text-sm">Statistical algorithms explained</p>
            </div>
          </a>
          <a href="#api" className="group">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
              <Database className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-bold mb-2">Technical Details</h3>
              <p className="text-white/40 text-sm">Architecture and data flow</p>
            </div>
          </a>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-16"
        >

          {/* How It Works */}
          <section id="how-it-works" className="scroll-mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">How It Works</h2>
            </div>

            <div className="space-y-6 text-white/60 leading-relaxed">
              <p>
                GitCheck is a <strong className="text-white">public analytics platform</strong> that analyzes GitHub profiles without requiring authentication. Simply enter any GitHub username to get instant insights.
              </p>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Analysis Process
                </h3>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">1</span>
                    <div>
                      <strong className="text-white">Input Validation</strong>
                      <p className="text-white/50 mt-1">GitHub username or profile URL → Extract username → Validate format</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">2</span>
                    <div>
                      <strong className="text-white">Bot Protection</strong>
                      <p className="text-white/50 mt-1">Honeypot check → Request timing validation → IP-based rate limiting (5 req/15min)</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">3</span>
                    <div>
                      <strong className="text-white">Cache Check (24 Hours)</strong>
                      <p className="text-white/50 mt-1">If analyzed within 24 hours → Return cached results immediately</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">4</span>
                    <div>
                      <strong className="text-white">GitHub API Fetch</strong>
                      <p className="text-white/50 mt-1">GraphQL query for 100 repositories → Fallback to REST API if needed → Extract public data</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">5</span>
                    <div>
                      <strong className="text-white">Statistical Analysis</strong>
                      <p className="text-white/50 mt-1">Calculate component scores → Apply z-score normalization → Generate percentile with 0.01 precision</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">6</span>
                    <div>
                      <strong className="text-white">Store & Display</strong>
                      <p className="text-white/50 mt-1">Save to PostgreSQL → Calculate global rank → Return results with cache metadata</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Scoring System */}
          <section id="scoring-system" className="scroll-mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-green-400" />
              <h2 className="text-3xl font-bold text-white">Scoring System v5.0</h2>
            </div>

            <div className="space-y-6 text-white/60 leading-relaxed">
              <p>
                GitCheck uses a <strong className="text-white">pure statistical model</strong> that compares developers against a baseline of 100,000+ GitHub profiles. Our v5.0 scoring system achieves <strong className="text-white">0.01 precision</strong> to differentiate even the top performers.
              </p>

              {/* Component Weights */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Four Core Components
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">Impact (35%)</span>
                      <span className="text-green-400 font-mono text-sm">Highest Weight</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: '35%' }} />
                    </div>
                    <p className="text-white/50 text-sm">Stars received, forks, community engagement, repository reach</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">Code Quality (30%)</span>
                      <span className="text-blue-400 font-mono text-sm">Second Highest</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <p className="text-white/50 text-sm">Repository maintenance, issue resolution, pull request patterns, code health</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">Consistency (20%)</span>
                      <span className="text-purple-400 font-mono text-sm">Third</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{ width: '20%' }} />
                    </div>
                    <p className="text-white/50 text-sm">Commit frequency, contribution regularity, sustained activity patterns</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">Collaboration (15%)</span>
                      <span className="text-orange-400 font-mono text-sm">Fourth</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full" style={{ width: '15%' }} />
                    </div>
                    <p className="text-white/50 text-sm">Pull requests submitted, code reviews, community contributions, teamwork</p>
                  </div>
                </div>
              </div>

              {/* Mathematical Formula */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Statistical Formula</h3>

                <div className="space-y-4 font-mono text-sm">
                  <div>
                    <p className="text-white/40 mb-2">1. Calculate raw metrics for each component:</p>
                    <div className="bg-white/5 rounded-lg p-4 text-blue-300">
                      impact = stars + (forks × 2) + (watchers × 0.5)
                      <br />
                      quality = avgCommits × maintenance × issueResolution
                      <br />
                      consistency = commitFrequency × activityScore
                      <br />
                      collaboration = pullRequests + contributions
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 mb-2">2. Apply z-score normalization (compare to 100K+ baseline):</p>
                    <div className="bg-white/5 rounded-lg p-4 text-green-300">
                      z = (value - populationMean) / populationStdDev
                      <br />
                      // Uses IQR-based robust scaling for outlier handling
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 mb-2">3. Convert to percentile with 48-point interpolation:</p>
                    <div className="bg-white/5 rounded-lg p-4 text-purple-300">
                      percentile = interpolate(zScore, lookupTable)
                      <br />
                      // Cubic easing for >95th percentile precision
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 mb-2">4. Calculate weighted final score:</p>
                    <div className="bg-white/5 rounded-lg p-4 text-yellow-300">
                      score = (impact × 0.35) + (quality × 0.30)
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (consistency × 0.20) + (collab × 0.15)
                      <br />
                      // Rounded to 2 decimal places: XX.XX
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-sm font-semibold mb-2">Example Output:</p>
                  <p className="text-white/60 text-sm">gaearon: 99.40 | sindresorhus: 99.58 | torvalds: 96.93</p>
                  <p className="text-white/40 text-xs mt-2">Each score is unique down to 0.01 precision, enabling accurate rankings even at 10,000+ users.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Architecture */}
          <section id="api" className="scroll-mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Technical Architecture</h2>
            </div>

            <div className="space-y-6 text-white/60 leading-relaxed">

              {/* Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Frontend</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">▸</span>
                      <span><strong className="text-white">Next.js 16.0.8</strong> with Turbopack</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">▸</span>
                      <span><strong className="text-white">React 19.2</strong> with Server Components</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">▸</span>
                      <span><strong className="text-white">Framer Motion</strong> for animations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">▸</span>
                      <span><strong className="text-white">TailwindCSS 4</strong> for styling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">▸</span>
                      <span><strong className="text-white">TypeScript 5</strong> strict mode</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Backend</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">▸</span>
                      <span><strong className="text-white">Next.js API Routes</strong> (serverless)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">▸</span>
                      <span><strong className="text-white">PostgreSQL</strong> on Neon (serverless)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">▸</span>
                      <span><strong className="text-white">Prisma ORM</strong> v5.22</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">▸</span>
                      <span><strong className="text-white">GitHub API</strong> GraphQL + REST</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">▸</span>
                      <span><strong className="text-white">Vercel Edge</strong> deployment</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Data Flow */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Data Flow</h3>
                <div className="space-y-3 text-sm font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">1.</span>
                    <span>User Input → Next.js Frontend</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">2.</span>
                    <span>POST /api/analyze-username → Bot Protection Layer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">3.</span>
                    <span>Check PostgreSQL Cache (24h TTL)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">4.</span>
                    <span>If Miss → GitHub GraphQL API (100 repos)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">5.</span>
                    <span>Statistical Analysis Engine → Calculate Score</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">6.</span>
                    <span>Save to PostgreSQL → Return JSON Response</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">7.</span>
                    <span>GET /api/global-rank → Calculate Position</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">8.</span>
                    <span>Render Dashboard → Display Analytics</span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Rate Limiting
                </h3>
                <div className="space-y-3">
                  <div>
                    <strong className="text-white">Honeypot Detection:</strong>
                    <p className="text-white/50 text-sm mt-1">Hidden form field that bots fill but humans can't see</p>
                  </div>
                  <div>
                    <strong className="text-white">Request Timing:</strong>
                    <p className="text-white/50 text-sm mt-1">Minimum 1 second delay from page load (bots submit instantly)</p>
                  </div>
                  <div>
                    <strong className="text-white">IP Rate Limiting:</strong>
                    <p className="text-white/50 text-sm mt-1">5 requests per 15 minutes, 2-second minimum between requests</p>
                  </div>
                  <div>
                    <strong className="text-white">24-Hour Cache:</strong>
                    <p className="text-white/50 text-sm mt-1">Prevents excessive GitHub API usage and protects against abuse</p>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Optimizations
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span><strong className="text-white">GraphQL Batching:</strong> Fetch 100 repos in single query (vs 100 REST calls)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span><strong className="text-white">Database Indexing:</strong> B-tree indexes on username, score, timestamp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span><strong className="text-white">Edge Caching:</strong> Vercel Edge Network for global low-latency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span><strong className="text-white">Lazy Loading:</strong> Code splitting and dynamic imports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">✓</span>
                    <span><strong className="text-white">In-Memory Rate Limit:</strong> Map-based store with automatic cleanup</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section id="api-reference" className="scroll-mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-8 h-8 text-cyan-400" />
              <h2 className="text-3xl font-bold text-white">API Endpoints</h2>
            </div>

            <div className="space-y-4">
              {/* Analyze Username */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm font-mono">POST</span>
                  <code className="text-white font-mono">/api/analyze-username</code>
                </div>
                <p className="text-white/60 mb-4">Analyze a GitHub username and return developer score with metrics</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-sm mb-2">Request Body:</p>
                    <pre className="bg-black/40 rounded-lg p-4 text-sm overflow-x-auto"><code className="text-green-300">{`{
  "username": "gaearon",
  "_honeypot": "",
  "_timestamp": 1234567890
}`}</code></pre>
                  </div>

                  <div>
                    <p className="text-white/40 text-sm mb-2">Response (200 OK):</p>
                    <pre className="bg-black/40 rounded-lg p-4 text-sm overflow-x-auto"><code className="text-blue-300">{`{
  "success": true,
  "profile": {
    "username": "gaearon",
    "score": 99.40,
    "percentile": 99.40,
    "totalRepos": 89,
    "totalStars": 45230,
    "totalCommits": 12450,
    // ... more fields
  },
  "cached": false
}`}</code></pre>
                  </div>
                </div>
              </div>

              {/* Global Rank */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-400 text-sm font-mono">GET</span>
                  <code className="text-white font-mono">/api/global-rank?username=gaearon</code>
                </div>
                <p className="text-white/60 mb-4">Get global ranking position for a user</p>

                <div>
                  <p className="text-white/40 text-sm mb-2">Response (200 OK):</p>
                  <pre className="bg-black/40 rounded-lg p-4 text-sm overflow-x-auto"><code className="text-purple-300">{`{
  "rank": 2,
  "totalProfiles": 1247,
  "percentile": 99.84,
  "score": 99.40
}`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              <details className="bg-white/5 border border-white/10 rounded-xl p-6 group cursor-pointer">
                <summary className="text-white font-semibold cursor-pointer list-none">
                  Why can I only analyze once every 24 hours?
                </summary>
                <p className="text-white/60 mt-4 text-sm leading-relaxed">
                  To respect GitHub's API rate limits and prevent abuse, we cache analysis results for 24 hours. GitHub profiles don't change significantly within a day, so this ensures fair usage while maintaining accuracy.
                </p>
              </details>

              <details className="bg-white/5 border border-white/10 rounded-xl p-6 group cursor-pointer">
                <summary className="text-white font-semibold cursor-pointer list-none">
                  How is my score calculated?
                </summary>
                <p className="text-white/60 mt-4 text-sm leading-relaxed">
                  We use a pure statistical model (v5.0) that compares your GitHub metrics against 100,000+ developer baseline. Four components are weighted: Impact (35%), Code Quality (30%), Consistency (20%), and Collaboration (15%). Z-score normalization ensures fair comparison, and 48-point interpolation provides 0.01 precision.
                </p>
              </details>

              <details className="bg-white/5 border border-white/10 rounded-xl p-6 group cursor-pointer">
                <summary className="text-white font-semibold cursor-pointer list-none">
                  Do you access private repositories?
                </summary>
                <p className="text-white/60 mt-4 text-sm leading-relaxed">
                  <strong className="text-white">No.</strong> We only analyze publicly available data from GitHub. We never request OAuth permissions and cannot access private repositories, emails, or any non-public information.
                </p>
              </details>

              <details className="bg-white/5 border border-white/10 rounded-xl p-6 group cursor-pointer">
                <summary className="text-white font-semibold cursor-pointer list-none">
                  Can I delete my data?
                </summary>
                <p className="text-white/60 mt-4 text-sm leading-relaxed">
                  Yes. Since we only store public GitHub data, you can request deletion anytime. However, the source data remains on GitHub. Contact us to remove your profile from our database.
                </p>
              </details>

              <details className="bg-white/5 border border-white/10 rounded-xl p-6 group cursor-pointer">
                <summary className="text-white font-semibold cursor-pointer list-none">
                  How accurate is the global ranking?
                </summary>
                <p className="text-white/60 mt-4 text-sm leading-relaxed">
                  Very accurate. Our v5.0 system provides 0.01 precision (e.g., 99.40 vs 99.58), meaning even with 10,000+ users, each rank is unique. Rankings are calculated in real-time from the PostgreSQL database.
                </p>
              </details>
            </div>
          </section>

        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap gap-4 justify-center text-sm text-white/40"
        >
          <Link href="/privacy" className="hover:text-white/70 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white/70 transition-colors">
            Terms of Service
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

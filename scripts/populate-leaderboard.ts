/**
 * Populate Leaderboard Script
 * Analyzes 30 high-quality GitHub profiles and adds them to the database
 *
 * Note: This script doesn't need GITHUB_TOKEN as it calls the public API endpoint
 * The API endpoint itself uses the token from environment variables
 */

const API_URL = 'http://localhost:3000/api/analyze-username';

// 30 high-quality developers from different domains
const developers = [
  // JavaScript/TypeScript legends
  'torvalds',      // Linux creator
  'gaearon',       // React core team
  'tj',            // Express.js, Commander.js
  'sindresorhus',  // 1000+ npm packages
  'addyosmani',    // Google Chrome team
  'kentcdodds',    // Testing expert
  'wesbos',        // Web development educator

  // Frontend masters
  'vuejs',         // Vue.js framework
  'yyx990803',     // Evan You - Vue creator
  'developit',     // Preact creator
  'jamiebuilds',   // Babel, Yarn contributor
  'necolas',       // React Native Web

  // Backend & Infrastructure
  'kelseyhightower', // Kubernetes expert
  'mitchellh',     // HashiCorp founder
  'jessfraz',      // Container security
  'ahmetb',        // Google Cloud

  // Python & Data Science
  'kennethreitz',  // Requests library
  'nvie',          // Git flow creator
  'mitsuhiko',     // Flask creator
  'jakevdp',       // Data science educator

  // Go & Systems
  'bradfitz',      // Go core team
  'spf13',         // Hugo, Cobra creator
  'rakyll',        // Google Go team

  // Open Source stars
  'holman',        // GitHub culture
  'defunkt',       // GitHub co-founder
  'pjhyett',       // GitHub co-founder
  'schacon',       // Pro Git author

  // Modern web
  'vercel',        // Vercel/Next.js
  'shadcn',        // shadcn/ui creator
  't3dotgg'        // Theo - T3 stack
];

interface AnalysisResult {
  username: string;
  success: boolean;
  score?: number;
  error?: string;
  cached?: boolean;
}

async function analyzeUser(username: string, index: number, total: number): Promise<AnalysisResult> {
  try {
    console.log(`\n[${index + 1}/${total}] Analyzing ${username}...`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        _honeypot: '', // Empty honeypot (we're not a bot)
        _timestamp: Date.now() - 2000, // Simulate 2 seconds delay
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Failed: ${data.error || 'Unknown error'}`);
      return { username, success: false, error: data.error };
    }

    const score = data.profile?.score || 0;
    const cached = data.cached || false;

    if (cached) {
      console.log(`💾 Cached: ${username} (Score: ${score})`);
    } else {
      console.log(`✅ Success: ${username} (Score: ${score})`);
    }

    return { username, success: true, score, cached };
  } catch (error) {
    console.error(`❌ Network error for ${username}:`, error);
    return { username, success: false, error: 'Network error' };
  }
}

async function main() {
  console.log('🚀 Starting leaderboard population...');
  console.log(`📊 Total developers to analyze: ${developers.length}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(developers.length * 45 / 60)} minutes\n`);

  const results: AnalysisResult[] = [];
  let successful = 0;
  let failed = 0;
  let cached = 0;

  for (let i = 0; i < developers.length; i++) {
    const result = await analyzeUser(developers[i], i, developers.length);
    results.push(result);

    if (result.success) {
      successful++;
      if (result.cached) cached++;
    } else {
      failed++;
    }

    // Wait 3 seconds between requests to avoid rate limiting
    if (i < developers.length - 1) {
      console.log('⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successful}`);
  console.log(`💾 Cached: ${cached}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${developers.length}`);

  // Top 10 scores
  const sortedResults = results
    .filter(r => r.success && r.score)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10);

  console.log('\n🏆 TOP 10 SCORES:');
  sortedResults.forEach((result, idx) => {
    console.log(`${idx + 1}. ${result.username.padEnd(20)} - ${result.score?.toFixed(2)}`);
  });

  // Failed analyses
  if (failed > 0) {
    console.log('\n❌ FAILED ANALYSES:');
    results
      .filter(r => !r.success)
      .forEach(result => {
        console.log(`- ${result.username}: ${result.error}`);
      });
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);

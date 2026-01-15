import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reanalyzeProfile(username) {
  try {
    console.log(`\n🔄 Re-analyzing ${username}...`);

    const timestamp = Date.now();
    // Wait 1.5 seconds to satisfy bot protection timing check
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Call the analyze-username API endpoint
    const response = await fetch('http://localhost:3000/api/analyze-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        _honeypot: '', // Bot protection field (should be empty)
        _timestamp: timestamp // Request timing for bot protection
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // If cached, just return the cached data
      if (errorData.cached) {
        console.log(`⚡ ${username}: ${errorData.profile?.score?.toFixed(2) || 'N/A'} (cached)`);
        return errorData;
      }

      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    const isCached = data.cached ? ' (cached)' : '';
    console.log(`✅ ${username}: ${data.profile?.score?.toFixed(2) || 'N/A'}${isCached}`);

    return data;
  } catch (error) {
    console.error(`❌ Error analyzing ${username}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting re-analysis of all profiles...\n');

  // Get all profiles
  const profiles = await prisma.profile.findMany({
    select: {
      username: true,
      score: true,
      scannedAt: true
    },
    orderBy: { score: 'desc' }
  });

  console.log(`📊 Found ${profiles.length} profiles to re-analyze\n`);
  console.log('Username              Old Score    New Score    Change       Status');
  console.log('─'.repeat(80));

  const results = [];

  // Re-analyze each profile sequentially (to avoid rate limits)
  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const oldScore = profile.score || 0;

    // Wait 3 seconds between requests to avoid rate limits
    if (results.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    const newData = await reanalyzeProfile(profile.username);
    const newScore = newData?.profile?.score || 0;
    const change = newScore - oldScore;
    const changeStr = change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
    const isCached = newData?.cached ? '📦 Cached' : '✨ Fresh';

    console.log(
      `${profile.username.padEnd(20)} ${oldScore.toFixed(2).padEnd(12)} ` +
      `${newScore.toFixed(2).padEnd(12)} ${changeStr.padEnd(12)} ${isCached}`
    );

    results.push({
      username: profile.username,
      oldScore,
      newScore,
      change,
      cached: newData?.cached || false
    });

    // Show progress
    console.log(`   Progress: ${i + 1}/${profiles.length} (${Math.round((i + 1) / profiles.length * 100)}%)`);
  }

  console.log('\n' + '─'.repeat(80));
  console.log('\n📈 Summary:');

  const freshResults = results.filter(r => !r.cached);
  const cachedResults = results.filter(r => r.cached);

  if (freshResults.length > 0) {
    const avgChange = freshResults.reduce((sum, r) => sum + r.change, 0) / freshResults.length;
    const increased = freshResults.filter(r => r.change > 0).length;
    const decreased = freshResults.filter(r => r.change < 0).length;
    const unchanged = freshResults.filter(r => r.change === 0).length;

    console.log(`\nFresh analyses: ${freshResults.length}`);
    console.log(`  Average change: ${avgChange.toFixed(2)}`);
    console.log(`  Increased: ${increased}, Decreased: ${decreased}, Unchanged: ${unchanged}`);
  }

  console.log(`\nCached results: ${cachedResults.length} (analyzed within last 24 hours)`);

  const biggestIncrease = results.reduce((max, r) => r.change > max.change ? r : max, results[0]);
  const biggestDecrease = results.reduce((min, r) => r.change < min.change ? r : min, results[0]);

  if (biggestIncrease.change > 0) {
    console.log(`\n🏆 Biggest increase: ${biggestIncrease.username} (+${biggestIncrease.change.toFixed(2)})`);
  }
  if (biggestDecrease.change < 0) {
    console.log(`📉 Biggest decrease: ${biggestDecrease.username} (${biggestDecrease.change.toFixed(2)})`);
  }

  console.log('\n✅ Re-analysis complete!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

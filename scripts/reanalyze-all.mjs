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
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log(`✅ ${username}: ${data.profile?.score?.toFixed(2) || 'N/A'}`);

    return data;
  } catch (error) {
    console.error(`❌ Error analyzing ${username}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting re-analysis of all profiles...\n');

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      githubUsername: true,
      plan: true,
      profiles: {
        select: {
          score: true,
          scannedAt: true
        },
        orderBy: { scannedAt: 'desc' },
        take: 1
      }
    }
  });

  console.log(`📊 Found ${users.length} users to re-analyze\n`);
  console.log('Username              Old Score    New Score    Change');
  console.log('─'.repeat(70));

  const results = [];

  // Re-analyze each user sequentially (to avoid rate limits)
  for (const user of users) {
    const oldScore = user.profiles[0]?.score || 0;

    // Wait 2 seconds between requests to avoid rate limits
    if (results.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const newData = await reanalyzeProfile(user.githubUsername);
    const newScore = newData?.profile?.score || 0;
    const change = newScore - oldScore;
    const changeStr = change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);

    console.log(
      `${user.githubUsername.padEnd(20)} ${oldScore.toFixed(2).padEnd(12)} ` +
      `${newScore.toFixed(2).padEnd(12)} ${changeStr}`
    );

    results.push({
      username: user.githubUsername,
      oldScore,
      newScore,
      change
    });
  }

  console.log('\n' + '─'.repeat(70));
  console.log('\n📈 Summary:');

  const avgChange = results.reduce((sum, r) => sum + r.change, 0) / results.length;
  const increased = results.filter(r => r.change > 0).length;
  const decreased = results.filter(r => r.change < 0).length;
  const unchanged = results.filter(r => r.change === 0).length;

  console.log(`Average change: ${avgChange.toFixed(2)}`);
  console.log(`Increased: ${increased}, Decreased: ${decreased}, Unchanged: ${unchanged}`);
  console.log('\n✅ Re-analysis complete!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

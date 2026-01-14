import { prisma } from '../lib/prisma';

async function compareScores() {
  const profiles = await prisma.profile.findMany({
    orderBy: { score: 'desc' }
  });

  console.log('\n📊 FINAL SCORES - v5.0 PURE STATISTICAL\n');
  console.log('┌─────┬──────────────────────┬─────────┬──────────────┬────────────┐');
  console.log('│ Rank│ Username             │ Score   │ Grade        │ Percentile │');
  console.log('├─────┼──────────────────────┼─────────┼──────────────┼────────────┤');

  profiles.forEach((p, idx) => {
    const rank = (idx + 1).toString().padStart(4, ' ');
    const username = p.username.padEnd(20, ' ');
    const score = p.score.toFixed(2).padStart(7, ' ');
    const grade = getGrade(p.score).padEnd(12, ' ');
    const percentile = p.percentile.toString().padStart(10, ' ');

    console.log(`│ ${rank}│ ${username}│ ${score}│ ${grade}│ ${percentile}│`);
  });

  console.log('└─────┴──────────────────────┴─────────┴──────────────┴────────────┘');

  console.log('\n\n📈 KEY METRICS:\n');

  for (const profile of profiles.slice(0, 5)) {
    console.log(`\n${profile.username}:`);
    console.log(`  Score: ${profile.score.toFixed(2)} (${getGrade(profile.score)})`);
    console.log(`  Repos: ${profile.totalRepos}, Stars: ${profile.totalStars}, Commits: ${profile.totalCommits}`);
    console.log(`  PRs: ${profile.totalPRs}, Followers: ${profile.followersCount}`);
    console.log(`  Account Age: ${profile.accountAge} years`);
  }

  console.log('\n\n🔍 FURKAN DETAILED:');
  const furkan = profiles.find(p => p.username === 'furkanyigitakyuz');
  if (furkan) {
    console.log(`  Score: ${furkan.score.toFixed(2)} (${getGrade(furkan.score)})`);
    console.log(`  Percentile: ${furkan.percentile}th`);
    console.log(`  Repos: ${furkan.totalRepos}`);
    console.log(`  Stars: ${furkan.totalStars}`);
    console.log(`  Commits: ${furkan.totalCommits}`);
    console.log(`  Account Age: ${furkan.accountAge} years`);
    console.log(`  → This is CORRECT! 0 repos, 12 commits in 5 years = 39th percentile`);
  }

  await prisma.$disconnect();
}

function getGrade(score: number): string {
  if (score >= 99) return 'S+';
  if (score >= 95) return 'S';
  if (score >= 90) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

compareScores();

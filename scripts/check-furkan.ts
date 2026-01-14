import { prisma } from '../lib/prisma';

async function checkFurkan() {
  const profile = await prisma.profile.findFirst({
    where: { username: 'furkanyigitakyuz' }
  });

  if (!profile) {
    console.log('Profile not found');
    return;
  }

  console.log('========================================');
  console.log("FURKAN'S PROFILE DATA");
  console.log('========================================');
  console.log('Username:', profile.username);
  console.log('Score:', profile.score);
  console.log('Percentile:', profile.percentile);
  console.log('\n📊 Basic Metrics:');
  console.log('  - Total Repos:', profile.totalRepos);
  console.log('  - Total Stars:', profile.totalStars);
  console.log('  - Total Forks:', profile.totalForks);
  console.log('  - Total Commits:', profile.totalCommits);
  console.log('  - Total PRs:', profile.totalPRs);
  console.log('  - Merged PRs:', profile.mergedPRs);
  console.log('  - Total Reviews:', profile.totalReviews);
  console.log('  - Current Streak:', profile.currentStreak);
  console.log('  - Longest Streak:', profile.longestStreak);
  console.log('  - Followers:', profile.followersCount);
  console.log('  - Account Age:', profile.accountAge, 'years');
  console.log('  - Average Repo Size:', profile.averageRepoSize, 'KB');
  console.log('  - Gists:', profile.gistsCount);
  console.log('  - Avg Commits/Day:', profile.averageCommitsPerDay?.toFixed(2));

  await prisma.$disconnect();
}

checkFurkan();

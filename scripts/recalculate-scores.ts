/**
 * SCORE RECALCULATION SCRIPT
 * ==========================
 * Recalculates all user scores with new v3.0 scoring system
 *
 * Usage: npx tsx scripts/recalculate-scores.ts
 */

import { prisma } from '../lib/prisma';
import { calculateDeveloperScore } from '../lib/scoring/developer-score';

async function recalculateAllScores() {
  console.log('🔄 Starting score recalculation for all profiles...\n');

  try {
    // Fetch all profiles
    const profiles = await prisma.profile.findMany({
      where: {
        username: { not: '' },
      },
      orderBy: {
        scannedAt: 'desc',
      },
    });

    console.log(`📊 Found ${profiles.length} profiles to recalculate\n`);

    let updated = 0;
    let errors = 0;

    for (const profile of profiles) {
      try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔍 Processing: ${profile.username}`);
        console.log(`${'='.repeat(60)}`);

        // Parse PRO analysis if available
        const codeQualityCache = profile.codeQualityCache
          ? (typeof profile.codeQualityCache === 'string'
              ? JSON.parse(profile.codeQualityCache)
              : profile.codeQualityCache)
          : null;

        // Prepare scoring input
        const scoringInput = {
          readmeQuality: codeQualityCache?.readmeQuality || undefined,
          repoHealth: codeQualityCache?.repoHealth || undefined,
          devPatterns: codeQualityCache?.devPatterns || undefined,
          careerInsights: codeQualityCache?.careerInsights || undefined,
          basicMetrics: {
            totalCommits: profile.totalCommits || 0,
            totalRepos: profile.totalRepos || 0,
            totalStars: profile.totalStars || 0,
            totalForks: profile.totalForks || 0,
            totalWatchers: profile.totalWatchers || 0,
            currentStreak: profile.currentStreak || 0,
            longestStreak: profile.longestStreak || 0,
            followersCount: profile.followersCount || 0,
            followingCount: profile.followingCount || 0,
            organizationsCount: profile.organizationsCount || 0,
            totalPRs: profile.totalPRs || 0,
            mergedPRs: profile.mergedPRs || 0,
            openPRs: profile.openPRs || 0,
            totalIssuesOpened: profile.totalIssuesOpened || 0,
            totalOpenIssues: profile.totalOpenIssues || 0,
            totalReviews: profile.totalReviews || 0,
            totalContributions: profile.totalContributions || 0,
            averageCommitsPerDay: profile.averageCommitsPerDay || 0,
            averageRepoSize: profile.averageRepoSize || 0,
            gistsCount: profile.gistsCount || 0,
            accountAge: profile.accountAge || 0,
            weekendActivity: profile.weekendActivity || 0,
            mostActiveDay: profile.mostActiveDay || undefined,
          },
        };

        console.log(`\n📊 Old Score: ${profile.score.toFixed(2)}`);

        // Calculate new score
        const result = calculateDeveloperScore(scoringInput);

        console.log(`✅ New Score: ${result.overallScore} (${result.grade})`);
        console.log(`📈 Percentile: ${result.percentile}th`);
        console.log(`🎯 Experience: ${result.experienceLevel}`);
        console.log(`\n💪 Components:`);
        console.log(`   - Code Quality: ${result.components.codeQuality.score.toFixed(2)} (35%)`);
        console.log(`   - Impact: ${result.components.impact.score.toFixed(2)} (30%)`);
        console.log(`   - Consistency: ${result.components.consistency.score.toFixed(2)} (20%)`);
        console.log(`   - Collaboration: ${result.components.collaboration.score.toFixed(2)} (15%)`);

        // Update database
        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            score: result.overallScore,
            percentile: result.percentile,
          },
        });

        console.log(`\n💾 Updated in database`);
        updated++;

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        console.error(`\n❌ Error processing ${profile.username}:`, error.message);
        errors++;
      }
    }

    console.log(`\n\n${'='.repeat(60)}`);
    console.log(`✅ RECALCULATION COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📊 Total Profiles: ${profiles.length}`);
    console.log(`✅ Successfully Updated: ${updated}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`\n🎉 All scores have been recalculated with v3.0 system!\n`);

  } catch (error: any) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
recalculateAllScores();

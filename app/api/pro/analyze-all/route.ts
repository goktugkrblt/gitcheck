import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Octokit } from "@octokit/rest";
import { CacheService, CacheKeys } from "@/lib/cache";
import { analyzeAllPro } from "@/lib/pro/analyze-all";
import { calculateDeveloperScore } from "@/lib/scoring/developer-score"; // ✅ YENİ

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profiles: {
          orderBy: { scannedAt: 'desc' },
          take: 1,
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.githubToken || !user.githubUsername) {
      return NextResponse.json({ error: "GitHub account not connected" }, { status: 404 });
    }

    // ✅ FIX: Get username from query params, fallback to authenticated user
    const { searchParams } = new URL(request.url);
    const requestedUsername = searchParams.get('username');
    const username = requestedUsername || user.githubUsername;

    console.log(`🎯 Analyzing profile: ${username} ${requestedUsername ? '(requested)' : '(own profile)'}`);

    const cacheKey = CacheKeys.proAnalysis(username);

    // 🔥 CHECK CACHE
    const cached = CacheService.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache HIT for PRO analysis: ${username}`);

      // ✅ FIX: Get the profile for the requested username, not just authenticated user
      const targetUser = requestedUsername
        ? await prisma.user.findUnique({
            where: { githubUsername: requestedUsername },
            include: { profiles: { orderBy: { scannedAt: 'desc' }, take: 1 } }
          })
        : user;

      const profile = targetUser?.profiles[0];
      
      if (profile && profile.score === 0) {
        console.log(`🎯 Cache HIT but no score, calculating...`);
        
        const scoreResult = calculateDeveloperScore({
          readmeQuality: cached.readmeQuality,
          repoHealth: cached.repoHealth,
          devPatterns: cached.devPatterns,
          careerInsights: cached.careerInsights,
          basicMetrics: {
            totalCommits: profile.totalCommits || 0,
            totalRepos: profile.totalRepos || 0,
            totalStars: profile.totalStars || 0,
            totalForks: profile.totalForks || 0,
            totalPRs: profile.totalPRs || 0,
            mergedPRs: profile.mergedPRs || 0,
            openPRs: profile.openPRs || 0,
            totalIssuesOpened: profile.totalIssuesOpened || 0,
            totalReviews: profile.totalReviews || 0,
            currentStreak: profile.currentStreak || 0,
            longestStreak: profile.longestStreak || 0,
            averageCommitsPerDay: profile.averageCommitsPerDay || 0,
            weekendActivity: profile.weekendActivity || 0,
            followersCount: profile.followersCount || 0,
            followingCount: profile.followingCount || 0,
            organizationsCount: profile.organizationsCount || 0,
            gistsCount: profile.gistsCount || 0,
            accountAge: profile.accountAge || 0,
            totalContributions: profile.totalContributions || 0,
            mostActiveDay: profile.mostActiveDay || undefined,
            averageRepoSize: profile.averageRepoSize || 0,
            totalWatchers: profile.totalWatchers || 0,
            totalOpenIssues: profile.totalOpenIssues || 0,
          },
        });

        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            score: scoreResult.overallScore,
            percentile: scoreResult.percentile,
          },
        });

        console.log(`✅ Score saved from cache: ${scoreResult.overallScore.toFixed(2)}`);
      }
      
      return NextResponse.json({
        success: true,
        data: cached,
      });
    }

    // Cache miss - analyze everything
    console.log(`🔍 Cache MISS, running full PRO analysis for: ${username}`);

    // ✅ FIX: Use authenticated user's token for API rate limits
    // Public data is accessible even when analyzing other users
    const octokit = new Octokit({
      auth: user.githubToken,
    });

    const analysis = await analyzeAllPro(octokit, username);

    // ✅ CACHE ALL RESULTS (Redis)
    CacheService.set(cacheKey, analysis);
    console.log(`💾 Full PRO analysis cached for: ${username}`);

    // ✅ SAVE TO DATABASE
    try {
      console.log(`💾 Saving PRO analysis to database for: ${username}`);
      
      await prisma.profile.updateMany({
        where: { 
          user: {
            githubUsername: username
          }
        },
        data: {
          codeQualityCache: JSON.stringify(analysis),
          repoHealthCache: JSON.stringify(analysis),
          testCoverageCache: JSON.stringify(analysis),
          cicdAnalysisCache: JSON.stringify(analysis),
          lastCodeQualityScan: new Date(),
          lastRepoHealthScan: new Date(),
          lastTestCoverageScan: new Date(),
          lastCicdAnalysisScan: new Date(),
        },
      });

      console.log(`✅ PRO analysis saved to database for: ${username}`);
    } catch (dbError) {
      console.error('❌ Failed to save to database:', dbError);
    }

    // ✅ FIX: Get the profile for the requested username
    const targetUser = requestedUsername
      ? await prisma.user.findUnique({
          where: { githubUsername: requestedUsername },
          include: { profiles: { orderBy: { scannedAt: 'desc' }, take: 1 } }
        })
      : user;

    const profile = targetUser?.profiles[0];

    if (profile) {
      console.log(`🎯 Calculating SINGLE SCORE for: ${username}`);
      
      const scoreResult = calculateDeveloperScore({
        readmeQuality: analysis.readmeQuality,
        repoHealth: analysis.repoHealth,
        devPatterns: analysis.devPatterns,
        careerInsights: analysis.careerInsights,
        basicMetrics: {
          totalCommits: profile.totalCommits || 0,
          totalRepos: profile.totalRepos || 0,
          totalStars: profile.totalStars || 0,
          totalForks: profile.totalForks || 0,
          totalPRs: profile.totalPRs || 0,
          mergedPRs: profile.mergedPRs || 0,
          openPRs: profile.openPRs || 0,
          totalIssuesOpened: profile.totalIssuesOpened || 0,
          totalReviews: profile.totalReviews || 0,
          currentStreak: profile.currentStreak || 0,
          longestStreak: profile.longestStreak || 0,
          averageCommitsPerDay: profile.averageCommitsPerDay || 0,
          weekendActivity: profile.weekendActivity || 0,
          followersCount: profile.followersCount || 0,
          followingCount: profile.followingCount || 0,
          organizationsCount: profile.organizationsCount || 0,
          gistsCount: profile.gistsCount || 0,
          accountAge: profile.accountAge || 0,
          totalContributions: profile.totalContributions || 0,
          mostActiveDay: profile.mostActiveDay || undefined,
          averageRepoSize: profile.averageRepoSize || 0,
          totalWatchers: profile.totalWatchers || 0,
          totalOpenIssues: profile.totalOpenIssues || 0,
        },
      });

      console.log(`✅ SINGLE SCORE calculated: ${scoreResult.overallScore.toFixed(2)}`);

      // ✅ DB'ye kaydet
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          score: scoreResult.overallScore,
          percentile: scoreResult.percentile,
        },
      });

      console.log(`💾 Score saved to database: ${scoreResult.overallScore.toFixed(2)}`);
    }

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("PRO analysis error:", error);
    return NextResponse.json({ 
      error: "Failed to complete PRO analysis",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
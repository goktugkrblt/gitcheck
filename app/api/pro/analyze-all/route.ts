import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Octokit } from "@octokit/rest";
import { CacheService, CacheKeys } from "@/lib/cache";
import { analyzeAllPro } from "@/lib/pro/analyze-all";
import { calculateDeveloperScore } from "@/lib/scoring/developer-score"; // ✅ YENİ

export async function GET(request: Request) {
  try {
    // ✅ Get username from query params
    const { searchParams } = new URL(request.url);
    const requestedUsername = searchParams.get('username');

    // ✅ Try to get session (optional for public profiles)
    const session = await auth();

    let user = null;
    if (session?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          profiles: {
            orderBy: { scannedAt: 'desc' },
            take: 1,
          }
        }
      });
    }

    // ✅ Determine username: from query param or authenticated user
    const username = requestedUsername || user?.githubUsername;

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    console.log(`🎯 Analyzing profile: ${username} ${requestedUsername ? '(requested)' : '(own profile)'}`);

    // ✅ Check if force refresh is requested (for re-analyze)
    const forceRefresh = searchParams.get('force') === 'true';

    // ✅ First check database cache
    const cachedProfile = await prisma.profile.findUnique({
      where: { username },
      include: { user: true }
    });

    // ✅ PRO users have permanent cache (until re-analyze)
    // ✅ FREE users have no persistent cache (always fresh)
    const isPROUser = cachedProfile?.user?.plan === 'PRO';

    if ((cachedProfile as any)?.proAnalysisCache && (cachedProfile as any)?.lastProAnalysisScan && !forceRefresh) {
      if (isPROUser) {
        // PRO user: cache never expires (until re-analyze with force=true)
        console.log(`✅ PRO user cache HIT: ${username} - using permanent cache`);
        return NextResponse.json({
          success: true,
          data: (cachedProfile as any).proAnalysisCache,
          cached: true,
          permanent: true,
        });
      } else {
        // FREE user: check 24 hour expiry
        const cacheAge = Date.now() - new Date((cachedProfile as any).lastProAnalysisScan).getTime();
        const cacheValidHours = 24;

        if (cacheAge < cacheValidHours * 60 * 60 * 1000) {
          console.log(`✅ FREE user cache HIT: ${username} (age: ${Math.floor(cacheAge / 1000 / 60)} minutes)`);
          return NextResponse.json({
            success: true,
            data: (cachedProfile as any).proAnalysisCache,
            cached: true,
            cacheAge: Math.floor(cacheAge / 1000 / 60),
          });
        }
      }
    }

    console.log(`🔄 No valid cache found, running fresh analysis...`);

    const cacheKey = CacheKeys.proAnalysis(username);

    // 🔥 CHECK IN-MEMORY CACHE (secondary cache)
    const cached = CacheService.get(cacheKey);
    if (cached && !forceRefresh) {
      console.log(`✅ Memory cache HIT for PRO analysis: ${username}`);

      // ✅ FIX: Get the profile for the requested username, not just authenticated user
      const targetUser = requestedUsername
        ? await prisma.user.findUnique({
            where: { githubUsername: requestedUsername },
            include: { profiles: { orderBy: { scannedAt: 'desc' }, take: 1 } }
          })
        : user;

      const userProfile = targetUser?.profiles[0];

      if (userProfile && userProfile.score === 0) {
        console.log(`🎯 Cache HIT but no score, calculating...`);

        const scoreResult = calculateDeveloperScore({
          readmeQuality: cached.readmeQuality,
          repoHealth: cached.repoHealth,
          devPatterns: cached.devPatterns,
          careerInsights: cached.careerInsights,
          basicMetrics: {
            totalCommits: userProfile.totalCommits || 0,
            totalRepos: userProfile.totalRepos || 0,
            totalStars: userProfile.totalStars || 0,
            totalForks: userProfile.totalForks || 0,
            totalPRs: userProfile.totalPRs || 0,
            mergedPRs: userProfile.mergedPRs || 0,
            openPRs: userProfile.openPRs || 0,
            totalIssuesOpened: userProfile.totalIssuesOpened || 0,
            totalReviews: userProfile.totalReviews || 0,
            currentStreak: userProfile.currentStreak || 0,
            longestStreak: userProfile.longestStreak || 0,
            averageCommitsPerDay: userProfile.averageCommitsPerDay || 0,
            weekendActivity: userProfile.weekendActivity || 0,
            followersCount: userProfile.followersCount || 0,
            followingCount: userProfile.followingCount || 0,
            organizationsCount: userProfile.organizationsCount || 0,
            gistsCount: userProfile.gistsCount || 0,
            accountAge: userProfile.accountAge || 0,
            totalContributions: userProfile.totalContributions || 0,
            mostActiveDay: userProfile.mostActiveDay || undefined,
            averageRepoSize: userProfile.averageRepoSize || 0,
            totalWatchers: userProfile.totalWatchers || 0,
            totalOpenIssues: userProfile.totalOpenIssues || 0,
          },
        });

        await prisma.profile.update({
          where: { id: userProfile.id },
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
        cached: true,
      });
    }

    // Cache miss - analyze everything
    console.log(`🔍 Cache MISS, running full PRO analysis for: ${username}`);

    // ✅ FIX: Use authenticated user's token for API rate limits (if available)
    // Public data is accessible even when analyzing other users
    const octokit = new Octokit({
      auth: user?.githubToken || process.env.GITHUB_TOKEN,
    });

    const analysis = await analyzeAllPro(octokit, username);

    // ✅ CACHE ALL RESULTS (in-memory cache as secondary)
    CacheService.set(cacheKey, analysis);
    console.log(`💾 Full PRO analysis cached in memory for: ${username}`);

    // ✅ SAVE TO DATABASE (primary cache)
    try {
      console.log(`💾 Saving PRO analysis to database for: ${username}`);

      await prisma.profile.updateMany({
        where: {
          user: {
            githubUsername: username
          }
        },
        data: {
          proAnalysisCache: analysis as any, // Store full analysis JSON
          lastProAnalysisScan: new Date(),
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

    const userProfile = targetUser?.profiles[0];

    if (userProfile) {
      console.log(`🎯 Calculating SINGLE SCORE for: ${username}`);

      const scoreResult = calculateDeveloperScore({
        readmeQuality: analysis.readmeQuality,
        repoHealth: analysis.repoHealth,
        devPatterns: analysis.devPatterns,
        careerInsights: analysis.careerInsights,
        basicMetrics: {
          totalCommits: userProfile.totalCommits || 0,
          totalRepos: userProfile.totalRepos || 0,
          totalStars: userProfile.totalStars || 0,
          totalForks: userProfile.totalForks || 0,
          totalPRs: userProfile.totalPRs || 0,
          mergedPRs: userProfile.mergedPRs || 0,
          openPRs: userProfile.openPRs || 0,
          totalIssuesOpened: userProfile.totalIssuesOpened || 0,
          totalReviews: userProfile.totalReviews || 0,
          currentStreak: userProfile.currentStreak || 0,
          longestStreak: userProfile.longestStreak || 0,
          averageCommitsPerDay: userProfile.averageCommitsPerDay || 0,
          weekendActivity: userProfile.weekendActivity || 0,
          followersCount: userProfile.followersCount || 0,
          followingCount: userProfile.followingCount || 0,
          organizationsCount: userProfile.organizationsCount || 0,
          gistsCount: userProfile.gistsCount || 0,
          accountAge: userProfile.accountAge || 0,
          totalContributions: userProfile.totalContributions || 0,
          mostActiveDay: userProfile.mostActiveDay || undefined,
          averageRepoSize: userProfile.averageRepoSize || 0,
          totalWatchers: userProfile.totalWatchers || 0,
          totalOpenIssues: userProfile.totalOpenIssues || 0,
        },
      });

      console.log(`✅ SINGLE SCORE calculated: ${scoreResult.overallScore.toFixed(2)}`);

      // ✅ Save score to database
      await prisma.profile.update({
        where: { id: userProfile.id },
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
      cached: false,
    });
  } catch (error) {
    console.error("PRO analysis error:", error);
    return NextResponse.json({ 
      error: "Failed to complete PRO analysis",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { GitHubService } from "@/lib/github";
import { GitHubGraphQLService } from "@/lib/github-graphql"; // ✅ NEW
import { calculateDeveloperScore } from "@/lib/scoring/developer-score";
import { calculateAverageQuality } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const skipPro = url.searchParams.get('skipPro') === 'true';
    
    if (skipPro) {
      console.log('⚡ Fast mode: Skipping PRO analysis (will run in background)');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        scans: true,
        profiles: {
          orderBy: { scannedAt: 'desc' },
          take: 1,
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.githubToken) {
      return NextResponse.json(
        { error: "GitHub token not found" },
        { status: 400 }
      );
    }

    const github = new GitHubService(user.githubToken);
    const githubGraphQL = new GitHubGraphQLService(user.githubToken); // ✅ NEW

    console.log('🚀 Starting GitHub analysis...');
    
    const rateLimit = await github.getRateLimitInfo();
    console.log(`⚡ Rate Limit: ${rateLimit.remaining}/${rateLimit.limit}`);
    
    if (rateLimit.remaining < 100) {
      return NextResponse.json(
        { error: `Rate limit too low. Remaining: ${rateLimit.remaining}. Resets at ${rateLimit.reset.toLocaleTimeString()}` },
        { status: 429 }
      );
    }

    const previousProfile = user.profiles[0];
    
    console.log('📊 Fetching core GitHub data...');
    
    // ✅ OPTIMIZED: Use GraphQL for repos, languages, and frameworks (300 → 1 request)
    const { repos, languages, frameworks } = await githubGraphQL.getRepositoriesWithDetails(
      user.githubUsername,
      100
    );
    
    console.log(`🚀 GraphQL Optimization: Fetched ${repos.length} repos + languages + frameworks in 1 request!`);
    console.log(`💰 Saved ~${repos.length * 2} API requests!`);
    
    // ✅ REST API for other data (still needed)
    const userData = await github.getUserData(user.githubUsername);
    const contributions = await github.getContributions(user.githubUsername);
    const pullRequests = await github.getPullRequestMetrics(user.githubUsername);
    const activity = await github.getActivityMetrics(contributions);
    const gistsCount = await github.getGistsCount(user.githubUsername);
    const totalStars = await github.getTotalStars(repos);
    const totalForks = await github.getTotalForks(repos);
    
    // ✅ Get organizations (cached)
    const organizations = await github.getOrganizationsCached(
      user.githubUsername,
      previousProfile?.organizationsCount || 0,
      previousProfile?.lastOrgScan
    );
    
    const organizationsCount = organizations.length > 0 ? organizations.length : previousProfile?.organizationsCount || 0;
    
    const accountAge = Math.floor(
      (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
    );

    const avgRepoQuality = calculateAverageQuality(repos);

    console.log('⚠️ No score calculation - waiting for PRO analysis');

    const topReposData = repos
      .filter(r => !r.fork)
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 5)
      .map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language,
        description: repo.description,
        url: repo.html_url,
        qualityScore: 0,      
        license: repo.license ? (repo.license as any).key : null,
        updatedAt: repo.updated_at,
        isFork: repo.fork,
      }));

    const contributionsData = contributions.contributionCalendar.weeks
      .flatMap(w => w.contributionDays)
      .map(d => ({
        date: d.date,
        count: d.contributionCount,
      }));

    const newTotalWatchers = repos.reduce((sum, repo: any) => sum + (repo.watchers_count || repo.watchers || 0), 0);
    const newTotalOpenIssues = repos.reduce((sum, repo: any) => sum + (repo.open_issues_count || repo.open_issues || 0), 0);
    const newAverageRepoSize = repos.length > 0 
      ? Math.round(repos.reduce((sum, repo: any) => sum + (repo.size || 0), 0) / repos.length) 
      : 0;
    const newTotalContributions = contributions?.contributionCalendar?.totalContributions || 0;

    const now = new Date();

    const profile = await prisma.profile.upsert({
      where: { 
        userId: user.id 
      },
      update: {
        score: 0,
        percentile: 0,
        totalCommits: contributions.totalCommits,
        totalRepos: repos.length,
        totalStars,
        totalForks,
        
        username: user.githubUsername,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        blog: userData.blog || null,
        hireable: userData.hireable || false,
        
        totalPRs: pullRequests.totalPRs,
        mergedPRs: pullRequests.mergedPRs,
        openPRs: pullRequests.openPRs,
        
        currentStreak: activity.currentStreak,
        longestStreak: activity.longestStreak,
        averageCommitsPerDay: activity.averageCommitsPerDay,
        mostActiveDay: activity.mostActiveDay,
        weekendActivity: activity.weekendActivity,
        
        followersCount: userData.followers,
        followingCount: userData.following,
        organizationsCount,
        gistsCount,
        
        accountAge,
        accountCreatedAt: new Date(userData.created_at),
                
        totalIssuesOpened: contributions.totalIssues || 0, 
        totalReviews: contributions.totalReviews || 0,     
        totalContributions: newTotalContributions,
        totalWatchers: newTotalWatchers,
        totalOpenIssues: newTotalOpenIssues,
        averageRepoSize: newAverageRepoSize,
        
        languages,
        frameworks,
        topRepos: topReposData,
        contributions: contributionsData,
        
        cachedRepoCount: repos.length,
        lastLanguageScan: now,
        lastFrameworkScan: now,
        lastOrgScan: organizations.length > 0 ? now : previousProfile?.lastOrgScan,
        
        scannedAt: now,
      },
      create: {
        userId: user.id,
        
        score: 0,
        percentile: 0,
        totalCommits: contributions.totalCommits,
        totalRepos: repos.length,
        totalStars,
        totalForks,
        
        username: user.githubUsername,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        blog: userData.blog || null,
        hireable: userData.hireable || false,
        
        totalPRs: pullRequests.totalPRs,
        mergedPRs: pullRequests.mergedPRs,
        openPRs: pullRequests.openPRs,
        
        currentStreak: activity.currentStreak,
        longestStreak: activity.longestStreak,
        averageCommitsPerDay: activity.averageCommitsPerDay,
        mostActiveDay: activity.mostActiveDay,
        weekendActivity: activity.weekendActivity,
        
        followersCount: userData.followers,
        followingCount: userData.following,
        organizationsCount,
        gistsCount,
        
        accountAge,
        accountCreatedAt: new Date(userData.created_at),
                
        totalIssuesOpened: contributions.totalIssues || 0,     
        totalReviews: contributions.totalReviews || 0,         
        totalContributions: newTotalContributions,
        totalWatchers: newTotalWatchers,
        totalOpenIssues: newTotalOpenIssues,
        averageRepoSize: newAverageRepoSize,
        
        languages,
        frameworks,
        topRepos: topReposData,
        contributions: contributionsData,
        
        cachedRepoCount: repos.length,
        lastLanguageScan: now,
        lastFrameworkScan: now,
        lastOrgScan: now,
      },
    });

    await prisma.scan.create({
      data: {
        userId: user.id,
      },
    });

    if (skipPro) {
      console.log('✅ Public data saved. PRO analysis will run in background.');
      
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          codeQualityCache: Prisma.JsonNull,
          repoHealthCache: Prisma.JsonNull,
          testCoverageCache: Prisma.JsonNull,
          cicdAnalysisCache: Prisma.JsonNull,
          lastCodeQualityScan: null,
          lastRepoHealthScan: null,
          lastTestCoverageScan: null,
          lastCicdAnalysisScan: null,
        },
      });
      
      const finalRateLimit = await github.getRateLimitInfo();
      
      return NextResponse.json({
        success: true,
        profile,
        skipPro: true,
        rateLimit: {
          remaining: finalRateLimit.remaining,
          limit: finalRateLimit.limit,
          reset: finalRateLimit.reset,
        },
      });
    }

    console.log('🗑️  Clearing old PRO cache for fresh analysis...');
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        codeQualityCache: Prisma.JsonNull,
        repoHealthCache: Prisma.JsonNull,
        testCoverageCache: Prisma.JsonNull,
        cicdAnalysisCache: Prisma.JsonNull,
        lastCodeQualityScan: null,
        lastRepoHealthScan: null,
        lastTestCoverageScan: null,
        lastCicdAnalysisScan: null,
      },
    });

    console.log('🎯 Running PRO analysis for precision scoring...');
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    try {
      const proResponse = await fetch(`${baseUrl}/api/pro/analyze-all`, {
        method: 'GET',
        headers: {
          'Cookie': req.headers.get('cookie') || '',
        },
      });
      
      if (proResponse.ok) {
        console.log('✅ PRO analysis completed');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedProfile = await prisma.profile.findUnique({
          where: { userId: user.id },
        });
        
        if (updatedProfile?.codeQualityCache) {
          const analysisData = typeof updatedProfile.codeQualityCache === 'string' 
            ? JSON.parse(updatedProfile.codeQualityCache) 
            : updatedProfile.codeQualityCache;
          
          const finalScoring = calculateDeveloperScore({
            readmeQuality: analysisData.readmeQuality,
            repoHealth: analysisData.repoHealth,
            devPatterns: analysisData.devPatterns,
            careerInsights: analysisData.careerInsights,
            basicMetrics: {
              totalCommits: contributions.totalCommits,
              totalRepos: repos.length,
              totalStars,
              totalForks,
              totalPRs: pullRequests.totalPRs,
              mergedPRs: pullRequests.mergedPRs,
              openPRs: pullRequests.openPRs,
              totalIssuesOpened: contributions.totalIssues,
              totalReviews: contributions.totalReviews,
              currentStreak: activity.currentStreak,
              longestStreak: activity.longestStreak,
              averageCommitsPerDay: activity.averageCommitsPerDay,
              weekendActivity: activity.weekendActivity,
              followersCount: userData.followers,
              followingCount: userData.following,
              organizationsCount,
              gistsCount,
              accountAge,
              totalContributions: contributions.contributionCalendar.totalContributions,
              mostActiveDay: activity.mostActiveDay,
              averageRepoSize: repos.length > 0 
                ? Math.round(repos.reduce((sum, repo: any) => sum + (repo.size || 0), 0) / repos.length) 
                : 0,
            },
          });
          
          await prisma.profile.update({
            where: { userId: user.id },
            data: {
              score: finalScoring.overallScore,
              percentile: finalScoring.percentile,
            },
          });
          
          console.log(`🎯 Final Precision Score: ${finalScoring.overallScore.toFixed(2)} (${finalScoring.percentile}th percentile)`);
        }
      }
    } catch (err: any) {
      console.log('⚠️ PRO analysis failed (non-critical):', err.message);
    }

    const finalRateLimit = await github.getRateLimitInfo();
    console.log(`✅ Analysis completed! Rate Limit: ${finalRateLimit.remaining}/${finalRateLimit.limit}`);

    return NextResponse.json({
      success: true,
      profile,
      rateLimit: {
        remaining: finalRateLimit.remaining,
        limit: finalRateLimit.limit,
        reset: finalRateLimit.reset,
      },
    });

  } catch (error) {
    console.error('❌ GitHub analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze GitHub profile' },
      { status: 500 }
    );
  }
}
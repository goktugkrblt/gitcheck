import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/github";
import { calculateDeveloperScore } from "@/lib/scoring/developer-score";
import { checkRateLimit, getClientIp, verifyHoneypot, verifyRequestTiming } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, _honeypot, _timestamp } = body;

    // 1. BOT PROTECTION: Honeypot check
    if (!verifyHoneypot(_honeypot)) {
      console.log('🤖 Bot detected: honeypot field filled');
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // 2. BOT PROTECTION: Request timing check (minimum 1 second after page load)
    if (!verifyRequestTiming(_timestamp, 1000)) {
      console.log('🤖 Bot detected: request too fast');
      return NextResponse.json(
        { error: "Please wait a moment before submitting" },
        { status: 429 }
      );
    }

    // 3. RATE LIMITING: IP-based rate limit (5 requests per 15 minutes)
    // Skip rate limiting for localhost (for populate script)
    const clientIp = getClientIp(req);
    const isLocalhost = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === 'unknown';

    if (!isLocalhost) {
      const rateLimitResult = checkRateLimit(clientIp, {
        maxRequests: 5,
        windowSeconds: 15 * 60, // 15 minutes
        minRequestInterval: 2000, // 2 seconds minimum between requests
      });

      if (!rateLimitResult.success) {
        console.log(`🚫 Rate limit exceeded for IP: ${clientIp}`);
        return NextResponse.json(
          {
            error: rateLimitResult.reason || "Too many requests. Please try again later.",
            retryAfter: rateLimitResult.retryAfter,
            resetAt: rateLimitResult.reset.toISOString(),
            minutesUntilReset: Math.ceil((rateLimitResult.retryAfter || 0) / 60),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': rateLimitResult.limit.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
              'Retry-After': (rateLimitResult.retryAfter || 0).toString(),
            }
          }
        );
      }
    } else {
      console.log('✅ Localhost request - skipping rate limit');
    }

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
      return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
    }

    // Get server-side GitHub token
    const githubToken = process.env.GITHUB_PERSONAL_TOKEN;
    if (!githubToken) {
      console.error("❌ GITHUB_PERSONAL_TOKEN not configured");
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

    const github = new GitHubService(githubToken);

    console.log(`🚀 Starting analysis for username: ${username}`);

    const rateLimit = await github.getRateLimitInfo();
    console.log(`⚡ Rate Limit: ${rateLimit.remaining}/${rateLimit.limit}`);

    if (rateLimit.remaining < 100) {
      const resetTime = rateLimit.reset.toISOString();
      const minutesUntilReset = Math.ceil((rateLimit.reset.getTime() - Date.now()) / 60000);

      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please try again in ${minutesUntilReset} minutes.`,
          resetAt: resetTime,
          minutesUntilReset
        },
        { status: 429 }
      );
    }

    // Check if profile exists in DB
    const existingProfile = await prisma.profile.findFirst({
      where: { username },
      orderBy: { scannedAt: 'desc' },
    });

    // Check if profile was analyzed within last 24 hours (daily cache)
    if (existingProfile) {
      const now = new Date();
      const lastScan = new Date(existingProfile.scannedAt);
      const hoursSinceLastScan = (now.getTime() - lastScan.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastScan < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastScan);
        console.log(`⚡ Returning cached profile (scanned ${hoursSinceLastScan.toFixed(1)}h ago, ${hoursRemaining}h until next scan)`);

        // Return cached data
        return NextResponse.json({
          success: true,
          profile: existingProfile,
          username,
          cached: true,
          nextScanAvailable: new Date(lastScan.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          hoursRemaining,
          rateLimit: {
            remaining: rateLimit.remaining,
            limit: rateLimit.limit,
            reset: rateLimit.reset,
          },
        });
      }
    }

    console.log('📊 Fetching core GitHub data...');
    const userData = await github.getUserData(username);

    // Use GraphQL to fetch repos + languages + frameworks in ONE request
    const { repos, languageStats: languages, frameworks } = await github.getRepositoriesWithDetailedData(
      username,
      100
    );

    const contributions = await github.getContributions(username);
    const pullRequests = await github.getPullRequestMetrics(username);
    const activity = await github.getActivityMetrics(contributions);
    const gistsCount = await github.getGistsCount(username);
    const totalStars = await github.getTotalStars(repos);
    const totalForks = await github.getTotalForks(repos);

    const organizations = await github.getOrganizationsCached(
      username,
      existingProfile?.organizationsCount || 0,
      existingProfile?.lastOrgScan || null
    );

    const organizationsCount = organizations.length > 0 ? organizations.length : existingProfile?.organizationsCount || 0;

    const accountAge = Math.floor(
      (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
    );

    // Calculate score from basic metrics
    console.log('🎯 Calculating developer score...');
    const scoreResult = calculateDeveloperScore({
      basicMetrics: {
        totalCommits: contributions.totalCommits,
        totalRepos: repos.length,
        totalStars,
        totalForks,
        totalPRs: pullRequests.totalPRs,
        mergedPRs: pullRequests.mergedPRs,
        openPRs: pullRequests.openPRs,
        totalIssuesOpened: contributions.totalIssues || 0,
        totalReviews: contributions.totalReviews || 0,
        currentStreak: activity.currentStreak,
        longestStreak: activity.longestStreak,
        averageCommitsPerDay: activity.averageCommitsPerDay,
        weekendActivity: activity.weekendActivity,
        followersCount: userData.followers,
        followingCount: userData.following,
        organizationsCount,
        gistsCount,
        accountAge,
        totalContributions: contributions?.contributionCalendar?.totalContributions || 0,
        mostActiveDay: activity.mostActiveDay,
        averageRepoSize: repos.length > 0
          ? Math.round(repos.reduce((sum, repo: any) => sum + (repo.size || 0), 0) / repos.length)
          : 0,
        totalWatchers: repos.reduce((sum, repo: any) => sum + (repo.watchers_count || repo.watchers || 0), 0),
        totalOpenIssues: repos.reduce((sum, repo: any) => sum + (repo.open_issues_count || repo.open_issues || 0), 0),
      }
    });

    console.log(`✅ Score calculated: ${scoreResult.overallScore.toFixed(2)} (${scoreResult.grade})`);

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

    // Upsert profile without userId
    const profile = await prisma.profile.upsert({
      where: {
        username
      },
      update: {
        score: scoreResult.overallScore,
        percentile: scoreResult.percentile,
        totalCommits: contributions.totalCommits,
        totalRepos: repos.length,
        totalStars,
        totalForks,

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
        lastOrgScan: organizations.length > 0 ? now : existingProfile?.lastOrgScan,

        scannedAt: now,
      },
      create: {
        score: scoreResult.overallScore,
        percentile: scoreResult.percentile,
        totalCommits: contributions.totalCommits,
        totalRepos: repos.length,
        totalStars,
        totalForks,

        username,
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

    const finalRateLimit = await github.getRateLimitInfo();
    console.log(`✅ Analysis completed! Rate Limit: ${finalRateLimit.remaining}/${finalRateLimit.limit}`);

    return NextResponse.json({
      success: true,
      profile,
      username,
      rateLimit: {
        remaining: finalRateLimit.remaining,
        limit: finalRateLimit.limit,
        reset: finalRateLimit.reset,
      },
    });

  } catch (error: any) {
    console.error('❌ GitHub analysis error:', error);

    // Handle GitHub user not found
    if (error?.status === 404) {
      return NextResponse.json(
        { error: 'GitHub user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze GitHub profile' },
      { status: 500 }
    );
  }
}

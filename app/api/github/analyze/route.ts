import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/github";
import {
  calculateEnhancedScore,
  calculateAverageQuality,
  calculatePercentile,
} from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { scans: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has GitHub token
    if (!user.githubToken) {
      return NextResponse.json(
        { error: "GitHub token not found" },
        { status: 400 }
      );
    }

    // Initialize GitHub service
    const github = new GitHubService(user.githubToken);

    // Fetch ALL GitHub data
    console.log('Fetching comprehensive GitHub data...');
    
    // Basic user data
    const userData = await github.getUserData(user.githubUsername);
    
    // Repositories
    const repos = await github.getRepositories(user.githubUsername);
    
    // Contributions (GraphQL)
    const contributions = await github.getContributions(user.githubUsername);
    
    // Pull Requests
    const pullRequests = await github.getPullRequestMetrics(user.githubUsername);
    
    // Activity Metrics
    const activity = await github.getActivityMetrics(contributions);
    
    // Organizations
    const organizations = await github.getOrganizations(user.githubUsername);
    
    // Gists
    const gistsCount = await github.getGistsCount(user.githubUsername);
    
    // Language stats
    const languages = await github.getLanguageStats(repos);
    
    // Stars and forks
    const totalStars = await github.getTotalStars(repos);
    const totalForks = await github.getTotalForks(repos);
    
    // Calculate account age
    const accountAge = Math.floor(
      (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
    );

    // Enhanced scoring metrics
    const avgRepoQuality = calculateAverageQuality(repos);
    
    const enhancedMetrics = {
      // Basic metrics
      totalCommits: contributions.totalCommits,
      totalRepos: repos.length,
      totalStars,
      totalForks,
      avgRepoQuality,
      languageCount: Object.keys(languages).length,
      
      // New metrics for enhanced scoring
      totalPRs: pullRequests.totalPRs,
      mergedPRs: pullRequests.mergedPRs,
      totalIssues: contributions.totalIssues,
      totalReviews: contributions.totalReviews,
      currentStreak: activity.currentStreak,
      longestStreak: activity.longestStreak,
      organizationsCount: organizations.length,
      gistsCount,
      followersCount: userData.followers,
      accountAge,
    };

    // Calculate enhanced score
    const score = calculateEnhancedScore(enhancedMetrics);

    // Get percentile
    const allProfiles = await prisma.profile.findMany({
      select: { score: true },
    });
    const percentile = calculatePercentile(
      score,
      allProfiles.map(p => p.score)
    );

    // Get top repos with detailed metrics
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
      }));

    // Prepare contributions data
    const contributionsData = contributions.contributionCalendar.weeks
      .flatMap(w => w.contributionDays)
      .map(d => ({
        date: d.date,
        count: d.contributionCount,
      }));

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { 
        userId: user.id 
      },
      update: {
        // Core metrics
        score,
        percentile,
        totalCommits: contributions.totalCommits,
        totalRepos: repos.length,
        totalStars,
        totalForks,
        
        // Basic info
        username: user.githubUsername,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        blog: userData.blog || null,
        hireable: userData.hireable || false,
        
        // PR metrics
        totalPRs: pullRequests.totalPRs,
        mergedPRs: pullRequests.mergedPRs,
        openPRs: pullRequests.openPRs,
        
        // Activity metrics
        currentStreak: activity.currentStreak,
        longestStreak: activity.longestStreak,
        averageCommitsPerDay: activity.averageCommitsPerDay,
        mostActiveDay: activity.mostActiveDay,
        weekendActivity: activity.weekendActivity,
        
        // Community metrics
        followersCount: userData.followers,
        followingCount: userData.following,
        organizationsCount: organizations.length,
        gistsCount,
        
        // Account info
        accountAge,
        accountCreatedAt: new Date(userData.created_at),
        
        // JSON fields
        languages,
        topRepos: topReposData,
        contributions: contributionsData,
        
        // Update timestamp
        scannedAt: new Date(),
      },
      create: {
        userId: user.id,
        
        // Core metrics
        score,
        percentile,
        totalCommits: contributions.totalCommits,
        totalRepos: repos.length,
        totalStars,
        totalForks,
        
        // Basic info
        username: user.githubUsername,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        blog: userData.blog || null,
        hireable: userData.hireable || false,
        
        // PR metrics
        totalPRs: pullRequests.totalPRs,
        mergedPRs: pullRequests.mergedPRs,
        openPRs: pullRequests.openPRs,
        
        // Activity metrics
        currentStreak: activity.currentStreak,
        longestStreak: activity.longestStreak,
        averageCommitsPerDay: activity.averageCommitsPerDay,
        mostActiveDay: activity.mostActiveDay,
        weekendActivity: activity.weekendActivity,
        
        // Community metrics
        followersCount: userData.followers,
        followingCount: userData.following,
        organizationsCount: organizations.length,
        gistsCount,
        
        // Account info
        accountAge,
        accountCreatedAt: new Date(userData.created_at),
        
        // JSON fields
        languages,
        topRepos: topReposData,
        contributions: contributionsData,
      },
    });

    // Record scan
    await prisma.scan.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('GitHub analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze GitHub profile' },
      { status: 500 }
    );
  }
}
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { scans: true },
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

    console.log('Fetching comprehensive GitHub data...');
    
    const userData = await github.getUserData(user.githubUsername);
    const repos = await github.getRepositories(user.githubUsername);
    const contributions = await github.getContributions(user.githubUsername);
    const pullRequests = await github.getPullRequestMetrics(user.githubUsername);
    const activity = await github.getActivityMetrics(contributions);
    const organizations = await github.getOrganizations(user.githubUsername);
    const gistsCount = await github.getGistsCount(user.githubUsername);
    const languages = await github.getLanguageStats(repos);
    const totalStars = await github.getTotalStars(repos);
    const totalForks = await github.getTotalForks(repos);
    
    const accountAge = Math.floor(
      (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
    );

    const avgRepoQuality = calculateAverageQuality(repos);
    
    const enhancedMetrics = {
      totalCommits: contributions.totalCommits,
      totalRepos: repos.length,
      totalStars,
      totalForks,
      avgRepoQuality,
      languageCount: Object.keys(languages).length,
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

    const score = calculateEnhancedScore(enhancedMetrics);

    const allProfiles = await prisma.profile.findMany({
      select: { score: true },
    });
    const percentile = calculatePercentile(
      score,
      allProfiles.map(p => p.score)
    );

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

    // YENİ: Calculate additional metrics
    const newTotalWatchers = repos.reduce((sum, repo: any) => sum + (repo.watchers_count || repo.watchers || 0), 0);
    const newTotalOpenIssues = repos.reduce((sum, repo: any) => sum + (repo.open_issues_count || repo.open_issues || 0), 0);
    const newAverageRepoSize = repos.length > 0 
      ? Math.round(repos.reduce((sum, repo: any) => sum + (repo.size || 0), 0) / repos.length) 
      : 0;
    const newTotalContributions = contributions?.contributionCalendar?.totalContributions || 0;

    console.log('📊 Contributions Debug:');
console.log('Calendar exists:', !!contributions?.contributionCalendar);
console.log('Total from Calendar:', contributions?.contributionCalendar?.totalContributions);
console.log('newTotalContributions:', newTotalContributions);
    

    const profile = await prisma.profile.upsert({
      where: { 
        userId: user.id 
      },
      update: {
        score,
        percentile,
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
        organizationsCount: organizations.length,
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
        topRepos: topReposData,
        contributions: contributionsData,
        
        scannedAt: new Date(),
      },
      create: {
        userId: user.id,
        
        score,
        percentile,
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
        organizationsCount: organizations.length,
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
        topRepos: topReposData,
        contributions: contributionsData,
      },
    });

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
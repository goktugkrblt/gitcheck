import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/github";
import {
  calculateScore,
  calculateAverageQuality,
  calculatePercentile,
} from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

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

    // Check if user can scan (FREE tier = 1 scan only)
    if (user.plan === "FREE" && user.scans.length >= 1) {
      return NextResponse.json(
        { error: "Free tier limit reached. Upgrade to Pro for unlimited scans." },
        { status: 403 }
      );
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

    // Fetch GitHub data
    const userData = await github.getUserData(user.githubUsername);
    const repos = await github.getRepositories(user.githubUsername);
    const languages = await github.getLanguageStats(repos);
    const totalStars = await github.getTotalStars(repos);
    const totalForks = await github.getTotalForks(repos);

    // Calculate metrics
    const avgRepoQuality = calculateAverageQuality(repos);

    const metrics = {
      totalCommits: 0, // Will implement commit counting later
      totalRepos: repos.length,
      totalStars,
      totalForks,
      avgRepoQuality,
      languageCount: Object.keys(languages).length,
    };

    // Calculate score
    const score = calculateScore(metrics);

    // Get all scores for percentile calculation
    const allProfiles = await prisma.profile.findMany({
      select: { score: true },
    });
    const percentile = calculatePercentile(
      score,
      allProfiles.map((p) => p.score)
    );

    // Get top repos
    const topRepos = repos
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        description: repo.description,
        qualityScore: 0, // Can add quality calculation
      }));

    // Save profile
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        score,
        percentile,
        totalCommits: metrics.totalCommits,
        totalRepos: metrics.totalRepos,
        totalStars,
        totalForks,
        languages,
        topRepos,
        contributions: [], // Will add contribution data later
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
      profile: {
        id: profile.id,
        score: profile.score,
        percentile: profile.percentile,
        totalRepos: profile.totalRepos,
        totalStars: profile.totalStars,
        totalForks: profile.totalForks,
        languages: profile.languages,
        topRepos: profile.topRepos,
      },
    });
  } catch (error) {
    console.error("GitHub analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze GitHub profile" },
      { status: 500 }
    );
  }
}
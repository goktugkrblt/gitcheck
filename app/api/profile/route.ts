import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profiles: {
          orderBy: { scannedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user || !user.profiles[0]) {
      return NextResponse.json({ profile: null });
    }

    const profile = user.profiles[0];

    return NextResponse.json({
      user: {
        plan: user.plan 
      },
      profile: {
        // Core metrics
        score: profile.score,
        percentile: profile.percentile,
        totalRepos: profile.totalRepos,
        totalStars: profile.totalStars,
        totalForks: profile.totalForks,
        totalCommits: profile.totalCommits,
        
        // PR metrics
        totalPRs: profile.totalPRs,
        mergedPRs: profile.mergedPRs,
        openPRs: profile.openPRs,
        
        // Activity metrics
        currentStreak: profile.currentStreak,
        longestStreak: profile.longestStreak,
        averageCommitsPerDay: profile.averageCommitsPerDay,
        mostActiveDay: profile.mostActiveDay,
        weekendActivity: profile.weekendActivity,
        
        // Community metrics
        followersCount: profile.followersCount,
        followingCount: profile.followingCount,
        organizationsCount: profile.organizationsCount,
        gistsCount: profile.gistsCount,
        
        // Account info
        accountAge: profile.accountAge,
        
        // Extended metrics
        totalIssuesOpened: profile.totalIssuesOpened,
        totalReviews: profile.totalReviews,
        totalContributions: profile.totalContributions,
        totalWatchers: profile.totalWatchers,
        totalOpenIssues: profile.totalOpenIssues,
        averageRepoSize: profile.averageRepoSize,
        
        // JSON fields
        languages: profile.languages,
        frameworks: profile.frameworks,
        topRepos: profile.topRepos,
        contributions: profile.contributions,
        
        // User info
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
        location: profile.location,
        company: profile.company,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
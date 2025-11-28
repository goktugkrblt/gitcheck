import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/github";
import { CacheService } from "@/lib/cache";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and check PRO status
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check PRO plan
    if (user.plan !== "PRO") {
      return NextResponse.json(
        { error: "PRO plan required" },
        { status: 403 }
      );
    }

    // Check if user has GitHub token
    if (!user.githubToken || !user.githubUsername) {
      return NextResponse.json(
        { error: "GitHub account not connected" },
        { status: 404 }
      );
    }

    const cacheKey = `pro-analysis-${user.githubUsername}`;
    const cached = CacheService.get(cacheKey);

    // If cached, return immediately
    if (cached?.repoHealth) {
      console.log(`📦 Returning cached repo health for: ${user.githubUsername}`);
      return NextResponse.json({
        success: true,
        data: {
          repoHealth: cached.repoHealth,
        },
      });
    }

    // If not cached, analyze now
    console.log(`🏥 No cache, analyzing repository health for: ${user.githubUsername}`);

    // Initialize GitHub Service
    const githubService = new GitHubService(user.githubToken);

    // Analyze Repository Health
    const repoHealth = await githubService.analyzeRepositoryHealth(user.githubUsername);

    return NextResponse.json({
      success: true,
      data: {
        repoHealth,
      },
    });
  } catch (error) {
    console.error("Repository health analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze repository health" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/github";
import { CacheService } from "@/lib/cache";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.plan !== "PRO" || !user.githubToken || !user.githubUsername) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const cacheKey = `pro-analysis-${user.githubUsername}`;
    
    // Check if already in cache
    const cached = CacheService.get(cacheKey);
    if (cached) {
      return NextResponse.json({ 
        success: true, 
        message: "Analysis already in progress or cached" 
      });
    }

    // Start background analysis (don't wait)
    analyzeInBackground(user.githubUsername, user.githubToken, cacheKey);

    return NextResponse.json({ 
      success: true, 
      message: "Analysis started in background" 
    });
  } catch (error) {
    console.error("Background analysis error:", error);
    return NextResponse.json({ error: "Failed to start analysis" }, { status: 500 });
  }
}

async function analyzeInBackground(username: string, token: string, cacheKey: string) {
  try {
    const githubService = new GitHubService(token);

    console.log(`🔄 Background analysis started for: ${username}`);

    // Run analyses in parallel for speed
    const [codeQuality, repoHealth] = await Promise.all([
      githubService.analyzeReadmeQuality(username).catch(err => {
        console.error('Code quality analysis failed:', err);
        return null;
      }),
      githubService.analyzeRepositoryHealth(username).catch(err => {
        console.error('Repo health analysis failed:', err);
        return null;
      }),
    ]);

    // Cache results
    CacheService.set(cacheKey, {
      codeQuality,
      repoHealth,
      analyzedAt: new Date().toISOString(),
    });

    console.log(`✅ Background analysis completed for: ${username}`);
  } catch (error) {
    console.error('Background analysis failed:', error);
  }
}
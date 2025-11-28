import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/github";
import { CacheService, CacheKeys } from "@/lib/cache"; // ✅ CacheKeys import et

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan !== "PRO") {
      return NextResponse.json({ error: "PRO plan required" }, { status: 403 });
    }

    if (!user.githubToken || !user.githubUsername) {
      return NextResponse.json({ error: "GitHub account not connected" }, { status: 404 });
    }

    const username = user.githubUsername;
    const cacheKey = CacheKeys.repoHealth(username); // ✅ DOĞRU KEY

    // 🔥 CHECK CACHE
    const cached = CacheService.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache HIT for repo health: ${username}`);
      return NextResponse.json({
        success: true,
        data: { repoHealth: cached },
      });
    }

    // Cache miss - analyze
    console.log(`🔍 Cache MISS, analyzing repo health for: ${username}`);
    const githubService = new GitHubService(user.githubToken);
    const repoHealth = await githubService.analyzeRepositoryHealth(username);

    // ✅ CACHE'E YAZ
    CacheService.set(cacheKey, repoHealth);
    console.log(`💾 Repo health cached for: ${username}`);

    return NextResponse.json({
      success: true,
      data: { repoHealth },
    });
  } catch (error) {
    console.error("Repository health analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze repository health" }, { status: 500 });
  }
}

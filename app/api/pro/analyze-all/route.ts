import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Octokit } from "@octokit/rest";
import { CacheService, CacheKeys } from "@/lib/cache";
import { analyzeAllPro } from "@/lib/pro/analyze-all";

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

    // ✅ REMOVED: PRO plan check - all users get analysis now
    // Score is visible to everyone, but detailed insights require PRO

    if (!user.githubToken || !user.githubUsername) {
      return NextResponse.json({ error: "GitHub account not connected" }, { status: 404 });
    }

    const username = user.githubUsername;
    const cacheKey = CacheKeys.proAnalysis(username);

    // 🔥 CHECK CACHE
    const cached = CacheService.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache HIT for PRO analysis: ${username}`);
      return NextResponse.json({
        success: true,
        data: cached,
      });
    }

    // Cache miss - analyze everything
    console.log(`🔍 Cache MISS, running full PRO analysis for: ${username}`);
    
    const octokit = new Octokit({
      auth: user.githubToken,
    });

    const analysis = await analyzeAllPro(octokit, username);

    // ✅ CACHE ALL RESULTS (Redis)
    CacheService.set(cacheKey, analysis);
    console.log(`💾 Full PRO analysis cached for: ${username}`);

    // ✅ NEW: SAVE TO DATABASE
    try {
      console.log(`💾 Saving PRO analysis to database for: ${username}`);
      
      await prisma.profile.updateMany({
        where: { 
          user: {
            githubUsername: username
          }
        },
        data: {
          codeQualityCache: JSON.stringify(analysis),
          repoHealthCache: JSON.stringify(analysis),
          testCoverageCache: JSON.stringify(analysis),
          cicdAnalysisCache: JSON.stringify(analysis),
          lastCodeQualityScan: new Date(),
          lastRepoHealthScan: new Date(),
          lastTestCoverageScan: new Date(),
          lastCicdAnalysisScan: new Date(),
        },
      });

      console.log(`✅ PRO analysis saved to database for: ${username}`);
    } catch (dbError) {
      console.error('❌ Failed to save to database:', dbError);
      // Don't fail the request - Redis cache is still valid
    }

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("PRO analysis error:", error);
    return NextResponse.json({ 
      error: "Failed to complete PRO analysis",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
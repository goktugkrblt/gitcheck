import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateDeveloperScore, calculateBasicScore } from "@/lib/scoring/developer-score";
import { CacheService, CacheKeys } from "@/lib/cache";

// ✅ PRO Analysis Cache Type
interface ProAnalysisCache {
  readmeQuality: {
    overallScore: number;
    grade: string;
    details: any;
  };
  repoHealth: {
    overallScore: number;
    grade: string;
    details: any;
  };
  devPatterns: {
    overallScore: number;
    metrics: any;
    insights: any;
  };
  careerInsights: {
    overallScore: number;
    experienceLevel: string;
    profileType: string;
    skills: any;
  };
}

/**
 * GET /api/score
 * Calculate comprehensive developer score
 * 
 * LOGIC:
 * 1. Check if user has PRO plan
 * 2. If PRO: Use PRO analysis data for accurate scoring
 * 3. If FREE: Use basic GitHub metrics for approximate scoring
 * 4. Cache results for 1 hour
 */
export async function GET(request: Request) {
  try {
    // Get current user from Auth.js
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        profiles: {
          orderBy: { scannedAt: 'desc' },
          take: 1,
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = user.profiles[0];
    
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Please analyze your GitHub profile first." },
        { status: 404 }
      );
    }

    const username = user.githubUsername;

    // Check cache first
    const cacheKey = CacheKeys.proAnalysis(username);
    const cached = CacheService.get(cacheKey) as ProAnalysisCache | null;

    let scoreResult;

    // PRO USER: Calculate from PRO analysis
    if (user.plan === "PRO" && cached) {
      console.log(`✅ [SCORE] Calculating PRO score for ${username}`);
      
      scoreResult = calculateDeveloperScore({
        readmeQuality: cached.readmeQuality,
        repoHealth: cached.repoHealth,
        devPatterns: cached.devPatterns,
        careerInsights: cached.careerInsights,
      });

      console.log(`📊 [SCORE] PRO Score: ${scoreResult.overallScore}/100 (${scoreResult.grade})`);
    } 
    // FREE USER or PRO without cache: Calculate from basic metrics
    else {
      console.log(`✅ [SCORE] Calculating basic score for ${username}`);
      
      scoreResult = calculateBasicScore({
        totalCommits: profile.totalCommits,
        totalRepos: profile.totalRepos,
        totalStars: profile.totalStars,
        currentStreak: profile.currentStreak,
        followersCount: profile.followersCount,
        totalPRs: profile.totalPRs,
      });

      console.log(`📊 [SCORE] Basic Score: ${scoreResult.overallScore}/100 (${scoreResult.grade})`);
    }

    // Update profile with new score
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        score: scoreResult.overallScore,
        percentile: scoreResult.percentile,
      },
    });

    console.log(`💾 [SCORE] Updated profile with score: ${scoreResult.overallScore}`);

    return NextResponse.json({
      success: true,
      score: scoreResult,
      isPro: user.plan === "PRO" && cached !== null,
      message: user.plan === "PRO" && cached
        ? "Score calculated from PRO analysis" 
        : "Basic score - Upgrade to PRO for detailed analysis",
    });

  } catch (error: any) {
    console.error("❌ [SCORE] Error:", error);
    return NextResponse.json(
      { error: "Failed to calculate score", details: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateDeveloperScore } from "@/lib/scoring/developer-score";
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
 * Calculate comprehensive developer score from PRO analysis
 * 
 * NEW STRATEGY:
 * - Score is ONLY calculated from PRO analysis (no basic scoring)
 * - FREE users: Get "locked" status, must upgrade to see score
 * - PRO users: Must complete PRO analysis to get score
 * - This creates clear value proposition and consistent scoring
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

    // Check if user has PRO plan
    if (user.plan !== "PRO") {
      console.log(`🔒 [SCORE] FREE user - score locked: ${username}`);
      
      return NextResponse.json({
        success: true,
        locked: true,
        isPro: false,
        message: "Upgrade to PRO to unlock your developer score",
      });
    }

    // Check PRO analysis cache
    const cacheKey = CacheKeys.proAnalysis(username);
    const cached = CacheService.get(cacheKey) as ProAnalysisCache | null;

    if (!cached) {
      console.log(`⚠️ [SCORE] PRO user but no analysis yet: ${username}`);
      
      return NextResponse.json({
        success: true,
        locked: false,
        analysisRequired: true,
        isPro: true,
        message: "Visit PRO tab to run analysis and get your score",
      });
    }

    // Calculate score from PRO analysis
    console.log(`✅ [SCORE] Calculating PRO score for ${username}`);
    
    const scoreResult = calculateDeveloperScore({
      readmeQuality: cached.readmeQuality,
      repoHealth: cached.repoHealth,
      devPatterns: cached.devPatterns,
      careerInsights: cached.careerInsights,
    });

    console.log(`📊 [SCORE] PRO Score: ${scoreResult.overallScore}/100 (${scoreResult.grade})`);

    // Update profile with score
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
      locked: false,
      analysisRequired: false,
      score: scoreResult,
      isPro: true,
      message: "Score calculated from PRO analysis",
    });

  } catch (error: any) {
    console.error("❌ [SCORE] Error:", error);
    return NextResponse.json(
      { error: "Failed to calculate score", details: error.message },
      { status: 500 }
    );
  }
}
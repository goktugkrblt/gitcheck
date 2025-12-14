import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateDeveloperScore } from '@/lib/scoring/developer-score';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('🔍 Profile API called');
    
    const session = await auth();
    
    if (!session?.user?.email) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Session found:', session.user.email);

    // Fetch user from database with profile (one-to-one relationship)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profiles: true,
      },
    });

    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User found:', {
      id: user.id,
      plan: user.plan,
      hasProfile: user.profiles.length > 0,
    });

    // Get the first profile (should only be one due to userId @unique)
    const profile = user.profiles[0];

    if (!profile) {
      console.log('❌ No profile found for user');
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    console.log('📊 Profile data:', {
      username: profile.username,
      totalCommits: profile.totalCommits,
      totalRepos: profile.totalRepos,
      totalStars: profile.totalStars,
      currentStreak: profile.currentStreak,
      followersCount: profile.followersCount,
      totalPRs: profile.totalPRs,
    });

    // PRO data is stored in Profile model as cache fields
    const hasPROData = user.plan === 'PRO' && (
      profile.codeQualityCache ||
      profile.repoHealthCache ||
      profile.testCoverageCache ||
      profile.cicdAnalysisCache
    );

    console.log('💎 PRO data:', {
      userPlan: user.plan,
      hasPROCache: hasPROData,
      hasCodeQuality: !!profile.codeQualityCache,
      hasRepoHealth: !!profile.repoHealthCache,
      hasTestCoverage: !!profile.testCoverageCache,
      hasCicd: !!profile.cicdAnalysisCache,
    });

    // Calculate score with fallback support
    console.log('🎯 Calculating score...');
    console.log('  - User plan:', user.plan);
    console.log('  - Has PRO cache:', hasPROData);

    // Parse cached PRO data if available (all data is stored in codeQualityCache)
    const analysisData = profile.codeQualityCache 
      ? (typeof profile.codeQualityCache === 'string' 
          ? JSON.parse(profile.codeQualityCache) 
          : profile.codeQualityCache)
      : null;

    console.log('  - Parsed analysis data:', analysisData ? {
      hasReadme: !!analysisData.readmeQuality,
      hasHealth: !!analysisData.repoHealth,
      hasPatterns: !!analysisData.devPatterns,
      hasCareer: !!analysisData.careerInsights,
    } : 'null');

    const scoringResult = calculateDeveloperScore({
      // PRO features (directly from root of analysisData)
      readmeQuality: user.plan === 'PRO' && analysisData?.readmeQuality ? analysisData.readmeQuality : undefined,
      repoHealth: user.plan === 'PRO' && analysisData?.repoHealth ? analysisData.repoHealth : undefined,
      devPatterns: user.plan === 'PRO' && analysisData?.devPatterns ? analysisData.devPatterns : undefined,
      careerInsights: user.plan === 'PRO' && analysisData?.careerInsights ? analysisData.careerInsights : undefined,
      
      // Basic metrics for fallback scoring
      basicMetrics: {
        totalCommits: profile.totalCommits || 0,
        totalRepos: profile.totalRepos || 0,
        totalStars: profile.totalStars || 0,
        currentStreak: profile.currentStreak || 0,
        followersCount: profile.followersCount || 0,
        totalPRs: profile.totalPRs || 0,
      },
    });

    console.log('✅ Score calculated:', {
      score: scoringResult.overallScore,
      grade: scoringResult.grade,
      percentile: scoringResult.percentile,
      method: scoringResult.scoringMethod,
      components: scoringResult.components,
    });

    // Build response
    const response = {
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
      },
      profile: {
        id: profile.id,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
        location: profile.location,
        blog: profile.blog,
        company: profile.company,
        hireable: profile.hireable,
        
        // Stats
        totalCommits: profile.totalCommits,
        totalPRs: profile.totalPRs,
        mergedPRs: profile.mergedPRs,
        openPRs: profile.openPRs,
        totalRepos: profile.totalRepos,
        totalStars: profile.totalStars,
        totalForks: profile.totalForks,
        followersCount: profile.followersCount,
        followingCount: profile.followingCount,
        organizationsCount: profile.organizationsCount,
        gistsCount: profile.gistsCount,
        
        // Activity
        currentStreak: profile.currentStreak,
        longestStreak: profile.longestStreak,
        averageCommitsPerDay: profile.averageCommitsPerDay,
        mostActiveDay: profile.mostActiveDay,
        weekendActivity: profile.weekendActivity,
        
        // Language & data
        languages: profile.languages,
        topRepos: profile.topRepos,
        contributions: profile.contributions,
        frameworks: profile.frameworks,
        
        // Contributions
        totalIssuesOpened: profile.totalIssuesOpened,
        totalReviews: profile.totalReviews,
        totalContributions: profile.totalContributions,
        totalWatchers: profile.totalWatchers,
        totalOpenIssues: profile.totalOpenIssues,
        
        // Account
        accountAge: profile.accountAge,
        accountCreatedAt: profile.accountCreatedAt,
        
        // Analysis from Profile model
        profileStrengths: profile.strengths,
        profileWeaknesses: profile.weaknesses,
        roadmap: profile.roadmap,
        marketValue: profile.marketValue,
        
        // Timestamps
        scannedAt: profile.scannedAt,
        lastLanguageScan: profile.lastLanguageScan,
        lastFrameworkScan: profile.lastFrameworkScan,
        
        // Score data from calculateDeveloperScore
        score: scoringResult.overallScore,
        percentile: scoringResult.percentile,
        grade: scoringResult.grade,
        scoringMethod: scoringResult.scoringMethod, // 'pro' or 'fallback'
        scoreComponents: scoringResult.components, // Detailed component breakdown
        scoreStrengths: scoringResult.strengths,
        scoreImprovements: scoringResult.improvements,
      },
      proData: user.plan === 'PRO' ? {
        codeQuality: profile.codeQualityCache,
        repoHealth: profile.repoHealthCache,
        testCoverage: profile.testCoverageCache,
        cicdAnalysis: profile.cicdAnalysisCache,
        lastCodeQualityScan: profile.lastCodeQualityScan,
        lastRepoHealthScan: profile.lastRepoHealthScan,
        lastTestCoverageScan: profile.lastTestCoverageScan,
        lastCicdAnalysisScan: profile.lastCicdAnalysisScan,
      } : null,
    };

    console.log('✅ Sending response with score:', response.profile.score);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
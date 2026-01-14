import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDeveloperScore } from '@/lib/scoring/developer-score';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Profile API called');

    // Get username from query parameter
    const url = new URL(req.url);
    const username = url.searchParams.get('username');

    if (!username) {
      console.log('❌ No username provided');
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    console.log(`🔍 Fetching profile for username: ${username}`);

    const profile = await prisma.profile.findUnique({
      where: { username },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    console.log('📊 Score from DB:', profile.score);

    // Parse cached PRO data
    const analysisData = profile.codeQualityCache 
      ? (typeof profile.codeQualityCache === 'string' 
          ? JSON.parse(profile.codeQualityCache) 
          : profile.codeQualityCache)
      : null;

    // ✅ YENİ: scoreComponents hesapla (Why this score? için)
    let scoringResult = null;
    if (profile.score > 0) {
      console.log('🎯 Calculating scoreComponents for frontend...');
      
      scoringResult = calculateDeveloperScore({
        readmeQuality: analysisData?.readmeQuality || undefined,
        repoHealth: analysisData?.repoHealth || undefined,
        devPatterns: analysisData?.devPatterns || undefined,
        careerInsights: analysisData?.careerInsights || undefined,
        basicMetrics: {
          totalCommits: profile.totalCommits || 0,
          totalRepos: profile.totalRepos || 0,
          totalStars: profile.totalStars || 0,
          totalForks: profile.totalForks || 0,
          totalPRs: profile.totalPRs || 0,
          mergedPRs: profile.mergedPRs || 0,
          openPRs: profile.openPRs || 0,
          totalIssuesOpened: profile.totalIssuesOpened || 0,
          totalReviews: profile.totalReviews || 0,
          currentStreak: profile.currentStreak || 0,
          longestStreak: profile.longestStreak || 0,
          averageCommitsPerDay: profile.averageCommitsPerDay || 0,
          weekendActivity: profile.weekendActivity || 0,
          followersCount: profile.followersCount || 0,
          followingCount: profile.followingCount || 0,
          organizationsCount: profile.organizationsCount || 0,
          gistsCount: profile.gistsCount || 0,
          accountAge: profile.accountAge || 0,
          totalContributions: profile.totalContributions || 0,
          mostActiveDay: profile.mostActiveDay || 'Monday',
          averageRepoSize: profile.averageRepoSize || 0,
          totalWatchers: profile.totalWatchers || 0,
          totalOpenIssues: profile.totalOpenIssues || 0,
        },
      });
      
      console.log('✅ scoreComponents created for frontend');
    }

    const response = {
      user: {
        plan: "FREE", // Default plan for non-authenticated users
      },
      profile: {
        ...profile,
        codeQualityCache: analysisData,
        scoringMethod: analysisData ? 'pro' : 'fallback',
        scoreComponents: scoringResult?.components || null, // ✅ Why this score?
        scoreStrengths: scoringResult?.strengths || null,
        scoreImprovements: scoringResult?.improvements || null,
      },
    };

    console.log('📤 Sending response with scoreComponents:', !!response.profile.scoreComponents);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
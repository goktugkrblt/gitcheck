import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/leaderboard
 * Returns top 10 real developers sorted by score
 * NO MOCK DATA - Only real analyzed profiles
 * Auto-updates as users analyze their profiles
 */

export async function GET() {
  try {
    console.log('📊 [LEADERBOARD] Fetching top developers...');

    // Get real profiles with scores from database
    const profiles = await prisma.profile.findMany({
      where: {
        score: { gt: 0 },     // ✅ Score > 0
        isPublic: true,        // ✅ Only public
        username: {
          not: null,           // ✅ Not null
        },
        NOT: {
          username: '',        // ✅ Not empty string
        },
      },
      select: {
        username: true,
        avatarUrl: true,
        score: true,
        percentile: true,
        scannedAt: true,
      },
      orderBy: {
        score: 'desc',
      },
      take: 10,
    });

    console.log(`📊 [LEADERBOARD] Found ${profiles.length} real profiles`);

// Convert to leaderboard format
const leaderboard = profiles.map((profile, index) => ({
  rank: index + 1,
  username: profile.username || 'Anonymous',
  score: Number(profile.score.toFixed(2)), // ✅ CHANGED: 54.30 (2 decimal)
  avatar: profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
  percentile: profile.percentile,
  lastUpdated: profile.scannedAt,
}));

    // Create response
    const response = NextResponse.json({
      success: true,
      leaderboard,
      count: profiles.length,
      lastUpdated: new Date().toISOString(),
    });

    // Set cache headers
    response.headers.set('Cache-Control', 'no-store, max-age=0');

    return response;

  } catch (error: any) {
    console.error('❌ [LEADERBOARD] Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to load leaderboard', 
      details: error.message,
      leaderboard: [],
      count: 0,
    }, { status: 500 });
  }
}
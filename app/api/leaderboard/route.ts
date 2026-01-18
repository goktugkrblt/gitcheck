import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

/**
 * GET /api/leaderboard
 * Returns top developers sorted by score
 * Supports global and country-based filtering
 * Query params:
 *   - type: "global" | "country"
 *   - country: country name (required when type=country)
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'global';
    const country = searchParams.get('country');

    console.log('📊 [LEADERBOARD] Fetching top developers...', { type, country });

    // Build where clause
    const whereClause: any = {
      score: { gt: 0 },
      isPublic: true,
      username: { not: '' },
    };

    // Add country filter if type is country
    if (type === 'country' && country) {
      whereClause.location = {
        contains: country,
        mode: 'insensitive',
      };
    }

    // Get profiles from database
    const profiles = await prisma.profile.findMany({
      where: whereClause,
      select: {
        username: true,
        avatarUrl: true,
        score: true,
        location: true,
        percentile: true,
        scannedAt: true,
      },
      orderBy: {
        score: 'desc',
      },
      take: 100,
    });

    console.log(`📊 [LEADERBOARD] Found ${profiles.length} profiles`);

    // Get all unique countries for the dropdown
    const allProfiles = await prisma.profile.findMany({
      where: {
        score: { gt: 0 },
        isPublic: true,
        location: { not: null },
      },
      select: {
        location: true,
      },
    });

    // Extract unique countries from location field
    const countries = Array.from(
      new Set(
        allProfiles
          .map(p => p.location)
          .filter(Boolean)
          .map(loc => {
            // Try to extract country from location string
            // Common patterns: "Turkey", "Istanbul, Turkey", "TR"
            const parts = loc!.split(',').map(s => s.trim());
            return parts[parts.length - 1]; // Take last part as country
          })
      )
    ).sort();

    // Convert to leaderboard format
    const users = profiles.map((profile, index) => ({
      rank: index + 1,
      username: profile.username || 'Anonymous',
      score: Number(profile.score.toFixed(2)),
      avatarUrl: profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      country: profile.location ? profile.location.split(',').map(s => s.trim()).pop() : null,
      percentile: profile.percentile,
      lastUpdated: profile.scannedAt,
    }));

    // Create response
    const response = NextResponse.json({
      success: true,
      users,
      countries,
      count: profiles.length,
      type,
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
      users: [],
      countries: [],
      count: 0,
    }, { status: 500 });
  }
}
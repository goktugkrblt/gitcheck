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
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📊 [LEADERBOARD] Fetching top developers...', { type, country, limit, offset });

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

    // Get total count for pagination
    const totalCount = await prisma.profile.count({
      where: whereClause,
    });

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
      skip: offset,
      take: limit,
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

    // Extract and normalize country from location field
    const extractCountry = (location: string): string | null => {
      // Split by common separators: comma, slash, dash
      const parts = location.split(/[,\/\-]/).map(s => s.trim()).filter(Boolean);

      // Normalize Turkish/English country names and cities to countries
      const locationToCountry: Record<string, string> = {
        // Turkish country names
        'Türkiye': 'Turkey',
        'Turkiye': 'Turkey',
        'Amerika': 'United States',
        'ABD': 'United States',
        'İngiltere': 'United Kingdom',
        'Almanya': 'Germany',
        'Fransa': 'France',
        'İspanya': 'Spain',
        'İtalya': 'Italy',
        'Hollanda': 'Netherlands',
        'Belçika': 'Belgium',

        // Turkish cities -> Turkey
        'Istanbul': 'Turkey',
        'Ankara': 'Turkey',
        'Izmir': 'Turkey',
        'İzmir': 'Turkey',
        'Bursa': 'Turkey',
        'Antalya': 'Turkey',
        'Üsküdar': 'Turkey',
        'Kadıköy': 'Turkey',
        'Beyoğlu': 'Turkey',
        'Şişli': 'Turkey',
        'Beşiktaş': 'Turkey',

        // US cities -> United States
        'New York': 'United States',
        'Los Angeles': 'United States',
        'San Francisco': 'United States',
        'Washington': 'United States',
        'Seattle': 'United States',
        'Chicago': 'United States',
        'Boston': 'United States',
        'Austin': 'United States',

        // Other cities
        'London': 'United Kingdom',
        'Manchester': 'United Kingdom',
        'Paris': 'France',
        'Berlin': 'Germany',
        'Munich': 'Germany',
        'Amsterdam': 'Netherlands',
        'Tokyo': 'Japan',
        'Mumbai': 'India',
        'Delhi': 'India',
        'Bangalore': 'India',
        'São Paulo': 'Brazil',
        'Moscow': 'Russia',
        'Beijing': 'China',
        'Shanghai': 'China',
        'Sydney': 'Australia',
        'Melbourne': 'Australia',
        'Toronto': 'Canada',
        'Vancouver': 'Canada',
      };

      // List of valid country names (only these will be shown in dropdown)
      const validCountries = new Set([
        'Turkey',
        'United States',
        'United Kingdom',
        'Germany',
        'France',
        'Spain',
        'Italy',
        'Netherlands',
        'Belgium',
        'Canada',
        'Australia',
        'India',
        'China',
        'Japan',
        'Brazil',
        'Russia',
        'Poland',
        'Sweden',
        'Norway',
        'Denmark',
        'Finland',
        'Switzerland',
        'Austria',
        'Portugal',
        'Greece',
        'Ireland',
        'New Zealand',
        'Singapore',
        'South Korea',
        'Mexico',
        'Argentina',
        'Chile',
        'Colombia',
        'Ukraine',
        'Czech Republic',
        'Romania',
        'Hungary',
      ]);

      // Try to find a valid country from all parts (right to left)
      for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];

        // Check if it's in our mapping
        if (locationToCountry[part]) {
          return locationToCountry[part];
        }

        // Check if it's a valid country name
        if (validCountries.has(part)) {
          return part;
        }
      }

      return null; // Return null if no valid country found
    };

    const countries = Array.from(
      new Set(
        allProfiles
          .map(p => p.location)
          .filter(Boolean)
          .map(loc => extractCountry(loc!))
          .filter(Boolean) // Remove null values (invalid countries)
      )
    ).sort();

    // Convert to leaderboard format
    const users = profiles.map((profile, index) => ({
      rank: offset + index + 1,
      username: profile.username || 'Anonymous',
      score: Number(profile.score.toFixed(2)),
      avatarUrl: profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      country: profile.location ? extractCountry(profile.location) : null,
      percentile: profile.percentile,
      lastUpdated: profile.scannedAt,
    }));

    // Create response
    const response = NextResponse.json({
      success: true,
      users,
      leaderboard: users, // For backward compatibility with homepage
      countries,
      count: profiles.length,
      totalCount,
      hasMore: offset + profiles.length < totalCount,
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
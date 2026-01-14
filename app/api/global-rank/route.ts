import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { score: true },
    });

    if (!profile || profile.score === null) {
      return NextResponse.json(
        { error: "Profile not found or no score available" },
        { status: 404 }
      );
    }

    // Count total profiles with scores
    const totalProfiles = await prisma.profile.count({
      where: {
        score: {
          not: null as any,
        },
      },
    });

    // Count profiles with higher scores
    const higherScores = await prisma.profile.count({
      where: {
        score: { gt: profile.score as number },
      },
    });

    // Calculate rank (1-based)
    const rank = higherScores + 1;

    // Calculate percentile
    const percentile = totalProfiles > 0
      ? ((totalProfiles - rank + 1) / totalProfiles) * 100
      : 0;

    return NextResponse.json({
      rank,
      totalProfiles,
      percentile: Math.round(percentile * 100) / 100, // 2 decimal places
      score: profile.score,
    });
  } catch (error) {
    console.error("Error fetching global rank:", error);
    return NextResponse.json(
      { error: "Failed to fetch global rank" },
      { status: 500 }
    );
  }
}

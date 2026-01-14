import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findFirst({
      where: { userId: session.user.id },
      select: {
        totalRepos: true,
        totalStars: true,
        totalForks: true,
        topRepos: true,
        languages: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Calculate additional stats
    const topRepos = (profile.topRepos as any[]) || [];
    const forkCount = topRepos.filter((r: any) => r.isFork).length;
    const originalCount = topRepos.length - forkCount;
    const forkRatio = topRepos.length > 0 ? Math.round((forkCount / topRepos.length) * 100) : 0;
    
    // Most starred repo
    const mostStarred = topRepos.length > 0
      ? topRepos.reduce((max: any, repo: any) => 
          (repo.stars || 0) > (max.stars || 0) ? repo : max
        , topRepos[0])
      : null;

    // Recently updated
    const recentRepos = [...topRepos]
      .sort((a: any, b: any) => {
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);

    // Language distribution
    const languageRepos: Record<string, number> = {};
    topRepos.forEach((repo: any) => {
      if (repo.language) {
        languageRepos[repo.language] = (languageRepos[repo.language] || 0) + 1;
      }
    });

    // Average stars per repo
    const avgStars = topRepos.length > 0 
      ? Math.round(topRepos.reduce((sum: number, r: any) => sum + (r.stars || 0), 0) / topRepos.length)
      : 0;

    return NextResponse.json({
      totalRepos: profile.totalRepos || 0,
      totalStars: profile.totalStars || 0,
      totalForks: profile.totalForks || 0,
      topRepos,
      stats: {
        originalRepos: originalCount,
        forkedRepos: forkCount,
        forkRatio,
        averageStars: avgStars,
        mostStarredRepo: mostStarred,
        languageDistribution: languageRepos,
      },
      recentRepos,
    });
  } catch (error) {
    console.error("Repositories error:", error);
    return NextResponse.json({ 
      error: "Failed to get repositories",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

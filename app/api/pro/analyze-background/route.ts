import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/github";
import { CacheService, CacheKeys } from "@/lib/cache";

// Request deduplication - aynı anda multiple request engelle
const pendingAnalysis = new Map<string, Promise<void>>();

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.plan !== "PRO" || !user.githubToken || !user.githubUsername) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const username = user.githubUsername;

    // 🔥 CHECK IF ALREADY IN PROGRESS
    if (pendingAnalysis.has(username)) {
      console.log(`⏳ Analysis already in progress for: ${username}`);
      return NextResponse.json({ 
        success: true, 
        message: "Analysis already in progress" 
      });
    }

    // 🔥 CHECK CACHE - Ayrı ayrı kontrol et
    const hasCodeQualityCache = CacheService.has(CacheKeys.readmeQuality(username));
    const hasRepoHealthCache = CacheService.has(CacheKeys.repoHealth(username));

    if (hasCodeQualityCache && hasRepoHealthCache) {
      console.log(`✅ Both cached for: ${username}, skipping analysis`);
      return NextResponse.json({ 
        success: true, 
        message: "Using cached data" 
      });
    }

    // 🚀 START BACKGROUND ANALYSIS
    const analysisPromise = analyzeInBackground(username, user.githubToken);
    pendingAnalysis.set(username, analysisPromise);

    // Don't await - return immediately
    return NextResponse.json({ 
      success: true, 
      message: "Analysis started in background" 
    });
  } catch (error) {
    console.error("Background analysis error:", error);
    return NextResponse.json({ error: "Failed to start analysis" }, { status: 500 });
  }
}

async function analyzeInBackground(username: string, token: string) {
  try {
    const githubService = new GitHubService(token);

    console.log(`🔄 Background analysis started for: ${username}`);

    // 🔥 Sadece cache'de OLMAYAN analizleri çalıştır
    const promises: Promise<any>[] = [];
    
    // Code Quality cache yoksa analiz et
    if (!CacheService.has(CacheKeys.readmeQuality(username))) {
      console.log(`📖 Analyzing README for: ${username}`);
      promises.push(
        githubService.analyzeReadmeQuality(username)
          .then(data => {
            CacheService.set(CacheKeys.readmeQuality(username), data);
            console.log(`✅ README analysis cached for: ${username}`);
            return data;
          })
          .catch(err => {
            console.error('Code quality analysis failed:', err);
            return null;
          })
      );
    } else {
      console.log(`✅ README already cached for: ${username}`);
    }

    // Repo Health cache yoksa analiz et
    if (!CacheService.has(CacheKeys.repoHealth(username))) {
      console.log(`🏥 Analyzing repository health for: ${username}`);
      promises.push(
        githubService.analyzeRepositoryHealth(username)
          .then(data => {
            CacheService.set(CacheKeys.repoHealth(username), data);
            console.log(`✅ Repo health cached for: ${username}`);
            return data;
          })
          .catch(err => {
            console.error('Repo health analysis failed:', err);
            return null;
          })
      );
    } else {
      console.log(`✅ Repo health already cached for: ${username}`);
    }

    // Sadece gerekli analizleri çalıştır
    if (promises.length > 0) {
      await Promise.all(promises);
      console.log(`✅ Background analysis completed for: ${username}`);
    } else {
      console.log(`✅ All data already cached for: ${username}`);
    }

  } catch (error) {
    console.error('Background analysis failed:', error);
  } finally {
    // Cleanup - request deduplication'dan kaldır
    pendingAnalysis.delete(username);
  }
}
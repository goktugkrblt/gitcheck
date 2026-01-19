// app/api/pro/ai-analysis/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateAIAnalysis } from '@/lib/pro/generate-ai-analysis';
import { prisma } from '@/lib/prisma';

// Server-side cache (24 hours)
const aiAnalysisCache = new Map<string, { 
  analysis: string; 
  timestamp: number;
  expiresAt: number;
}>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCachedAnalysis(username: string): string | null {
  const cached = aiAnalysisCache.get(`ai_analysis:${username}`);
  
  if (!cached) return null;
  
  // Check if expired
  if (Date.now() > cached.expiresAt) {
    aiAnalysisCache.delete(`ai_analysis:${username}`);
    return null;
  }
  
  return cached.analysis;
}

function setCachedAnalysis(username: string, analysis: string): void {
  aiAnalysisCache.set(`ai_analysis:${username}`, {
    analysis,
    timestamp: Date.now(),
    expiresAt: Date.now() + CACHE_DURATION,
  });
}

export async function GET(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ DEV MODE: Allow in development, require PRO in production
    const isDev = process.env.NODE_ENV === 'development';
    const hasPRO = user.plan === 'PRO' || isDev;

    if (!hasPRO) {
      console.log(`❌ PRO plan required (user plan: ${user.plan}, dev: ${isDev})`);
      return NextResponse.json({ error: 'PRO plan required' }, { status: 403 });
    }

    console.log(`✅ Access granted: ${isDev ? 'DEV MODE' : 'PRO USER'}`);

    // 3. Check query params - GET USERNAME FROM QUERY!
    const { searchParams } = new URL(request.url);
    const requestedUsername = searchParams.get('username');
    const forceRegenerate = searchParams.get('regenerate') === 'true';

    // Use requested username if provided, fallback to authenticated user
    const username = requestedUsername || user.githubUsername;

    if (!username) {
      return NextResponse.json({ error: 'GitHub username not found' }, { status: 404 });
    }

    console.log(`🎯 Analyzing profile: ${username} ${requestedUsername ? '(requested)' : '(own profile)'}`);

    // 4. Check database cache first (primary cache)
    if (!forceRegenerate) {
      const cachedProfile = await prisma.profile.findUnique({
        where: { username }
      });

      if (cachedProfile?.aiAnalysisCache && cachedProfile.lastAiAnalysisScan) {
        const cacheAge = Date.now() - new Date(cachedProfile.lastAiAnalysisScan).getTime();
        const cacheValidHours = 24; // Cache valid for 24 hours

        if (cacheAge < cacheValidHours * 60 * 60 * 1000) {
          console.log(`✅ Database cache HIT for AI analysis: ${username} (age: ${Math.floor(cacheAge / 1000 / 60)} minutes)`);
          return NextResponse.json({
            success: true,
            data: {
              analysis: cachedProfile.aiAnalysisCache,
              cached: true,
              cacheAge: Math.floor(cacheAge / 1000 / 60), // in minutes
              generatedAt: new Date(cachedProfile.lastAiAnalysisScan).getTime(),
            },
          });
        }
      }
    }

    // 5. Check in-memory cache (secondary cache)
    if (!forceRegenerate) {
      const cached = getCachedAnalysis(username);
      if (cached) {
        console.log(`✅ Memory cache HIT for AI analysis: ${username}`);
        return NextResponse.json({
          success: true,
          data: {
            analysis: cached,
            cached: true,
            generatedAt: aiAnalysisCache.get(`ai_analysis:${username}`)?.timestamp,
          },
        });
      }
    }

    console.log(`⏱️  Generating AI analysis for: ${username} ${forceRegenerate ? '(FORCED)' : ''}`);

    // 6. Fetch PRO analysis data from existing endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const proAnalysisResponse = await fetch(`${baseUrl}/api/pro/analyze-all`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!proAnalysisResponse.ok) {
      throw new Error('Failed to fetch PRO analysis data');
    }

    const proAnalysisResult = await proAnalysisResponse.json();
    const proData = proAnalysisResult.data;

    // 🔍 DEBUG: Data yapısını görelim
    console.log('🔍 PRO DATA STRUCTURE:');
    console.log(JSON.stringify(proData, null, 2));
    console.log('🔍 END PRO DATA');

    if (!proData) {
      return NextResponse.json(
        { error: 'Failed to fetch profile data' },
        { status: 500 }
      );
    }

    // 7. Generate AI analysis
    const startTime = Date.now();
    const analysis = await generateAIAnalysis(username, proData);
    const duration = Date.now() - startTime;

    console.log(`✅ AI analysis generated in ${duration}ms`);

    // 8. Cache in memory (secondary cache)
    setCachedAnalysis(username, analysis);

    // 9. Save to database (primary cache)
    try {
      console.log(`💾 Saving AI analysis to database for: ${username}`);

      await prisma.profile.update({
        where: {
          username: username
        },
        data: {
          aiAnalysisCache: analysis,
          lastAiAnalysisScan: new Date(),
        },
      });

      console.log(`✅ AI analysis saved to database for: ${username}`);
    } catch (dbError) {
      console.error('❌ Failed to save AI analysis to database:', dbError);
      // Continue even if database save fails - we still have in-memory cache
    }

    // 10. Return response
    return NextResponse.json({
      success: true,
      data: {
        analysis,
        cached: false,
        generatedAt: Date.now(),
        duration,
      },
    });

  } catch (error: any) {
    console.error('AI Analysis API Error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate AI analysis',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Optional: Clear cache endpoint
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    // Clear in-memory cache
    if (username) {
      aiAnalysisCache.delete(`ai_analysis:${username}`);
      console.log(`🗑️  Cleared in-memory AI analysis cache for: ${username}`);
    } else {
      aiAnalysisCache.clear();
      console.log(`🗑️  Cleared ALL in-memory AI analysis cache`);
    }

    // Clear database cache
    try {
      if (username) {
        await prisma.profile.update({
          where: {
            username: username
          },
          data: {
            aiAnalysisCache: null,
            lastAiAnalysisScan: null,
          },
        });
        console.log(`🗑️  Cleared database AI analysis cache for: ${username}`);
      } else {
        // Clear for authenticated user only (don't clear all users)
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (user?.githubUsername) {
          await prisma.profile.update({
            where: {
              username: user.githubUsername
            },
            data: {
              aiAnalysisCache: null,
              lastAiAnalysisScan: null,
            },
          });
          console.log(`🗑️  Cleared database AI analysis cache for: ${user.githubUsername}`);
        }
      }
    } catch (dbError) {
      console.error('❌ Failed to clear database cache:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: username
        ? `Cache cleared for ${username}`
        : 'Cache cleared for authenticated user',
    });

  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
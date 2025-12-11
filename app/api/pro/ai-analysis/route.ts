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

    if (user.plan !== 'PRO') {
      return NextResponse.json({ error: 'PRO plan required' }, { status: 403 });
    }

    const username = user.githubUsername;

    if (!username) {
      return NextResponse.json({ error: 'GitHub username not found' }, { status: 404 });
    }

    // 3. Check query params
    const { searchParams } = new URL(request.url);
    const forceRegenerate = searchParams.get('regenerate') === 'true';

    // 4. Check cache (unless force regenerate)
    if (!forceRegenerate) {
      const cached = getCachedAnalysis(username);
      if (cached) {
        console.log(`✅ Cache HIT for AI analysis: ${username}`);
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

    // 5. Fetch PRO analysis data from existing endpoint
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

    // 6. Generate AI analysis
    const startTime = Date.now();
    const analysis = await generateAIAnalysis(username, proData);
    const duration = Date.now() - startTime;

    console.log(`✅ AI analysis generated in ${duration}ms`);

    // 7. Cache the result
    setCachedAnalysis(username, analysis);

    // 8. Return response
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

    if (username) {
      aiAnalysisCache.delete(`ai_analysis:${username}`);
      console.log(`🗑️  Cleared AI analysis cache for: ${username}`);
    } else {
      aiAnalysisCache.clear();
      console.log(`🗑️  Cleared ALL AI analysis cache`);
    }

    return NextResponse.json({
      success: true,
      message: username 
        ? `Cache cleared for ${username}` 
        : 'All cache cleared',
    });

  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
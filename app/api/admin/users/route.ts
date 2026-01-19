import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAIL = 'goktugkarabulut97@gmail.com';

export async function GET() {
  try {
    const session = await auth();

    // Strict admin authentication
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      console.log(`❌ Unauthorized admin access attempt: ${session?.user?.email || 'no email'}`);
      return NextResponse.json(
        { error: 'Unauthorized - Admin access only' },
        { status: 401 }
      );
    }

    console.log(`✅ Admin access granted: ${session.user.email}`);

    // Fetch ALL profiles (both with and without registered users)
    const allProfiles = await prisma.profile.findMany({
      include: {
        user: true
      },
      orderBy: {
        scannedAt: 'desc'
      }
    });

    console.log(`📊 Found ${allProfiles.length} total analyzed profiles`);

    // Convert profiles to user-like format for display
    const usersWithDetails = allProfiles.map(profile => ({
      id: profile.userId || profile.id, // Use profile.id if no user
      email: profile.user?.email || null,
      githubUsername: profile.username,
      plan: profile.user?.plan || 'FREE',
      createdAt: profile.user?.createdAt || profile.scannedAt,
      profile: profile,
      score: profile.score,
      lastScan: profile.scannedAt,
      hasAiAnalysis: profile.aiAnalysisCache ? true : false,
      isOrphaned: !profile.userId // Flag for profiles without registered user
    }));

    // Calculate stats
    const registeredUsers = usersWithDetails.filter(u => !u.isOrphaned);
    const orphanedProfiles = usersWithDetails.filter(u => u.isOrphaned);

    return NextResponse.json({
      users: usersWithDetails,
      stats: {
        total: allProfiles.length,
        registered: registeredUsers.length,
        orphaned: orphanedProfiles.length,
        pro: registeredUsers.filter(u => u.plan === 'PRO').length,
        free: registeredUsers.filter(u => u.plan === 'FREE').length
      }
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

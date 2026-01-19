import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Plan } from '@prisma/client';

const ADMIN_EMAIL = 'goktugkarabulut97@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Strict admin authentication
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      console.log(`❌ Unauthorized plan update attempt: ${session?.user?.email || 'no email'}`);
      return NextResponse.json(
        { error: 'Unauthorized - Admin access only' },
        { status: 401 }
      );
    }

    const { userId, plan } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'Missing userId or plan' },
        { status: 400 }
      );
    }

    if (!['FREE', 'PRO'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be FREE or PRO' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { plan: plan as Plan }
    });

    console.log(`✅ Plan updated: ${user.githubUsername} (${user.email}) -> ${plan}`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        githubUsername: user.githubUsername,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Admin plan update error:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function linkProfile() {
  const username = 'goktugkrblt';

  try {
    // Get user
    const user = await prisma.user.findUnique({
      where: { githubUsername: username }
    });

    if (!user) {
      console.log(`❌ User not found: ${username}`);
      return;
    }

    // Get profile
    const profile = await prisma.profile.findUnique({
      where: { username }
    });

    if (!profile) {
      console.log(`❌ Profile not found: ${username}`);
      return;
    }

    // Link profile to user
    await prisma.profile.update({
      where: { username },
      data: { userId: user.id }
    });

    console.log(`✅ Linked profile ${username} to user ${user.id}`);
    console.log(`Plan: ${user.plan}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkProfile();

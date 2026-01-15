import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makePro() {
  const username = 'goktugkrblt';

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { githubUsername: username }
    });

    if (existingUser) {
      // Update existing user to PRO
      await prisma.user.update({
        where: { githubUsername: username },
        data: { plan: 'PRO' }
      });
      console.log(`✅ Updated ${username} to PRO plan`);
    } else {
      // Create new PRO user
      await prisma.user.create({
        data: {
          email: `${username}@github.local`,
          githubUsername: username,
          githubId: 12345678, // Placeholder GitHub ID
          plan: 'PRO',
          name: 'Göktuğ Karabulut'
        }
      });
      console.log(`✅ Created new PRO user: ${username}`);
    }

    // Verify
    const user = await prisma.user.findUnique({
      where: { githubUsername: username }
    });
    console.log(`\n📊 User Status:`);
    console.log(`Username: ${user?.githubUsername}`);
    console.log(`Plan: ${user?.plan}`);
    console.log(`Email: ${user?.email}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makePro();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      githubUsername: true,
      plan: true,
      email: true,
      profiles: {
        select: {
          score: true,
          scannedAt: true
        },
        orderBy: { scannedAt: 'desc' },
        take: 1
      }
    }
  });

  console.log(`\n📊 Total users with GitHub: ${users.length}\n`);
  console.log('Username              Status    Current Score   Last Scan');
  console.log('─'.repeat(70));

  users.forEach(u => {
    const score = u.profiles[0]?.score?.toFixed(2) || 'N/A';
    const pro = u.plan === 'PRO' ? '⭐ PRO' : '   FREE';
    const lastScan = u.profiles[0]?.scannedAt
      ? new Date(u.profiles[0].scannedAt).toLocaleDateString()
      : 'Never';
    console.log(`${u.githubUsername.padEnd(20)} ${pro}    ${score.toString().padEnd(14)} ${lastScan}`);
  });

  console.log('\n');
}

main().finally(() => prisma.$disconnect());

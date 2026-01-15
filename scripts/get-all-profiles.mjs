import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profile.findMany({
    select: {
      username: true,
      score: true,
      scannedAt: true
    },
    orderBy: { score: 'desc' }
  });

  console.log(`\n📊 Total profiles in database: ${profiles.length}\n`);
  console.log('Username              Current Score   Last Scan');
  console.log('─'.repeat(65));

  profiles.forEach(p => {
    const score = p.score?.toFixed(2) || 'N/A';
    const lastScan = p.scannedAt
      ? new Date(p.scannedAt).toLocaleDateString()
      : 'Never';
    console.log(`${p.username.padEnd(20)} ${score.toString().padEnd(14)} ${lastScan}`);
  });

  console.log('\n');
}

main().finally(() => prisma.$disconnect());

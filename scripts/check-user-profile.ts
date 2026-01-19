import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const username = process.argv[2]

  if (!username) {
    console.log('Usage: tsx scripts/check-user-profile.ts <username>')
    process.exit(1)
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { githubUsername: username },
        { email: { contains: username } }
      ]
    },
    include: {
      profiles: {
        orderBy: { scannedAt: 'desc' },
        take: 1
      }
    }
  })

  if (!user) {
    console.log(`❌ User not found: ${username}`)
    return
  }

  console.log(`\n📝 User: ${user.githubUsername}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Plan: ${user.plan}`)
  console.log(`   GitHub Token: ${user.githubToken ? '✅ Set' : '❌ Not set'}`)

  if (user.profiles.length === 0) {
    console.log(`\n❌ No profile found - user needs to scan first`)
    return
  }

  const profile = user.profiles[0]
  console.log(`\n📊 Profile:`)
  console.log(`   Username: ${profile.username}`)
  console.log(`   Score: ${profile.score}`)
  console.log(`   Scanned At: ${profile.scannedAt}`)
  console.log(`   PRO Analysis Cache: ${(profile as any).proAnalysisCache ? '✅ Available' : '❌ Not generated'}`)
  console.log(`   Last PRO Scan: ${(profile as any).lastProAnalysisScan || '❌ Never'}`)
  console.log(`   AI Analysis Cache: ${(profile as any).aiAnalysisCache ? '✅ Available' : '❌ Not generated'}`)
  console.log(`   Last AI Scan: ${(profile as any).lastAiAnalysisScan || '❌ Never'}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking for duplicate profiles...\n')

  // Find all profiles grouped by lowercase username
  const profiles = await prisma.profile.findMany({
    select: {
      id: true,
      username: true,
      userId: true,
      score: true,
      scannedAt: true,
    },
    orderBy: {
      username: 'asc'
    }
  })

  // Group by lowercase username
  const grouped = new Map<string, typeof profiles>()

  for (const profile of profiles) {
    const lower = profile.username.toLowerCase()
    if (!grouped.has(lower)) {
      grouped.set(lower, [])
    }
    grouped.get(lower)!.push(profile)
  }

  // Find duplicates
  const duplicates = Array.from(grouped.entries())
    .filter(([_, profiles]) => profiles.length > 1)

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!')
    return
  }

  console.log(`❌ Found ${duplicates.length} duplicate usernames:\n`)

  for (const [lowerUsername, profiles] of duplicates) {
    console.log(`\n📌 ${lowerUsername.toUpperCase()}:`)
    for (const profile of profiles) {
      console.log(`   - ${profile.username} (score: ${profile.score}, userId: ${profile.userId}, scanned: ${profile.scannedAt})`)
    }
  }

  console.log('\n💡 To fix duplicates, you can:')
  console.log('   1. Delete the older/incorrect profiles')
  console.log('   2. Make username unique and case-insensitive in schema')
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

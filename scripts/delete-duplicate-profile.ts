import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const username = process.argv[2]

  if (!username) {
    console.log('Usage: tsx scripts/delete-duplicate-profile.ts <username>')
    console.log('Example: tsx scripts/delete-duplicate-profile.ts Goktugkrblt')
    process.exit(1)
  }

  console.log(`\n🔍 Looking for profile: ${username}`)

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      user: true
    }
  })

  if (!profile) {
    console.log(`❌ Profile not found: ${username}`)
    return
  }

  console.log(`\n📊 Profile Details:`)
  console.log(`   Username: ${profile.username}`)
  console.log(`   Score: ${profile.score}`)
  console.log(`   User ID: ${profile.userId || 'null (orphaned)'}`)
  console.log(`   Scanned At: ${profile.scannedAt}`)

  if (!profile.userId) {
    console.log(`\n⚠️  This is an orphaned profile (no associated user)`)
  }

  console.log(`\n🗑️  Deleting profile...`)

  await prisma.profile.delete({
    where: { username }
  })

  console.log(`✅ Profile deleted: ${username}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

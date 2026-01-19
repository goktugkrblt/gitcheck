import { PrismaClient, Plan } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const username = process.argv[2]
  const planArg = (process.argv[3] || 'PRO').toUpperCase()

  // Validate plan
  if (!['FREE', 'PRO'].includes(planArg)) {
    console.log('❌ Invalid plan. Must be FREE or PRO')
    process.exit(1)
  }

  const plan = planArg as Plan

  if (!username) {
    console.log('Usage: tsx scripts/update-user-plan.ts <username> [plan]')
    process.exit(1)
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { githubUsername: username },
        { email: { contains: username } }
      ]
    }
  })

  if (!user) {
    console.log(`❌ User not found: ${username}`)
    return
  }

  console.log(`📝 Found user: ${user.githubUsername} (${user.email})`)
  console.log(`   Current plan: ${user.plan}`)

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { plan: plan as Plan }
  })

  console.log(`✅ Updated ${updated.githubUsername} to ${plan} plan`)
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

import { PrismaClient } from '@prisma/client'
import { generateAIAnalysis } from '../lib/pro/generate-ai-analysis'

const prisma = new PrismaClient()

async function main() {
  const username = process.argv[2]

  if (!username) {
    console.log('Usage: tsx scripts/generate-ai-analysis.ts <username>')
    process.exit(1)
  }

  console.log(`\n🎯 Generating AI analysis for: ${username}`)

  // 1. Get profile
  const profile = await prisma.profile.findUnique({
    where: { username },
  })

  if (!profile) {
    console.log(`❌ Profile not found for: ${username}`)
    console.log('   User needs to scan their GitHub profile first')
    return
  }

  // 2. Check if PRO analysis exists
  const proAnalysisCache = (profile as any).proAnalysisCache

  if (!proAnalysisCache) {
    console.log(`❌ PRO analysis not found for: ${username}`)
    console.log('   PRO analysis must be generated first')
    return
  }

  console.log(`✅ Found PRO analysis cache`)

  // 3. Parse PRO data
  const proData = typeof proAnalysisCache === 'string'
    ? JSON.parse(proAnalysisCache)
    : proAnalysisCache

  console.log(`\n⏱️  Generating AI analysis... (this may take 15-30 seconds)`)

  // 4. Generate AI analysis
  const startTime = Date.now()
  const analysis = await generateAIAnalysis(username, proData)
  const duration = Date.now() - startTime

  console.log(`\n✅ AI Analysis generated in ${(duration / 1000).toFixed(2)}s`)
  console.log(`\n📝 Analysis length: ${analysis.length} characters`)

  // 5. Save to database
  await prisma.profile.update({
    where: { username },
    data: {
      aiAnalysisCache: analysis,
      lastAiAnalysisScan: new Date(),
    },
  })

  console.log(`✅ Saved to database for: ${username}`)
  console.log(`\n🎉 Done! AI analysis is now cached and ready to view.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('\n❌ Error:', e.message)
    await prisma.$disconnect()
    process.exit(1)
  })

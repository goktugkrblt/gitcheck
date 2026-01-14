// lib/pro/generate-ai-analysis.ts

import Anthropic from '@anthropic-ai/sdk';

interface ProAnalysisData {
  readmeQuality: {
    overallScore: number;
    grade: string;
    insights: {
      readability: number;
      completeness: number;
      professionalism: number;
    };
    details: {
      length: number;
      sections: number;
      badges: number;
      codeBlocks: number;
      links: number;
      images: number;
      tables: number;
    };
    strengths: string[];
    improvements: string[];
  };
  repoHealth: {
    overallScore: number;
    grade: string;
    metrics: {
      maintenance: {
        score: number;
        commitFrequency: number;
        lastCommitDays: number;
        activeDaysRatio: number;
      };
      issueManagement: {
        score: number;
        averageResolutionDays: number;
        openClosedRatio: number;
        totalIssues: number;
        closedIssues: number;
      };
      pullRequests: {
        score: number;
        mergeRate: number;
        averageMergeDays: number;
        totalPRs: number;
        mergedPRs: number;
      };
      activity: {
        score: number;
        contributorCount: number;
        staleBranches: number;
        stalePRs: number;
      };
    };
    insights: {
      strengths: string[];
      concerns: string[];
      recommendations: string[];
    };
  };
  devPatterns: {
    overallScore: number;
    grade: string;
    patterns: {
      commitPatterns: {
        score: number;
        peakHours: number[];
        peakDays: string[];
        consistency: number;
        commitMessageQuality: number;
      };
      codeQuality: {
        score: number;
        branchManagement: number;
        commitSize: number;
        reviewEngagement: number;
        documentationHabits: number;
      };
      workLifeBalance: {
        score: number;
        weekendActivity: number;
        nightCoding: number;
        burnoutRisk: number;
        sustainablePace: number;
      };
      collaboration: {
        score: number;
        soloVsTeam: number;
        prResponseTime: number;
        reviewParticipation: number;
        crossRepoWork: number;
      };
      technology: {
        score: number;
        modernFrameworks: number;
        cuttingEdge: number;
        legacyMaintenance: number;
        learningCurve: number;
      };
      productivity: {
        score: number;
        peakHours: number[];
        deepWorkSessions: number;
        contextSwitching: number;
        flowState: number;
      };
    };
    insights: {
      strengths: string[];
      patterns: string[];
      recommendations: string[];
    };
    developerPersona: string;
  };
  careerInsights: {
    overallScore: number;
    experienceLevel: string;
    skills: {
      technicalBreadth: number;
      documentation: number;
      collaboration: number;
      projectManagement: number;
      codeQuality: number;
      productivity: number;
    };
    professional: {
      portfolioStrength: number;
      marketValue: string;
      visibility: number;
      consistency: number;
    };
    profileType: string;
    strengths: string[];
    recommendations: string[];
    grade: string;
  };
}

export async function generateAIAnalysis(
  username: string,
  proData: ProAnalysisData
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  // ✅ ULTRA KISALTILMIŞ PROMPT - TAM ANALİZ GARANTİSİ
  // Extract rich context for personalization
  const persona = proData.devPatterns.developerPersona;
  const experienceLevel = proData.careerInsights.experienceLevel;
  const profileType = proData.careerInsights.profileType;
  const marketValue = proData.careerInsights.professional.marketValue;
  const peakHours = proData.devPatterns.patterns.commitPatterns.peakHours;
  const peakDays = proData.devPatterns.patterns.commitPatterns.peakDays;
  const burnoutRisk = proData.devPatterns.patterns.workLifeBalance.burnoutRisk;
  const consistency = proData.devPatterns.patterns.commitPatterns.consistency;

  const prompt = `You are analyzing the GitHub profile of **${username}**, a real developer with unique patterns and potential.

🎯 WHO IS ${username.toUpperCase()}?
━━━━━━━━━━━━━━━━━━━━━━━━
• Experience: ${experienceLevel} developer
• Profile: ${profileType}
• Work Style: ${persona}
• Market Positioning: ${marketValue}
• Peak Productivity: ${peakHours[0]}:00 on ${peakDays[0]}s
• Consistency: ${consistency}% active days
• Burnout Risk: ${burnoutRisk}%

📊 SKILL BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━
Technical Breadth: ${proData.careerInsights.skills.technicalBreadth}/10
Documentation: ${proData.careerInsights.skills.documentation}/10
Collaboration: ${proData.careerInsights.skills.collaboration}/10
Project Management: ${proData.careerInsights.skills.projectManagement}/10
Code Quality: ${proData.careerInsights.skills.codeQuality}/10
Productivity: ${proData.careerInsights.skills.productivity}/10

Overall Career Score: ${proData.careerInsights.overallScore}/10 (Grade: ${proData.careerInsights.grade})

🎨 COMPONENT SCORES:
━━━━━━━━━━━━━━━━━━━━━━━━
README Quality: ${proData.readmeQuality.overallScore}/10
Repository Health: ${proData.repoHealth.overallScore}/10
Developer Patterns: ${proData.devPatterns.overallScore}/10

Portfolio Strength: ${proData.careerInsights.professional.portfolioStrength}%
Visibility: ${proData.careerInsights.professional.visibility}%

💪 KEY STRENGTHS:
${proData.careerInsights.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

⚠️ CONCERNS & OPPORTUNITIES:
${proData.repoHealth.insights.concerns?.slice(0, 3).map((c, i) => `${i + 1}. ${c}`).join('\n') || 'No major concerns'}

---

🎯 YOUR MISSION:

Write a DEEPLY PERSONALIZED, ENGAGING analysis that makes ${username} feel SEEN and UNDERSTOOD.

TONE & STYLE:
• Address ${username} directly ("You", "Your")
• Reference their ${persona} style naturally
• Acknowledge their ${experienceLevel} journey
• Use their actual numbers and patterns
• Be encouraging but honest
• Make it feel like a 1-on-1 conversation with a senior dev who "gets them"

AVOID:
❌ Generic advice that could apply to anyone
❌ Robotic listing of stats
❌ Ignoring their unique ${profileType} profile
❌ Unrealistic goals
❌ Forgetting to reference their ${peakHours[0]}:00 peak hours or ${peakDays[0]} activity

INCLUDE:
✅ Specific references to THEIR numbers
✅ Personalized insights based on ${persona} style
✅ Realistic action items fitting their ${burnoutRisk}% burnout risk
✅ Concrete examples from their actual patterns
✅ Motivational but grounded career guidance

---

STRUCTURE (COMPLETE EVERYTHING - NO STOPPING):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 👋 Hey ${username},

[2-3 engaging paragraphs that:
• Acknowledge their ${persona} style
• Highlight their ${experienceLevel} journey
• Reference specific numbers (${consistency}% consistency, ${burnoutRisk}% burnout risk)
• Make them feel UNDERSTOOD
• Set the tone: "I analyzed your GitHub deeply, and here's what stands out..."]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 💪 Your Superpowers

### 1. [Biggest Strength from their data - with specific number]
**What this means:** [Explain the strength in their context]
**Real-world impact:** [How this helps them as a ${profileType}]
**How to leverage:** [Concrete way to use this strength more]

[Example: "Your 8.5/10 documentation score puts you in the top 15% of developers. For a ${profileType}, this is gold - it means teams trust your work documentation and onboarding becomes effortless."]

### 2. [Second strength - different category]
[Same deep dive format]

### 3. [Third strength]
[Same format]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 Growth Edges (Honest But Kind)

### 1. [Biggest improvement area with actual number]
**Current state:** [Their specific number/metric]
**Why this matters:** [Impact on their ${marketValue} positioning]
**Quick win (This week - 2-3 hours):**
1. [Specific actionable task]
2. [Another specific task]
3. [Measurement to track]

**Medium-term (Month 1-2):**
[Realistic steps that fit their ${burnoutRisk}% burnout risk and ${peakHours[0]}:00 schedule]

### 2. [Second opportunity]
[Same detailed format with their context]

### 3. [Third opportunity]
[Same format]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🗓️ Your 90-Day Personalized Roadmap

**Based on:** Your ${persona} style + ${consistency}% consistency + ${burnoutRisk}% burnout risk

### 🎯 Month 1: [Specific Theme Based on Their Data]
**Main Goal:** [Something achievable for their level]

**Week 1-2:**
- [ ] [Task tied to their lowest score] - Est. 3-4 hours
- [ ] [Task that leverages their strength] - Est. 2-3 hours
- [ ] [Task aligned with ${peakDays[0]} peak days] - Est. 1-2 hours

**Week 3-4:**
- [ ] [Progressive task] - Est. 4-5 hours
- [ ] [Another task fitting their ${profileType}] - Est. 2-3 hours

**Expected outcome:** [Concrete improvement with numbers]

### 🚀 Month 2: [Next theme]
[Same detailed week-by-week breakdown]

### 🏆 Month 3: [Final theme]
[Same format]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔥 This Week's Action Plan

**Time Budget:** 5-8 hours total (fits your ${burnoutRisk < 50 ? 'sustainable' : 'busy'} schedule)

### 1. [Highest ROI task from growth edges] - 2 hours
**What:** [Specific task]
**Why it matters:** [Direct benefit]
**How to do it:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Best time:** ${peakHours[0]}:00-${peakHours[0] + 2}:00 on ${peakDays[0]} (your peak hours!)

### 2. [Second priority] - 1.5 hours
[Same format]

### 3. [Third task] - 1 hour
[Same format]

### 4-5. [Two more quick wins]
[Brief format for each]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📊 Your Numbers vs. Market

| Skill | You | ${experienceLevel} Avg | Gap | Next Milestone |
|-------|-----|------------------------|-----|----------------|
| Technical Breadth | ${proData.careerInsights.skills.technicalBreadth}/10 | [realistic avg] | [+ or -] | [What to reach] |
| Documentation | ${proData.careerInsights.skills.documentation}/10 | [avg] | [gap] | [milestone] |
| Collaboration | ${proData.careerInsights.skills.collaboration}/10 | [avg] | [gap] | [milestone] |
| Code Quality | ${proData.careerInsights.skills.codeQuality}/10 | [avg] | [gap] | [milestone] |

**Market positioning:** ${marketValue} → [Next tier and what it takes]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

## 🎯 Final Thoughts, ${username}

[2-3 sentences that:
• Acknowledge their unique journey as a ${experienceLevel} ${profileType}
• Remind them of their ${persona} superpower
• Motivate them with specific next step
• Make it personal and memorable]

**Your first win:** [One specific action from This Week section]

**Next check-in:** 90 days - We'll track your ${consistency}% → [target]% consistency, skill improvements, and career momentum.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---

CRITICAL INSTRUCTIONS:
• WRITE EVERYTHING from "Hey ${username}" to "Next check-in"
• Use ALL their specific numbers (${consistency}%, ${burnoutRisk}%, ${peakHours[0]}:00, etc.)
• Reference ${persona}, ${profileType}, ${experienceLevel} naturally throughout
• Make it feel like a 1-on-1 with a senior dev mentor
• NO generic advice - ONLY personalized to their actual data
• COMPLETE ALL SECTIONS BEFORE ENDING
• DO NOT say "would you like" or "let me know" - JUST DELIVER THE FULL ANALYSIS`;

  try {
    console.log('🚀 Starting AI analysis with Haiku...');
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 8192,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const analysis = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    console.log('✅ Analysis generated!');
    console.log(`📊 ${analysis.length} chars | In: ${message.usage.input_tokens} | Out: ${message.usage.output_tokens}`);
    
    // ✅ Haiku Pricing: $0.25/M input, $1.25/M output
    const inputCost = (message.usage.input_tokens * 0.25) / 1000000;
    const outputCost = (message.usage.output_tokens * 1.25) / 1000000;
    const totalCost = inputCost + outputCost;
    
    console.log(`💰 Cost: $${totalCost.toFixed(4)} (~${(totalCost * 34).toFixed(2)} TL)`);

    // Check completeness
    const hasAllSections = 
      analysis.includes('Profile Analysis') &&
      analysis.includes('Technical Strengths') &&
      analysis.includes('Growth Opportunities') &&
      analysis.includes('90-Day Plan') &&
      analysis.includes('This Week') &&
      analysis.includes('Quick Stats') &&
      analysis.includes('Key Takeaways') &&
      analysis.includes('Next Review');

    if (!hasAllSections) {
      console.warn('⚠️ Some sections missing!');
    } else {
      console.log('✅ All sections present!');
    }

    if (analysis.includes('Would you like me to continue') || 
        analysis.includes('The rest of the document')) {
      console.error('❌ INCOMPLETE - Regenerating not allowed, but analysis is partial');
    }

    if (analysis.length < 2000) {
      console.warn('⚠️ Analysis too short:', analysis.length);
    }

    return analysis;
  } catch (error: any) {
    console.error('❌ AI Error:', error);
    throw new Error(error.message || 'Failed to generate AI analysis');
  }
}
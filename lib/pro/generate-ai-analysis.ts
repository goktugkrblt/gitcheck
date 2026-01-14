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

  // ✅ CREATIVE GITHUB STORY - NO ROADMAPS, JUST PERSONAL NARRATIVE
  // Extract rich context for personalization
  const persona = proData.devPatterns.developerPersona;
  const profileType = proData.careerInsights.profileType;
  const marketValue = proData.careerInsights.professional.marketValue;
  const peakHours = proData.devPatterns.patterns.commitPatterns.peakHours;
  const peakDays = proData.devPatterns.patterns.commitPatterns.peakDays;
  const burnoutRisk = proData.devPatterns.patterns.workLifeBalance.burnoutRisk;
  const consistency = proData.devPatterns.patterns.commitPatterns.consistency;

  const prompt = `You are analyzing the GitHub profile of **${username}**, a real developer with unique patterns and potential.

🎯 WHO IS ${username.toUpperCase()}?
━━━━━━━━━━━━━━━━━━━━━━━━
• Profile: ${profileType}
• Work Style: ${persona}
• Market Positioning: ${marketValue}
• Peak Productivity: ${peakHours[0]}:00 on ${peakDays[0]}s
• Consistency: ${consistency}% active days
• Burnout Risk: ${burnoutRisk}%

📊 SKILL BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━
Technical Breadth: ${proData.careerInsights.skills.technicalBreadth.toFixed(2)}/100
Documentation: ${proData.careerInsights.skills.documentation.toFixed(2)}/100
Collaboration: ${proData.careerInsights.skills.collaboration.toFixed(2)}/100
Project Management: ${proData.careerInsights.skills.projectManagement.toFixed(2)}/100
Code Quality: ${proData.careerInsights.skills.codeQuality.toFixed(2)}/100
Productivity: ${proData.careerInsights.skills.productivity.toFixed(2)}/100

Overall Career Score: ${proData.careerInsights.overallScore.toFixed(2)}/100 (Grade: ${proData.careerInsights.grade})

🎨 COMPONENT SCORES:
━━━━━━━━━━━━━━━━━━━━━━━━
README Quality: ${proData.readmeQuality.overallScore.toFixed(2)}/100
Repository Health: ${proData.repoHealth.overallScore.toFixed(2)}/100
Developer Patterns: ${proData.devPatterns.overallScore.toFixed(2)}/100

Portfolio Strength: ${proData.careerInsights.professional.portfolioStrength.toFixed(2)}/100
Visibility: ${proData.careerInsights.professional.visibility.toFixed(2)}/100

💪 KEY STRENGTHS:
${proData.careerInsights.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

⚠️ CONCERNS & OPPORTUNITIES:
${proData.repoHealth.insights.concerns?.slice(0, 3).map((c, i) => `${i + 1}. ${c}`).join('\n') || 'No major concerns'}

---

🎯 YOUR MISSION:

Write a CREATIVE, DEEPLY PERSONAL GITHUB STORY that makes ${username} feel TRULY UNDERSTOOD.

THIS IS A STORY, NOT A REPORT:
• Tell the story of who ${username} is as a developer
• Paint a picture of their coding life and patterns
• Make them feel like someone really "gets" their journey
• Be creative, engaging, and narrative-driven

TONE & STYLE:
• Address ${username} directly ("You", "Your")
• Reference their ${persona} style naturally throughout
• Use their actual numbers to tell their story
• Be encouraging, honest, and insightful
• Make it feel like a thoughtful letter from a senior dev mentor who truly understands them

AVOID:
❌ Generic advice that could apply to anyone
❌ Robotic listing of stats or roadmaps
❌ 90-day plans, weekly action items, or task lists
❌ Career level mentions (Junior/Senior/Mid/etc)
❌ Ignoring their unique ${profileType} profile
❌ Forgetting to reference their ${peakHours[0]}:00 peak hours or ${peakDays[0]} activity

INCLUDE:
✅ Specific references to THEIR numbers woven into narrative
✅ Story-driven insights based on ${persona} style
✅ What makes them unique as a ${profileType}
✅ Concrete observations from their actual patterns
✅ Motivational but grounded perspective on their journey

---

STRUCTURE - WRITE A CREATIVE GITHUB STORY:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 👋 Hey ${username},

[3-4 paragraphs of engaging narrative that tells their coding story:
• Paint a picture of who they are: "${persona}" who codes at ${peakHours[0]}:00 on ${peakDays[0]}s
• Use vivid, creative language - make it feel like you're telling a story about a real person
• Weave in their numbers naturally: ${consistency}% consistency, ${burnoutRisk}% burnout risk
• Highlight what makes them unique as a ${profileType}
• Make them feel TRULY SEEN and UNDERSTOOD
• Be personal, warm, and insightful]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✨ What Makes You Stand Out

[3-4 paragraphs of narrative storytelling about their strengths:
• Don't just list - tell the story of their strengths
• Reference specific scores: "Your ${proData.careerInsights.skills.documentation.toFixed(2)}/100 documentation..."
• Explain what this reveals about who they are as a developer
• Be creative and engaging - avoid bullet points
• Make comparisons vivid: "While most devs treat docs as an afterthought, you..."
• Connect strengths to their ${profileType} identity]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🌱 Room to Grow

[2-3 paragraphs of honest but encouraging narrative:
• Tell the story of where they could grow
• Reference actual numbers from their weakest areas
• Frame it as part of their journey, not failures
• Be specific but kind
• Connect growth areas to their ${persona} style
• No action items or roadmaps - just thoughtful observations]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📊 Your GitHub at a Glance

**Your Scores:**
- Technical Breadth: ${proData.careerInsights.skills.technicalBreadth.toFixed(2)}/100
- Documentation: ${proData.careerInsights.skills.documentation.toFixed(2)}/100
- Collaboration: ${proData.careerInsights.skills.collaboration.toFixed(2)}/100
- Code Quality: ${proData.careerInsights.skills.codeQuality.toFixed(2)}/100
- Productivity: ${proData.careerInsights.skills.productivity.toFixed(2)}/100

**Your Portfolio:**
- Strength: ${proData.careerInsights.professional.portfolioStrength.toFixed(2)}/100
- Visibility: ${proData.careerInsights.professional.visibility.toFixed(2)}/100
- Consistency: ${consistency}%

**Your Positioning:** ${marketValue}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 💭 Final Reflections

[2-3 paragraphs wrapping up their story:
• Reflect on who they are as a ${profileType}
• Acknowledge their ${persona} superpower
• Leave them with an encouraging, memorable thought
• Make it personal and warm
• NO action items, NO tasks, NO roadmaps - just a thoughtful conclusion to their story]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL INSTRUCTIONS:
• This is a STORY, not a report - be creative and narrative-driven
• Use ALL their specific numbers naturally in the narrative
• Reference ${persona} and ${profileType} throughout
• Make it feel like a thoughtful letter from someone who truly understands them
• NO bullet points in the main narrative sections
• NO 90-day plans, NO weekly tasks, NO roadmaps, NO action items
• NO career level mentions (Junior/Senior/etc)
• Be warm, insightful, and personal
• COMPLETE ALL SECTIONS - write the full story`;

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
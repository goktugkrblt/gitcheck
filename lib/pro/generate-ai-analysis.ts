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
  const prompt = `Technical analysis for ${username}

DATA: Tech ${proData.careerInsights.skills.technicalBreadth}/10 | Doc ${proData.careerInsights.skills.documentation}/10 | Collab ${proData.careerInsights.skills.collaboration}/10 | Quality ${proData.careerInsights.skills.codeQuality}/10 | Overall ${proData.careerInsights.overallScore}/10 (${proData.careerInsights.grade})

Profile: ${proData.careerInsights.profileType} | Style: ${proData.devPatterns.developerPersona} | Portfolio ${proData.careerInsights.professional.portfolioStrength}%

README ${proData.readmeQuality.overallScore}/10 | Health ${proData.repoHealth.overallScore}/10 | Patterns ${proData.devPatterns.overallScore}/10

Strengths: ${proData.careerInsights.strengths.join('; ')}

---

Write COMPLETE analysis. NO STOPPING. ALL SECTIONS.

RULES: No career levels. Global perspective. Use numbers. Natural tone. FINISH EVERYTHING.

---

STRUCTURE (WRITE ALL):

## 🎯 Profile Analysis
[2 paragraphs with numbers from data]

---

## 💪 Technical Strengths

### [Strength 1 - metric number]
[What it shows]
**Impact:** [Effect]
**Action:** [How to leverage]

### [Strength 2]
[Same]

### [Strength 3]
[Same]

---

## ⚡ Growth Opportunities

### 1. [Gap - metric]
**Current:** [Number]
**Why:** [Impact]
**Fix:** Week 1: [Task - Xh] | Week 2-4: [Steps]
**Measure:** [Success metric]

### 2. [Gap 2]
[Same]

### 3. [Gap 3]
[Same]

---

## 🗺️ 90-Day Plan

### Month 1
**Goal:** [Specific]
- [ ] [Task 1] - [Xh]
- [ ] [Task 2] - [Xh]
- [ ] [Task 3] - [Xh]
**Result:** [Outcome]

### Month 2
**Goal:** [Specific]
- [ ] [Task 1] - [Xh]
- [ ] [Task 2] - [Xh]
**Result:** [Outcome]

### Month 3
**Goal:** [Specific]
- [ ] [Task 1] - [Xh]
- [ ] [Task 2] - [Xh]
**Result:** [Outcome]

---

## 🎯 This Week (5 Actions)

### 1. [Action] - [Xh]
**What:** [Task]
**Why:** [Reason]
**How:** [3 steps]

### 2-5. [Same for all]

---

## 📊 Quick Stats

| Area | Score | Benchmark | Gap |
|------|-------|-----------|-----|
| Documentation | ${proData.careerInsights.skills.documentation}/10 | 6.5 | [analysis] |
| Code Quality | ${proData.careerInsights.skills.codeQuality}/10 | 6.0 | [analysis] |
| Collaboration | ${proData.careerInsights.skills.collaboration}/10 | 7.0 | [analysis] |

---

## 🎯 Key Takeaways

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]
- [Takeaway 4]

**Next Review:** 90 days - track [3 metrics]

---

WRITE COMPLETE NOW. DO NOT STOP UNTIL "Next Review". NO "would you like". WRITE IT ALL.`;

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
// lib/pro/analyze-all.ts
import { Octokit } from "@octokit/rest";
import { analyzeReadmeQuality } from "./readme-quality";
import { analyzeRepositoryHealth } from "./repo-health";
import { analyzeDeveloperPatterns } from "./dev-patterns";
import {
  generateReadmeInsights,
  generateRepoHealthInsights,
  generateDevPatternsInsights,
  generateCareerInsights,
} from "./insight-generator";

export interface CareerInsights {
  profileType: string;
  overallScore: number;
  grade: string;
  growth: {
    commitTrend: 'improving' | 'stable' | 'declining';
    skillDiversity: number;
    communityGrowth: 'improving' | 'stable' | 'declining';
  };
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
    marketValue: 'Entry' | 'Competitive' | 'High-Value' | 'Elite';
    visibility: number;
    consistency: number;
  };
  recommendations: string[];
  strengths: string[];
}

export async function analyzeAllPro(
  octokit: Octokit,
  username: string
) {
  const startTime = Date.now();
  console.log(`⏱️  [ANALYZE ALL] Starting comprehensive analysis for: ${username}`);
  console.log(`📊 [PROGRESS] Running 3 analyses in parallel...`);

  try {
    // 🚀 Run all analyses in parallel for max speed with progress tracking
    const readmePromise = analyzeReadmeQuality(octokit, username).then(result => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ✅ README Quality complete (${elapsed}s)`);
      return result;
    });

    const repoHealthPromise = analyzeRepositoryHealth(octokit, username).then(result => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ✅ Repository Health complete (${elapsed}s)`);
      return result;
    });

    const devPatternsPromise = analyzeDeveloperPatterns(octokit, username).then(result => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ✅ Developer Patterns complete (${elapsed}s)`);
      return result;
    });

    const [readmeQuality, repoHealth, devPatterns] = await Promise.all([
      readmePromise,
      repoHealthPromise,
      devPatternsPromise,
    ]);

    // 🎯 ENRICH WITH STORY-DRIVEN INSIGHTS
    console.log('📖 Generating story-driven insights...');

    // Enrich README insights
    const readmeInsights = generateReadmeInsights({
      overallScore: readmeQuality.overallScore,
      details: {
        length: readmeQuality.details.length,
        sections: readmeQuality.details.sections,
        badges: readmeQuality.details.badges,
        codeBlocks: readmeQuality.details.codeBlocks,
        links: readmeQuality.details.links,
        images: readmeQuality.details.images,
        toc: readmeQuality.details.toc,
      },
      insights: readmeQuality.insights,
    });

    // Enrich Repository Health insights
    const repoHealthInsights = generateRepoHealthInsights({
      overallScore: repoHealth.overallScore,
      metrics: repoHealth.metrics,
      trend: repoHealth.trend,
    });

    // Enrich Developer Patterns insights
    const devPatternsInsights = generateDevPatternsInsights({
      overallScore: devPatterns.overallScore,
      patterns: devPatterns.patterns,
      developerPersona: devPatterns.developerPersona,
    });

    // Calculate Career Insights from existing data (NO extra API calls!)
    const careerInsightsBase = calculateCareerInsights({
      readmeQuality,
      repoHealth,
      devPatterns,
      username
    });

    // Enrich Career Insights with story
    const careerInsightsEnriched = generateCareerInsights({
      overallScore: careerInsightsBase.overallScore,
      skills: careerInsightsBase.skills,
      professionalMetrics: {
        portfolioStrength: careerInsightsBase.professional.portfolioStrength,
        marketValue: careerInsightsBase.professional.marketValue,
        visibility: careerInsightsBase.professional.visibility,
        consistency: careerInsightsBase.professional.consistency,
      },
      profileType: careerInsightsBase.profileType,
    });

    // Merge enriched insights back
    const careerInsights = {
      ...careerInsightsBase,
      strengths: careerInsightsEnriched.strengths,
      recommendations: careerInsightsEnriched.recommendations,
    };

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [ANALYZE ALL] Complete in ${duration}s with enriched insights`);

    return {
      readmeQuality: {
        ...readmeQuality,
        strengths: readmeInsights.strengths,
        improvements: readmeInsights.improvements,
        story: readmeInsights.story,
      },
      repoHealth: {
        ...repoHealth,
        insights: {
          strengths: repoHealthInsights.strengths,
          concerns: repoHealthInsights.concerns,
          recommendations: repoHealthInsights.recommendations,
          story: repoHealthInsights.story,
        },
      },
      devPatterns: {
        ...devPatterns,
        insights: {
          strengths: devPatternsInsights.strengths,
          patterns: devPatternsInsights.patterns,
          recommendations: devPatternsInsights.recommendations,
          story: devPatternsInsights.story,
        },
      },
      careerInsights: {
        ...careerInsights,
        story: careerInsightsEnriched.story,
      },
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ [ANALYZE ALL] Failed after ${duration}s:`, error);
    throw error;
  }
}

// ==========================================
// CAREER INSIGHTS CALCULATOR - FIXED & ENHANCED
// ==========================================

function calculateCareerInsights(data: {
  readmeQuality: any;
  repoHealth: any;
  devPatterns: any;
  username: string;
}): CareerInsights {
  const { readmeQuality, repoHealth, devPatterns } = data;

  console.log('🔍 Calculating Career Insights...');

  // ==========================================
  // 1. EXTRACT REAL DATA (FIXED PATHS!)
  // ==========================================
  
  // ✅ Commit data from commitPatterns
  const commitPatterns = devPatterns.patterns?.commitPatterns || {};
  const consistency = commitPatterns.consistency || 0;
  const commitMessageQuality = commitPatterns.commitMessageQuality || 0;
  
  // ✅ Technology data
  const technology = devPatterns.patterns?.technology || {};
  const modernFrameworks = technology.modernFrameworks || 0;
  const cuttingEdge = technology.cuttingEdge || 0;
  const learningCurve = technology.learningCurve || 0;
  
  // ✅ Collaboration data
  const collaboration = devPatterns.patterns?.collaboration || {};
  const collaborationScore = collaboration.score || 0;
  const soloVsTeam = collaboration.soloVsTeam || 50;
  const reviewParticipation = collaboration.reviewParticipation || 0;
  
  // ✅ Code quality data
  const codeQuality = devPatterns.patterns?.codeQuality || {};
  const codeQualityScore = codeQuality.score || 0;
  const documentationHabits = codeQuality.documentationHabits || 0;
  
  // ✅ Productivity data
  const productivity = devPatterns.patterns?.productivity || {};
  const productivityScore = productivity.score || 0;
  const deepWorkSessions = productivity.deepWorkSessions || 0;
  const flowState = productivity.flowState || 0;
  
  // ✅ Work-life balance
  const workLifeBalance = devPatterns.patterns?.workLifeBalance || {};
  const burnoutRisk = workLifeBalance.burnoutRisk || 0;
  const sustainablePace = workLifeBalance.sustainablePace || 100;
  
  // ✅ Repository health
  const repoMetrics = repoHealth.metrics || {};
  const maintenance = repoMetrics.maintenance || {};
  const activity = repoMetrics.activity || {};

  // ==========================================
  // 2. EXPERIENCE POINTS CALCULATION
  // ==========================================

  let experiencePoints = 0;

  // Consistency score (daily commits)
  if (consistency >= 80) experiencePoints += 3;
  else if (consistency >= 60) experiencePoints += 2;
  else if (consistency >= 40) experiencePoints += 1;

  // Repository health (maintenance quality)
  if (repoHealth.overallScore >= 8) experiencePoints += 3;
  else if (repoHealth.overallScore >= 6) experiencePoints += 2;
  else if (repoHealth.overallScore >= 4) experiencePoints += 1;

  // Collaboration (team work)
  if (collaborationScore >= 7) experiencePoints += 3;
  else if (collaborationScore >= 5) experiencePoints += 2;
  else if (collaborationScore >= 3) experiencePoints += 1;

  // Technology adoption
  if (cuttingEdge >= 60) experiencePoints += 2;
  else if (modernFrameworks >= 70) experiencePoints += 1;

  // Code quality & documentation
  if (codeQualityScore >= 8 && documentationHabits >= 70) experiencePoints += 2;
  else if (codeQualityScore >= 6) experiencePoints += 1;

  // Leadership indicators
  const contributorCount = activity.contributorCount || 1;
  if (contributorCount >= 10) experiencePoints += 3;
  else if (contributorCount >= 5) experiencePoints += 2;
  else if (contributorCount >= 3) experiencePoints += 1;

  console.log(`  Experience Points: ${experiencePoints}/18`);

  // ==========================================
  // 3. PROFILE TYPE DETECTION
  // ==========================================
  
  let profileType = 'Generalist Developer';
  
  // Check developer persona from patterns
  const persona = devPatterns.developerPersona || '';
  
  if (soloVsTeam >= 80) {
    profileType = 'Solo Developer';
  } else if (collaborationScore >= 8 && contributorCount >= 5) {
    profileType = 'Open Source Contributor';
  } else if (documentationHabits >= 80 && readmeQuality.overallScore >= 8) {
    profileType = 'Documentation-Focused Engineer';
  } else if (modernFrameworks >= 80 && cuttingEdge >= 60) {
    profileType = 'Early Adopter / Tech Lead';
  } else if (deepWorkSessions >= 10 && flowState >= 80) {
    profileType = 'Deep Work Specialist';
  } else if (burnoutRisk < 30 && sustainablePace >= 80) {
    profileType = 'Sustainable Engineer';
  }
  
  // Add time-based modifier from persona
  if (persona.includes('Night Owl')) {
    profileType += ' (Night Owl)';
  } else if (persona.includes('Morning')) {
    profileType += ' (Early Bird)';
  }

  // ==========================================
  // 4. GROWTH TRAJECTORY
  // ==========================================
  
  const commitTrend = repoHealth.trend || 'stable';
  
  // Skill diversity based on technology adoption
  const skillDiversity = Math.round(
    (modernFrameworks * 0.4 + cuttingEdge * 0.3 + learningCurve * 0.3) / 10
  );
  
  // Community growth based on collaboration
  let communityGrowth: 'improving' | 'stable' | 'declining' = 'stable';
  if (collaborationScore >= 7 && reviewParticipation >= 60) {
    communityGrowth = 'improving';
  } else if (collaborationScore < 4 && reviewParticipation < 30) {
    communityGrowth = 'declining';
  }

  // ==========================================
  // 5. SKILL SCORES (0-100 scale with decimals)
  // ==========================================

  // Note: collaborationScore, codeQualityScore, productivityScore are NOW 0-100 from devPatterns
  const technicalBreadth = Math.round(
    (modernFrameworks * 0.4 + cuttingEdge * 0.3 + learningCurve * 0.3) * 100
  ) / 100;

  const documentation = readmeQuality.overallScore; // Already 0-100

  const collaborationSkill = collaborationScore; // Now 0-100

  const projectManagement = Math.round(
    (repoHealth.overallScore * 0.6 + (maintenance.score || 0) * 0.4) * 100
  ) / 100;

  const codeQualitySkill = codeQualityScore; // Now 0-100

  const productivitySkill = productivityScore; // Now 0-100

  // ==========================================
  // 6. OVERALL SCORE & GRADE (0-100)
  // ==========================================

  const overallScore = Math.round(
    (technicalBreadth * 0.20 +
     documentation * 0.15 +
     collaborationSkill * 0.20 +
     projectManagement * 0.20 +
     codeQualitySkill * 0.15 +
     productivitySkill * 0.10) * 100
  ) / 100;

  let grade = 'F';
  if (overallScore >= 95) grade = 'S';
  else if (overallScore >= 90) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 80) grade = 'A-';
  else if (overallScore >= 75) grade = 'B+';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 65) grade = 'B-';
  else if (overallScore >= 60) grade = 'C+';
  else if (overallScore >= 55) grade = 'C';
  else if (overallScore >= 50) grade = 'C-';
  else if (overallScore >= 40) grade = 'D';

  // ==========================================
  // 7. PROFESSIONAL METRICS
  // ==========================================
  
  // Portfolio Strength (0-100)
  const diversityScore = Math.min(technicalBreadth, 25);
  const consistencyScore = Math.min((consistency / 100) * 25, 25);
  const impactScore = Math.min((collaborationSkill / 100) * 25, 25);
  const visibilityScore = Math.min((documentation / 100) * 25, 25);

  const portfolioStrength = Math.round(
    (diversityScore + consistencyScore + impactScore + visibilityScore) * 100
  ) / 100;
  
  // Market Value
  let marketValue: 'Entry' | 'Competitive' | 'High-Value' | 'Elite' = 'Entry';

  if (experiencePoints >= 14 && overallScore >= 8.5) {
    marketValue = 'Elite';
  } else if (experiencePoints >= 10 && overallScore >= 7.5) {
    marketValue = 'High-Value';
  } else if (experiencePoints >= 6 || overallScore >= 6.5) {
    marketValue = 'Competitive';
  }
  
  // Visibility (GitHub presence) - 0-100
  const visibility = Math.round(
    (documentation * 0.3 +
     reviewParticipation * 0.3 +
     collaborationSkill * 0.4) * 100
  ) / 100;
  
  // Consistency (long-term commitment) - 0-100
  const consistencyMetric = Math.round(
    (consistency * 0.5 +
     (maintenance.activeDaysRatio || 0) * 0.3 +
     sustainablePace * 0.2) * 100
  ) / 100;

  // ==========================================
  // 8. STRENGTHS IDENTIFICATION
  // ==========================================
  
  const strengths: string[] = [];
  
  if (technicalBreadth >= 8) {
    strengths.push('🚀 Diverse technology stack with modern frameworks');
  }
  if (documentation >= 8) {
    strengths.push('📚 Exceptional documentation and communication skills');
  }
  if (collaborationSkill >= 8) {
    strengths.push('🤝 Strong collaboration and team contribution');
  }
  if (codeQualitySkill >= 8) {
    strengths.push('✨ High code quality with best practices');
  }
  if (productivitySkill >= 8) {
    strengths.push('⚡ Outstanding productivity and focus');
  }
  if (consistency >= 80) {
    strengths.push('📈 Highly consistent daily contribution pattern');
  }
  if (burnoutRisk < 30) {
    strengths.push('🌟 Sustainable work-life balance');
  }
  if (experiencePoints >= 10) {
    strengths.push('👔 Strong leadership and collaboration experience');
  }

  // ==========================================
  // 9. RECOMMENDATIONS
  // ==========================================
  
  const recommendations: string[] = [];
  
  // Technical breadth
  if (technicalBreadth < 6) {
    recommendations.push('📚 Expand your technology stack by learning modern frameworks');
  }
  if (cuttingEdge < 40 && modernFrameworks >= 60) {
    recommendations.push('🚀 Explore cutting-edge technologies to stay ahead');
  }
  
  // Documentation
  if (documentation < 6) {
    recommendations.push('📝 Improve documentation quality across your repositories');
  }
  if (documentationHabits < 50) {
    recommendations.push('📋 Add README files and documentation to more projects');
  }
  
  // Collaboration
  if (collaborationSkill < 5) {
    recommendations.push('🤝 Increase open source contributions and code reviews');
  }
  if (reviewParticipation < 40) {
    recommendations.push('👀 Participate more in pull request reviews');
  }
  
  // Code quality
  if (codeQualitySkill < 6) {
    recommendations.push('✨ Focus on code quality and best practices');
  }
  if (commitMessageQuality < 60) {
    recommendations.push('💬 Improve commit message quality with conventional commits');
  }
  
  // Project management
  if (projectManagement < 6) {
    recommendations.push('📊 Enhance project maintenance and issue management');
  }
  if ((maintenance.lastCommitDays || 0) > 30) {
    recommendations.push('⏰ Update repositories more frequently');
  }
  
  // Work-life balance
  if (burnoutRisk > 60) {
    recommendations.push('🌴 Consider work-life balance to prevent burnout');
  }
  
  // Visibility
  if (visibility < 50) {
    recommendations.push('🌐 Increase your visibility through better documentation and collaboration');
  }
  
  // Career advancement
  if (experiencePoints < 6 && overallScore >= 6) {
    recommendations.push('📈 Keep building your portfolio - you\'re making great progress');
  }
  if (experiencePoints >= 6 && experiencePoints < 10 && overallScore >= 7.5) {
    recommendations.push('🎯 Focus on leadership and mentoring to advance your career');
  }

  console.log(`  Overall Career Score: ${overallScore}/10 (${grade})`);
  console.log(`  Experience Points: ${experiencePoints}/18`);
  console.log(`  Profile Type: ${profileType}`);
  console.log(`  Market Value: ${marketValue}`);

  return {
    profileType,
    overallScore,
    grade,
    growth: {
      commitTrend,
      skillDiversity,
      communityGrowth,
    },
    skills: {
      technicalBreadth,
      documentation,
      collaboration: collaborationSkill,
      projectManagement,
      codeQuality: codeQualitySkill,
      productivity: productivitySkill,
    },
    professional: {
      portfolioStrength,
      marketValue,
      visibility,
      consistency: consistencyMetric,
    },
    recommendations,
    strengths,
  };
}
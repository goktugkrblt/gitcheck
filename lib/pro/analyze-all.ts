// lib/pro/analyze-all.ts
import { Octokit } from "@octokit/rest";
import { analyzeReadmeQuality } from "./readme-quality";
import { analyzeRepositoryHealth } from "./repo-health";
import { analyzeDeveloperPatterns } from "./dev-patterns";

export interface CareerInsights {
  experienceLevel: 'Junior' | 'Mid-Level' | 'Senior' | 'Staff+';
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

    // Calculate Career Insights from existing data (NO extra API calls!)
    const careerInsights = calculateCareerInsights({
      readmeQuality,
      repoHealth,
      devPatterns,
      username
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [ANALYZE ALL] Complete in ${duration}s`);

    return {
      readmeQuality,
      repoHealth,
      devPatterns,
      careerInsights,
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
  // 2. EXPERIENCE LEVEL CALCULATION
  // ==========================================
  
  let experienceLevel: CareerInsights['experienceLevel'] = 'Junior';
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
  
  // Assign level based on points
  if (experiencePoints >= 14) experienceLevel = 'Staff+';
  else if (experiencePoints >= 10) experienceLevel = 'Senior';
  else if (experiencePoints >= 6) experienceLevel = 'Mid-Level';
  else experienceLevel = 'Junior';

  console.log(`  Experience Points: ${experiencePoints}/18 → ${experienceLevel}`);

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
  // 5. SKILL SCORES (ENHANCED)
  // ==========================================
  
  const technicalBreadth = Math.round(
    (modernFrameworks * 0.4 + cuttingEdge * 0.3 + learningCurve * 0.3) / 10 * 10
  ) / 10;
  
  const documentation = readmeQuality.overallScore;
  
  const collaborationSkill = collaborationScore;
  
  const projectManagement = Math.round(
    (repoHealth.overallScore * 0.6 + (maintenance.score || 0) * 0.4) * 10
  ) / 10;
  
  const codeQualitySkill = codeQualityScore;
  
  const productivitySkill = productivityScore;

  // ==========================================
  // 6. OVERALL SCORE & GRADE
  // ==========================================
  
  const overallScore = Math.round(
    (technicalBreadth * 0.20 + 
     documentation * 0.15 + 
     collaborationSkill * 0.20 + 
     projectManagement * 0.20 +
     codeQualitySkill * 0.15 +
     productivitySkill * 0.10) * 10
  ) / 10;
  
  let grade = 'F';
  if (overallScore >= 9.5) grade = 'S';
  else if (overallScore >= 9.0) grade = 'A+';
  else if (overallScore >= 8.5) grade = 'A';
  else if (overallScore >= 8.0) grade = 'A-';
  else if (overallScore >= 7.5) grade = 'B+';
  else if (overallScore >= 7.0) grade = 'B';
  else if (overallScore >= 6.5) grade = 'B-';
  else if (overallScore >= 6.0) grade = 'C+';
  else if (overallScore >= 5.5) grade = 'C';
  else if (overallScore >= 5.0) grade = 'C-';
  else if (overallScore >= 4.0) grade = 'D';

  // ==========================================
  // 7. PROFESSIONAL METRICS
  // ==========================================
  
  // Portfolio Strength (0-100)
  const diversityScore = Math.min(technicalBreadth * 10, 25);
  const consistencyScore = Math.min((consistency / 100) * 25, 25);
  const impactScore = Math.min((collaborationSkill / 10) * 25, 25);
  const visibilityScore = Math.min((documentation / 10) * 25, 25);
  
  const portfolioStrength = Math.round(
    diversityScore + consistencyScore + impactScore + visibilityScore
  );
  
  // Market Value
  let marketValue: 'Entry' | 'Competitive' | 'High-Value' | 'Elite' = 'Entry';
  
  if (experienceLevel === 'Staff+' && overallScore >= 8.5) {
    marketValue = 'Elite';
  } else if (experienceLevel === 'Senior' && overallScore >= 7.5) {
    marketValue = 'High-Value';
  } else if (experienceLevel === 'Mid-Level' || overallScore >= 6.5) {
    marketValue = 'Competitive';
  }
  
  // Visibility (GitHub presence)
  const visibility = Math.round(
    (documentation * 0.3 + 
     (reviewParticipation / 100) * 0.3 + 
     (collaborationSkill / 10) * 0.4) * 100
  );
  
  // Consistency (long-term commitment)
  const consistencyMetric = Math.round(
    (consistency * 0.5 + 
     (maintenance.activeDaysRatio || 0) * 0.3 + 
     (sustainablePace / 100) * 0.2)
  );

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
  if (experienceLevel === 'Staff+' || experienceLevel === 'Senior') {
    strengths.push('👔 Senior-level experience and leadership');
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
  if (experienceLevel === 'Junior' && overallScore >= 6) {
    recommendations.push('📈 You\'re ready for Mid-Level roles - showcase your portfolio');
  }
  if (experienceLevel === 'Mid-Level' && overallScore >= 7.5) {
    recommendations.push('🎯 You\'re approaching Senior level - focus on leadership and mentoring');
  }

  console.log(`  Overall Career Score: ${overallScore}/10 (${grade})`);
  console.log(`  Experience Level: ${experienceLevel}`);
  console.log(`  Profile Type: ${profileType}`);
  console.log(`  Market Value: ${marketValue}`);

  return {
    experienceLevel,
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
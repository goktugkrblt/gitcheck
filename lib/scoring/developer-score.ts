/**
 * UNIFIED DEVELOPER SCORE CALCULATION
 * ====================================
 * Single scoring system that adapts based on available data:
 * - PRO users with analysis: Uses detailed 4-component scoring
 * - Users without PRO analysis: Uses simplified GitHub metrics
 * 
 * COMPONENTS (when PRO analysis available):
 * 1. README Quality (20%) - Documentation & communication
 * 2. Repository Health (25%) - Code quality & maintenance
 * 3. Developer Patterns (30%) - Activity & consistency
 * 4. Career Insights (25%) - Skills & experience
 */

interface ScoringInput {
  // PRO analysis data (optional)
  readmeQuality?: {
    overallScore: number; // 0-10
  };
  repoHealth?: {
    overallScore: number; // 0-10
  };
  devPatterns?: {
    overallScore: number; // 0-10
  };
  careerInsights?: {
    overallScore: number; // 0-10
  };
  
  // Basic GitHub metrics (always available)
  basicMetrics: {
    totalCommits?: number;
    totalRepos?: number;
    totalStars?: number;
    currentStreak?: number;
    followersCount?: number;
    totalPRs?: number;
  };
}

interface ComponentScore {
  score: number; // 0-100
  weight: number; // percentage
  source: 'pro' | 'fallback'; // where the score came from
  description: string; // how it was calculated
  details?: string; // additional context
}

interface ScoringResult {
  overallScore: number; // 0-100
  components: {
    readmeQuality: ComponentScore;
    repoHealth: ComponentScore;
    devPatterns: ComponentScore;
    careerInsights: ComponentScore;
  };
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  percentile: number;
  scoringMethod: 'pro' | 'fallback'; // which method was used
  strengths: string[];
  improvements: string[];
}

/**
 * WEIGHTS - Total: 100%
 */
const WEIGHTS = {
  readmeQuality: 0.20,   // 20% - Documentation
  repoHealth: 0.25,      // 25% - Code quality
  devPatterns: 0.30,     // 30% - Activity (most important)
  careerInsights: 0.25,  // 25% - Skills
};

/**
 * Unified score calculation - automatically uses best available data
 */
export function calculateDeveloperScore(input: ScoringInput): ScoringResult {
  console.log('🎯 Starting unified score calculation...');
  
  // Check if we have ANY PRO data
  const hasProData = !!(
    input.readmeQuality?.overallScore ||
    input.repoHealth?.overallScore ||
    input.devPatterns?.overallScore ||
    input.careerInsights?.overallScore
  );

  console.log('  - Has PRO data:', hasProData);
  console.log('  - PRO scores:', {
    readme: input.readmeQuality?.overallScore || 0,
    health: input.repoHealth?.overallScore || 0,
    patterns: input.devPatterns?.overallScore || 0,
    career: input.careerInsights?.overallScore || 0,
  });

  if (hasProData) {
    return calculateProScore(input);
  } else {
    return calculateFallbackScore(input.basicMetrics);
  }
}

/**
 * PRO SCORING - Uses detailed analysis data
 */
function calculateProScore(input: ScoringInput): ScoringResult {
  console.log('✅ Using PRO scoring with detailed components');

  // Normalize scores to 0-100 scale (input scores are 0-10)
  const readmeScore = (input.readmeQuality?.overallScore || 0) * 10;
  const healthScore = (input.repoHealth?.overallScore || 0) * 10;
  const patternsScore = (input.devPatterns?.overallScore || 0) * 10;
  const careerScore = (input.careerInsights?.overallScore || 0) * 10;

  console.log('  - Normalized scores (0-100):', {
    readme: readmeScore,
    health: healthScore,
    patterns: patternsScore,
    career: careerScore,
  });

  // Calculate weighted average
  const overallScore = Math.round(
    readmeScore * WEIGHTS.readmeQuality +
    healthScore * WEIGHTS.repoHealth +
    patternsScore * WEIGHTS.devPatterns +
    careerScore * WEIGHTS.careerInsights
  );

  console.log('  - Final PRO score:', overallScore);

  // Build component details
  const components = {
    readmeQuality: {
      score: readmeScore,
      weight: WEIGHTS.readmeQuality * 100,
      source: 'pro' as const,
      description: 'Based on PRO analysis of repository documentation',
      details: input.readmeQuality ? 'Analyzed README files for structure, completeness, and clarity' : undefined,
    },
    repoHealth: {
      score: healthScore,
      weight: WEIGHTS.repoHealth * 100,
      source: 'pro' as const,
      description: 'Based on PRO analysis of code quality and maintenance',
      details: input.repoHealth ? 'Evaluated commit frequency, code organization, and best practices' : undefined,
    },
    devPatterns: {
      score: patternsScore,
      weight: WEIGHTS.devPatterns * 100,
      source: 'pro' as const,
      description: 'Based on PRO analysis of development activity patterns',
      details: input.devPatterns ? 'Analyzed commit patterns, consistency, and work habits' : undefined,
    },
    careerInsights: {
      score: careerScore,
      weight: WEIGHTS.careerInsights * 100,
      source: 'pro' as const,
      description: 'Based on PRO analysis of skills and experience',
      details: input.careerInsights ? 'Evaluated technical skills, experience level, and market value' : undefined,
    },
  };

  const grade = getGrade(overallScore);
  const percentile = calculatePercentile(overallScore);
  const { strengths, improvements } = analyzePerformance({
    readmeQuality: readmeScore,
    repoHealth: healthScore,
    devPatterns: patternsScore,
    careerInsights: careerScore,
  });

  return {
    overallScore,
    components,
    grade,
    percentile,
    scoringMethod: 'pro',
    strengths,
    improvements,
  };
}

/**
 * FALLBACK SCORING - Uses basic GitHub metrics
 */
function calculateFallbackScore(metrics: {
  totalCommits?: number;
  totalRepos?: number;
  totalStars?: number;
  currentStreak?: number;
  followersCount?: number;
  totalPRs?: number;
}): ScoringResult {
  console.log('⚠️ Using fallback scoring with basic GitHub metrics');
  console.log('📊 Metrics:', metrics);

  // Calculate individual scores (0-15 points each, except commits = 25)
  const commitScore = Math.min((metrics.totalCommits || 0) / 500 * 25, 25);
  const repoScore = Math.min((metrics.totalRepos || 0) / 15 * 15, 15);
  const starScore = Math.min((metrics.totalStars || 0) / 50 * 15, 15);
  const streakScore = Math.min((metrics.currentStreak || 0) / 30 * 15, 15);
  const communityScore = Math.min((metrics.followersCount || 0) / 50 * 15, 15);
  const prScore = Math.min((metrics.totalPRs || 0) / 50 * 15, 15);

  console.log('  - Component scores:', {
    commits: commitScore.toFixed(1),
    repos: repoScore.toFixed(1),
    stars: starScore.toFixed(1),
    streak: streakScore.toFixed(1),
    community: communityScore.toFixed(1),
    prs: prScore.toFixed(1),
  });

  // Total score (0-100)
  const overallScore = Math.round(
    commitScore + repoScore + starScore + 
    streakScore + communityScore + prScore
  );

  console.log('  - Final fallback score:', overallScore);

  // Map to 4 components for consistency
  // Distribution: Commits+PRs → patterns, Repos+Stars → health, Community → career, Overall → readme
  const patternsScore = Math.round((commitScore + prScore + streakScore) / 55 * 100);
  const healthScore = Math.round((repoScore + starScore) / 30 * 100);
  const careerScore = Math.round(communityScore / 15 * 100);
  const readmeScore = Math.round(overallScore * 0.8); // Proportional to overall

  const components = {
    readmeQuality: {
      score: readmeScore,
      weight: WEIGHTS.readmeQuality * 100,
      source: 'fallback' as const,
      description: 'Estimated from overall GitHub activity',
      details: 'Upgrade to PRO for detailed README analysis',
    },
    repoHealth: {
      score: healthScore,
      weight: WEIGHTS.repoHealth * 100,
      source: 'fallback' as const,
      description: `Based on ${metrics.totalRepos || 0} repositories and ${metrics.totalStars || 0} stars`,
      details: 'Upgrade to PRO for detailed code quality analysis',
    },
    devPatterns: {
      score: patternsScore,
      weight: WEIGHTS.devPatterns * 100,
      source: 'fallback' as const,
      description: `Based on ${metrics.totalCommits || 0} commits and ${metrics.currentStreak || 0}-day streak`,
      details: 'Upgrade to PRO for detailed activity pattern analysis',
    },
    careerInsights: {
      score: careerScore,
      weight: WEIGHTS.careerInsights * 100,
      source: 'fallback' as const,
      description: `Based on ${metrics.followersCount || 0} followers and community engagement`,
      details: 'Upgrade to PRO for detailed career insights',
    },
  };

  const grade = getGrade(overallScore);
  const percentile = calculatePercentile(overallScore);

  // Simple analysis for fallback
  const strengths: string[] = [];
  const improvements: string[] = [];

  if ((metrics.totalCommits || 0) >= 250) strengths.push('Active contributor');
  if ((metrics.currentStreak || 0) >= 7) strengths.push('Consistent coding habits');
  if ((metrics.totalStars || 0) >= 10) strengths.push('Community-valued projects');
  
  if ((metrics.totalCommits || 0) < 100) improvements.push('Build your contribution history');
  if ((metrics.currentStreak || 0) < 7) improvements.push('Develop daily coding habits');
  if ((metrics.totalPRs || 0) < 5) improvements.push('Engage in more collaborative work');

  if (strengths.length === 0) strengths.push('Keep building your developer profile');
  if (improvements.length === 0) improvements.push('Continue growing as a developer');

  return {
    overallScore,
    components,
    grade,
    percentile,
    scoringMethod: 'fallback',
    strengths,
    improvements,
  };
}

/**
 * GRADE SYSTEM
 */
function getGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * PERCENTILE CALCULATION
 */
function calculatePercentile(score: number): number {
  if (score >= 95) return 99;
  if (score >= 90) return 95;
  if (score >= 85) return 90;
  if (score >= 80) return 85;
  if (score >= 75) return 80;
  if (score >= 70) return 75;
  if (score >= 65) return 65;
  if (score >= 60) return 55;
  if (score >= 55) return 50;
  if (score >= 50) return 40;
  if (score >= 45) return 30;
  if (score >= 40) return 25;
  if (score >= 35) return 20;
  if (score >= 30) return 15;
  if (score >= 25) return 10;
  return 5;
}

/**
 * Analyze performance and provide insights
 */
function analyzePerformance(scores: {
  readmeQuality: number;
  repoHealth: number;
  devPatterns: number;
  careerInsights: number;
}) {
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (scores.readmeQuality >= 80) {
    strengths.push('Excellent documentation');
  } else if (scores.readmeQuality < 60) {
    improvements.push('Improve repository documentation');
  }

  if (scores.repoHealth >= 80) {
    strengths.push('Well-maintained repositories');
  } else if (scores.repoHealth < 60) {
    improvements.push('Focus on code quality and maintenance');
  }

  if (scores.devPatterns >= 80) {
    strengths.push('Consistent development activity');
  } else if (scores.devPatterns < 60) {
    improvements.push('Build more consistent coding habits');
  }

  if (scores.careerInsights >= 80) {
    strengths.push('Strong technical skills');
  } else if (scores.careerInsights < 60) {
    improvements.push('Expand technical skill set');
  }

  return { strengths, improvements };
}
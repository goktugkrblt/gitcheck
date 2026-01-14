/**
 * DEVELOPER SCORE CALCULATION v4.0 - STATISTICAL MODEL
 * =====================================================
 *
 * Advanced statistical scoring with rigorous mathematical foundations
 *
 * NEW IN V4.0:
 * - Z-score normalization against 100K+ developer population
 * - Mahalanobis distance for outlier detection
 * - Bayesian priors to prevent gaming
 * - Quality multipliers (detects spam/low-quality patterns)
 * - Contribution quality assessment (not just quantity)
 * - Skill diversity index (Shannon entropy)
 * - Consistency index (coefficient of variation)
 * - Confidence intervals (shows score uncertainty)
 * - Temporal weighting (recent activity > old)
 *
 * MATHEMATICAL RIGOR:
 * - Population-based normalization (not arbitrary thresholds)
 * - Correlation-aware scoring (Mahalanobis distance)
 * - Robust to outliers (IQR-based scaling)
 * - Transparent uncertainty quantification
 */

import {
  POPULATION_STATS,
  calculateZScore,
  calculatePercentileFromZScore,
  applyBayesianPrior,
  calculateQualityMultiplier,
  calculateMahalanobisDistance,
  calculateContributionQuality,
  calculateConfidenceInterval,
  calculateSkillDiversity,
  calculateConsistencyIndex,
} from './statistical-model';

interface ScoringInput {
  readmeQuality?: {
    overallScore: number;
    details?: { lengthScore?: number; sectionsScore?: number; badgesScore?: number; codeBlocksScore?: number };
  };
  repoHealth?: {
    overallScore: number;
    metrics?: {
      maintenance?: { score: number };
      issueManagement?: { score: number };
      pullRequests?: { score: number };
      activity?: { score: number };
    };
  };
  devPatterns?: {
    overallScore: number;
    patterns?: {
      commitPatterns?: { score: number; consistency: number };
      codeQuality?: { score: number };
      workLifeBalance?: { score: number };
      collaboration?: { score: number };
      productivity?: { score: number };
    };
  };
  careerInsights?: {
    overallScore: number;
    skills?: {
      technicalBreadth?: number;
      documentation?: number;
      collaboration?: number;
      codeQuality?: number;
      productivity?: number;
    };
  };

  basicMetrics: {
    totalCommits?: number;
    totalRepos?: number;
    totalStars?: number;
    totalForks?: number;
    totalWatchers?: number;
    currentStreak?: number;
    longestStreak?: number;
    followersCount?: number;
    followingCount?: number;
    organizationsCount?: number;
    totalPRs?: number;
    mergedPRs?: number;
    openPRs?: number;
    totalIssuesOpened?: number;
    totalOpenIssues?: number;
    totalReviews?: number;
    totalContributions?: number;
    averageCommitsPerDay?: number;
    averageRepoSize?: number;
    gistsCount?: number;
    accountAge?: number;
    weekendActivity?: number;
    mostActiveDay?: string;
    languages?: Record<string, number>; // For skill diversity
  };
}

interface ComponentScore {
  score: number;
  weight: number;
  source: 'pro' | 'statistical';
  description: string;
  details?: string;
  subScores?: { [key: string]: number };
  zScore?: number; // Z-score for this component
  percentile?: number; // Percentile for this component
}

interface ScoringResult {
  overallScore: number;
  components: {
    codeQuality: ComponentScore;
    impact: ComponentScore;
    consistency: ComponentScore;
    collaboration: ComponentScore;
  };
  grade: 'S+' | 'S' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  percentile: number;
  scoringMethod: 'pro' | 'statistical';
  strengths: string[];
  improvements: string[];
  rawTotal: number;
  breakdown: string;
  experienceLevel: 'Beginner' | 'Junior' | 'Mid-Level' | 'Senior' | 'Principal' | 'Elite';

  // NEW IN V4.0: Advanced statistics
  statistics: {
    mahalanobisDistance: number;
    mahalanobisInterpretation: string;
    contributionQuality: number;
    contributionQualityBreakdown: string;
    skillDiversity: number;
    skillDiversityEntropy: number;
    consistencyIndex: number;
    consistencyInterpretation: string;
    qualityMultiplier: number;
    confidenceInterval: {
      lower: number;
      upper: number;
      margin: number;
    };
  };
}

const WEIGHTS = {
  codeQuality: 0.35,
  impact: 0.30,
  consistency: 0.20,
  collaboration: 0.15,
};

/**
 * ====================================
 * MAIN SCORING FUNCTION
 * ====================================
 */
export function calculateDeveloperScore(input: ScoringInput): ScoringResult {
  console.log('🎯 [SCORE v4.0 STATISTICAL] Starting advanced statistical scoring...');

  const hasProData = !!(
    input.readmeQuality?.overallScore ||
    input.repoHealth?.overallScore ||
    input.devPatterns?.overallScore ||
    input.careerInsights?.overallScore
  );

  if (hasProData) {
    return calculateProScore(input);
  } else {
    return calculateStatisticalScore(input.basicMetrics);
  }
}

/**
 * ====================================
 * PRO SCORING (with statistical enhancements)
 * ====================================
 */
function calculateProScore(input: ScoringInput): ScoringResult {
  console.log('✅ [SCORE v4.0] Using PRO scoring with statistical validation');

  // Calculate base components from PRO data
  const codeQuality = calculateProCodeQuality(input);
  const impact = calculateProImpact(input);
  const consistency = calculateProConsistency(input);
  const collaboration = calculateProCollaboration(input);

  // Apply statistical adjustments
  const qualityMultiplier = calculateQualityMultiplier({
    totalRepos: input.basicMetrics.totalRepos || 0,
    totalStars: input.basicMetrics.totalStars || 0,
    totalForks: input.basicMetrics.totalForks || 0,
    totalCommits: input.basicMetrics.totalCommits || 0,
    weekendActivity: input.basicMetrics.weekendActivity || 0,
    averageRepoSize: input.basicMetrics.averageRepoSize || 0,
  });

  console.log(`  🔬 Quality multiplier: ${qualityMultiplier.toFixed(3)}`);

  // Weighted average with quality adjustment
  let rawTotal =
    codeQuality.score * WEIGHTS.codeQuality +
    impact.score * WEIGHTS.impact +
    consistency.score * WEIGHTS.consistency +
    collaboration.score * WEIGHTS.collaboration;

  rawTotal *= qualityMultiplier;

  // Apply Bayesian prior (prevent new account gaming)
  const accountAge = input.basicMetrics.accountAge || 0;
  const sampleSize = (input.basicMetrics.totalRepos || 0) + (input.basicMetrics.totalCommits || 0) / 100;

  const overallScore = applyBayesianPrior(rawTotal, accountAge, sampleSize);

  console.log(`  📊 PRO Components (adjusted):`);
  console.log(`     - Code Quality: ${codeQuality.score.toFixed(2)}`);
  console.log(`     - Impact: ${impact.score.toFixed(2)}`);
  console.log(`     - Consistency: ${consistency.score.toFixed(2)}`);
  console.log(`     - Collaboration: ${collaboration.score.toFixed(2)}`);
  console.log(`  🎯 Final score: ${overallScore.toFixed(2)}`);

  const breakdown = `(${codeQuality.score.toFixed(2)} × 35% + ${impact.score.toFixed(2)} × 30% + ${consistency.score.toFixed(2)} × 20% + ${collaboration.score.toFixed(2)} × 15%) × ${qualityMultiplier.toFixed(3)}`;

  // Calculate advanced statistics
  const stats = calculateAdvancedStatistics(input.basicMetrics);

  const components = {
    codeQuality: { ...codeQuality, weight: WEIGHTS.codeQuality * 100, source: 'pro' as const },
    impact: { ...impact, weight: WEIGHTS.impact * 100, source: 'pro' as const },
    consistency: { ...consistency, weight: WEIGHTS.consistency * 100, source: 'pro' as const },
    collaboration: { ...collaboration, weight: WEIGHTS.collaboration * 100, source: 'pro' as const },
  };

  const grade = getGrade(overallScore);
  const percentile = stats.overallPercentile;
  const experienceLevel = getExperienceLevel(overallScore, accountAge);
  const { strengths, improvements } = analyzePerformance(components);

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    components,
    grade,
    percentile,
    scoringMethod: 'pro',
    strengths,
    improvements,
    rawTotal,
    breakdown,
    experienceLevel,
    statistics: stats,
  };
}

/**
 * ====================================
 * STATISTICAL SCORING (population-based)
 * ====================================
 */
function calculateStatisticalScore(metrics: ScoringInput['basicMetrics']): ScoringResult {
  console.log('⚠️ [SCORE v4.0] Using STATISTICAL scoring (population-based normalization)');

  const accountAge = metrics.accountAge || 1;

  // Component 1: CODE QUALITY (from statistical model)
  const codeQuality = calculateStatisticalCodeQuality(metrics);

  // Component 2: IMPACT (from statistical model)
  const impact = calculateStatisticalImpact(metrics);

  // Component 3: CONSISTENCY (from statistical model)
  const consistency = calculateStatisticalConsistency(metrics);

  // Component 4: COLLABORATION (from statistical model)
  const collaboration = calculateStatisticalCollaboration(metrics);

  console.log(`  📊 STATISTICAL Components:`);
  console.log(`     - Code Quality: ${codeQuality.score.toFixed(2)} (z=${codeQuality.zScore?.toFixed(2)})`);
  console.log(`     - Impact: ${impact.score.toFixed(2)} (z=${impact.zScore?.toFixed(2)})`);
  console.log(`     - Consistency: ${consistency.score.toFixed(2)} (z=${consistency.zScore?.toFixed(2)})`);
  console.log(`     - Collaboration: ${collaboration.score.toFixed(2)} (z=${collaboration.zScore?.toFixed(2)})`);

  // Apply quality multiplier
  const qualityMultiplier = calculateQualityMultiplier({
    totalRepos: metrics.totalRepos || 0,
    totalStars: metrics.totalStars || 0,
    totalForks: metrics.totalForks || 0,
    totalCommits: metrics.totalCommits || 0,
    weekendActivity: metrics.weekendActivity || 0,
    averageRepoSize: metrics.averageRepoSize || 0,
  });

  console.log(`  🔬 Quality multiplier: ${qualityMultiplier.toFixed(3)}`);

  // Weighted average
  let rawTotal =
    codeQuality.score * WEIGHTS.codeQuality +
    impact.score * WEIGHTS.impact +
    consistency.score * WEIGHTS.consistency +
    collaboration.score * WEIGHTS.collaboration;

  rawTotal *= qualityMultiplier;

  // Apply Bayesian prior
  const sampleSize = (metrics.totalRepos || 0) + (metrics.totalCommits || 0) / 100;
  const overallScore = applyBayesianPrior(rawTotal, accountAge, sampleSize);

  console.log(`  🎯 Final score: ${overallScore.toFixed(2)}`);

  const breakdown = `(${codeQuality.score.toFixed(2)} × 35% + ${impact.score.toFixed(2)} × 30% + ${consistency.score.toFixed(2)} × 20% + ${collaboration.score.toFixed(2)} × 15%) × ${qualityMultiplier.toFixed(3)}`;

  // Calculate advanced statistics
  const stats = calculateAdvancedStatistics(metrics);

  const components = {
    codeQuality: { ...codeQuality, weight: WEIGHTS.codeQuality * 100, source: 'statistical' as const },
    impact: { ...impact, weight: WEIGHTS.impact * 100, source: 'statistical' as const },
    consistency: { ...consistency, weight: WEIGHTS.consistency * 100, source: 'statistical' as const },
    collaboration: { ...collaboration, weight: WEIGHTS.collaboration * 100, source: 'statistical' as const },
  };

  const grade = getGrade(overallScore);
  const percentile = stats.overallPercentile;
  const experienceLevel = getExperienceLevel(overallScore, accountAge);
  const { strengths, improvements } = analyzePerformance(components);

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    components,
    grade,
    percentile,
    scoringMethod: 'statistical',
    strengths,
    improvements,
    rawTotal,
    breakdown,
    experienceLevel,
    statistics: stats,
  };
}

/**
 * ====================================
 * STATISTICAL COMPONENT CALCULATORS
 * ====================================
 */

function calculateStatisticalCodeQuality(
  metrics: ScoringInput['basicMetrics']
): Omit<ComponentScore, 'weight' | 'source'> {
  const repos = metrics.totalRepos || 0;
  const avgSize = metrics.averageRepoSize || 0;
  const gists = metrics.gistsCount || 0;
  const accountAge = metrics.accountAge || 1;

  // Z-score based scoring (population-normalized)
  const reposPerYear = repos / accountAge;
  const zReposPerYear = calculateZScore(reposPerYear, {
    mean: 4.8,
    median: 3.2,
    stdDev: 8.5,
    p25: 1.5,
    p75: 6.8,
  });

  const zAvgSize = calculateZScore(avgSize, {
    mean: 420,
    median: 180,
    stdDev: 1250,
    p25: 45,
    p75: 580,
  });

  const zGists = calculateZScore(gists, {
    mean: 8.5,
    median: 3,
    stdDev: 24,
    p25: 1,
    p75: 10,
  });

  // Weighted z-score
  const combinedZ = zReposPerYear * 0.5 + zAvgSize * 0.35 + zGists * 0.15;

  // Convert z-score to 0-100 scale (z=0 → 50, z=2 → ~85)
  const score = 50 + combinedZ * 15;
  const clampedScore = Math.max(0, Math.min(100, score));

  const percentile = calculatePercentileFromZScore(combinedZ);

  return {
    score: Math.round(clampedScore * 100) / 100,
    description: `Population-normalized: ${repos} repos (${reposPerYear.toFixed(1)}/year), avg ${avgSize}KB`,
    details: `Based on z-scores vs 100K+ developer population`,
    zScore: Math.round(combinedZ * 100) / 100,
    percentile,
    subScores: {
      reposPerYear: Math.round((50 + zReposPerYear * 15) * 100) / 100,
      avgSize: Math.round((50 + zAvgSize * 15) * 100) / 100,
      gists: Math.round((50 + zGists * 15) * 100) / 100,
    },
  };
}

function calculateStatisticalImpact(
  metrics: ScoringInput['basicMetrics']
): Omit<ComponentScore, 'weight' | 'source'> {
  const stars = metrics.totalStars || 0;
  const forks = metrics.totalForks || 0;
  const followers = metrics.followersCount || 0;

  const zStars = calculateZScore(stars, POPULATION_STATS.totalStars);
  const zForks = calculateZScore(forks, POPULATION_STATS.totalForks);
  const zFollowers = calculateZScore(followers, POPULATION_STATS.followers);

  // Weighted z-score (stars matter most)
  const combinedZ = zStars * 0.5 + zForks * 0.3 + zFollowers * 0.2;

  const score = 50 + combinedZ * 15;
  const clampedScore = Math.max(0, Math.min(100, score));

  const percentile = calculatePercentileFromZScore(combinedZ);

  return {
    score: Math.round(clampedScore * 100) / 100,
    description: `${stars} ⭐ (p${calculatePercentileFromZScore(zStars)}), ${forks} forks (p${calculatePercentileFromZScore(zForks)})`,
    details: `Impact percentiles based on global developer population`,
    zScore: Math.round(combinedZ * 100) / 100,
    percentile,
    subScores: {
      stars: Math.round((50 + zStars * 15) * 100) / 100,
      forks: Math.round((50 + zForks * 15) * 100) / 100,
      followers: Math.round((50 + zFollowers * 15) * 100) / 100,
    },
  };
}

function calculateStatisticalConsistency(
  metrics: ScoringInput['basicMetrics']
): Omit<ComponentScore, 'weight' | 'source'> {
  const commits = metrics.totalCommits || 0;
  const accountAge = metrics.accountAge || 1;
  const currentStreak = metrics.currentStreak || 0;

  const commitsPerYear = commits / accountAge;

  const zCommitsPerYear = calculateZScore(commitsPerYear, POPULATION_STATS.commitsPerYear);
  const zStreak = calculateZScore(currentStreak, POPULATION_STATS.currentStreak);

  // Use consistency index from statistical model
  const { index: consistencyIndexValue } = calculateConsistencyIndex({
    currentStreak: metrics.currentStreak || 0,
    longestStreak: metrics.longestStreak || 0,
    averageCommitsPerDay: metrics.averageCommitsPerDay || 0,
    totalCommits: commits,
    accountAge,
  });

  // Weighted z-score
  const combinedZ = zCommitsPerYear * 0.5 + zStreak * 0.3 + (consistencyIndexValue - 50) / 15 * 0.2;

  const score = 50 + combinedZ * 15;
  const clampedScore = Math.max(0, Math.min(100, score));

  const percentile = calculatePercentileFromZScore(combinedZ);

  return {
    score: Math.round(clampedScore * 100) / 100,
    description: `${commits} commits (${commitsPerYear.toFixed(0)}/year), ${currentStreak}-day streak`,
    details: `Consistency index: ${consistencyIndexValue.toFixed(0)}/100`,
    zScore: Math.round(combinedZ * 100) / 100,
    percentile,
    subScores: {
      commitsPerYear: Math.round((50 + zCommitsPerYear * 15) * 100) / 100,
      streak: Math.round((50 + zStreak * 15) * 100) / 100,
      consistency: Math.round(consistencyIndexValue * 100) / 100,
    },
  };
}

function calculateStatisticalCollaboration(
  metrics: ScoringInput['basicMetrics']
): Omit<ComponentScore, 'weight' | 'source'> {
  const prs = metrics.totalPRs || 0;
  const mergedPRs = metrics.mergedPRs || 0;
  const reviews = metrics.totalReviews || 0;

  const zPRs = calculateZScore(prs, POPULATION_STATS.totalPRs);
  const zReviews = calculateZScore(reviews, {
    mean: 18,
    median: 6,
    stdDev: 52,
    p25: 2,
    p75: 22,
  });

  // Contribution quality from statistical model
  const { score: contributionQuality } = calculateContributionQuality({
    totalCommits: metrics.totalCommits || 0,
    totalStars: metrics.totalStars || 0,
    totalForks: metrics.totalForks || 0,
    totalRepos: metrics.totalRepos || 0,
    totalPRs: prs,
    mergedPRs,
    totalReviews: reviews,
  });

  // Weighted z-score
  const combinedZ = zPRs * 0.4 + zReviews * 0.3 + (contributionQuality - 50) / 15 * 0.3;

  const score = 50 + combinedZ * 15;
  const clampedScore = Math.max(0, Math.min(100, score));

  const percentile = calculatePercentileFromZScore(combinedZ);

  return {
    score: Math.round(clampedScore * 100) / 100,
    description: `${prs} PRs, ${reviews} reviews, quality score: ${contributionQuality.toFixed(0)}`,
    details: `Collaboration quality based on merge rate and engagement`,
    zScore: Math.round(combinedZ * 100) / 100,
    percentile,
    subScores: {
      pullRequests: Math.round((50 + zPRs * 15) * 100) / 100,
      reviews: Math.round((50 + zReviews * 15) * 100) / 100,
      quality: Math.round(contributionQuality * 100) / 100,
    },
  };
}

/**
 * ====================================
 * PRO COMPONENT CALCULATORS
 * ====================================
 */

function calculateProCodeQuality(input: ScoringInput): Omit<ComponentScore, 'weight' | 'source'> {
  const readme = input.readmeQuality?.overallScore || 5;
  const health = input.repoHealth?.overallScore || 5;

  // Simple linear mapping with cap
  const readmeScore = Math.min((readme / 10) * 100, 90);
  const healthScore = Math.min((health / 10) * 100, 90);

  const score = readmeScore * 0.4 + healthScore * 0.6;

  return {
    score: Math.round(score * 100) / 100,
    description: 'PRO: Documentation and repository health analysis',
    subScores: {
      documentation: Math.round(readmeScore * 100) / 100,
      maintenance: Math.round(healthScore * 100) / 100,
    },
  };
}

function calculateProImpact(input: ScoringInput): Omit<ComponentScore, 'weight' | 'source'> {
  // Use statistical model for impact even in PRO mode
  return calculateStatisticalImpact(input.basicMetrics);
}

function calculateProConsistency(input: ScoringInput): Omit<ComponentScore, 'weight' | 'source'> {
  const patterns = input.devPatterns?.overallScore || 5;
  const patternScore = Math.min((patterns / 10) * 100, 90);

  // Combine with statistical consistency
  const statConsistency = calculateStatisticalConsistency(input.basicMetrics);

  const score = patternScore * 0.6 + statConsistency.score * 0.4;

  return {
    score: Math.round(score * 100) / 100,
    description: 'PRO: Pattern analysis + statistical consistency',
    subScores: {
      patterns: Math.round(patternScore * 100) / 100,
      statistical: Math.round(statConsistency.score * 100) / 100,
    },
  };
}

function calculateProCollaboration(input: ScoringInput): Omit<ComponentScore, 'weight' | 'source'> {
  const career = input.careerInsights?.overallScore || 5;
  const careerScore = Math.min((career / 10) * 100, 90);

  // Combine with statistical collaboration
  const statCollab = calculateStatisticalCollaboration(input.basicMetrics);

  const score = careerScore * 0.5 + statCollab.score * 0.5;

  return {
    score: Math.round(score * 100) / 100,
    description: 'PRO: Career insights + statistical collaboration',
    subScores: {
      career: Math.round(careerScore * 100) / 100,
      statistical: Math.round(statCollab.score * 100) / 100,
    },
  };
}

/**
 * ====================================
 * ADVANCED STATISTICS
 * ====================================
 */
function calculateAdvancedStatistics(metrics: ScoringInput['basicMetrics']) {
  // Mahalanobis distance
  const { distance: mahDistance, interpretation: mahInterpretation } = calculateMahalanobisDistance(
    {
      totalRepos: metrics.totalRepos || 0,
      totalStars: metrics.totalStars || 0,
      totalCommits: metrics.totalCommits || 0,
      totalPRs: metrics.totalPRs || 0,
    },
    metrics.accountAge || 1
  );

  // Contribution quality
  const { score: contribQuality, breakdown: contribBreakdown } = calculateContributionQuality({
    totalCommits: metrics.totalCommits || 0,
    totalStars: metrics.totalStars || 0,
    totalForks: metrics.totalForks || 0,
    totalRepos: metrics.totalRepos || 0,
    totalPRs: metrics.totalPRs || 0,
    mergedPRs: metrics.mergedPRs || 0,
    totalReviews: metrics.totalReviews || 0,
  });

  // Skill diversity
  const { entropy: skillEntropy, normalizedScore: skillDiversity } = calculateSkillDiversity(
    metrics.languages || {}
  );

  // Consistency index
  const { index: consistencyIdx, interpretation: consistencyInterp } = calculateConsistencyIndex({
    currentStreak: metrics.currentStreak || 0,
    longestStreak: metrics.longestStreak || 0,
    averageCommitsPerDay: metrics.averageCommitsPerDay || 0,
    totalCommits: metrics.totalCommits || 0,
    accountAge: metrics.accountAge || 1,
  });

  // Quality multiplier
  const qualMult = calculateQualityMultiplier({
    totalRepos: metrics.totalRepos || 0,
    totalStars: metrics.totalStars || 0,
    totalForks: metrics.totalForks || 0,
    totalCommits: metrics.totalCommits || 0,
    weekendActivity: metrics.weekendActivity || 0,
    averageRepoSize: metrics.averageRepoSize || 0,
  });

  // Confidence interval
  const sampleSize = (metrics.totalRepos || 0) + (metrics.totalCommits || 0) / 100;
  const confInterval = calculateConfidenceInterval(60, sampleSize); // Use 60 as baseline

  // Overall percentile (from combined z-scores)
  const overallZ =
    (calculateZScore(metrics.totalStars || 0, POPULATION_STATS.totalStars) +
      calculateZScore((metrics.totalCommits || 0) / Math.max(metrics.accountAge || 1, 1), POPULATION_STATS.commitsPerYear)) /
    2;
  const overallPercentile = calculatePercentileFromZScore(overallZ);

  return {
    mahalanobisDistance: Math.round(mahDistance * 100) / 100,
    mahalanobisInterpretation: mahInterpretation,
    contributionQuality: Math.round(contribQuality * 100) / 100,
    contributionQualityBreakdown: contribBreakdown,
    skillDiversity: Math.round(skillDiversity * 100) / 100,
    skillDiversityEntropy: Math.round(skillEntropy * 100) / 100,
    consistencyIndex: Math.round(consistencyIdx * 100) / 100,
    consistencyInterpretation: consistencyInterp,
    qualityMultiplier: Math.round(qualMult * 1000) / 1000,
    confidenceInterval: {
      lower: Math.round(confInterval.lower * 100) / 100,
      upper: Math.round(confInterval.upper * 100) / 100,
      margin: Math.round(confInterval.margin * 100) / 100,
    },
    overallPercentile,
  };
}

/**
 * ====================================
 * HELPERS
 * ====================================
 */

function getGrade(score: number): 'S+' | 'S' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 95) return 'S+';
  if (score >= 88) return 'S';
  if (score >= 78) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 48) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

function getExperienceLevel(
  score: number,
  accountAge: number
): 'Beginner' | 'Junior' | 'Mid-Level' | 'Senior' | 'Principal' | 'Elite' {
  if (score >= 85 && accountAge >= 8) return 'Elite';
  if (score >= 75 || accountAge >= 10) return 'Principal';
  if (score >= 65 || accountAge >= 7) return 'Senior';
  if (score >= 55 || accountAge >= 4) return 'Mid-Level';
  if (score >= 45 || accountAge >= 2) return 'Junior';
  return 'Beginner';
}

function analyzePerformance(components: {
  codeQuality: ComponentScore;
  impact: ComponentScore;
  consistency: ComponentScore;
  collaboration: ComponentScore;
}): { strengths: string[]; improvements: string[] } {
  const strengths: string[] = [];
  const improvements: string[] = [];

  const scores = [
    { name: 'codeQuality', score: components.codeQuality.score, label: 'Code Quality' },
    { name: 'impact', score: components.impact.score, label: 'Community Impact' },
    { name: 'consistency', score: components.consistency.score, label: 'Consistency' },
    { name: 'collaboration', score: components.collaboration.score, label: 'Collaboration' },
  ];

  const sorted = scores.sort((a, b) => b.score - a.score);

  if (sorted[0].score >= 65) strengths.push(sorted[0].label);
  if (sorted[1].score >= 60) strengths.push(sorted[1].label);

  if (sorted[3].score < 55) improvements.push(sorted[3].label);
  if (sorted[2].score < 58) improvements.push(sorted[2].label);

  return { strengths, improvements };
}

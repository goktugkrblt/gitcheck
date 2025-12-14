/**
 * PRECISION DEVELOPER SCORE CALCULATION v2.0
 * ==========================================
 * Enhanced scoring system with mathematical precision:
 * - Scores calculated to 2 decimal places (e.g., 56.23)
 * - Wider score distribution (20-95 range)
 * - Detailed component weighting with sub-metrics
 * - Non-linear scaling for better differentiation
 * 
 * SCORING PHILOSOPHY:
 * - Excellence is rare (90+ scores uncommon)
 * - Most developers fall in 40-70 range
 * - Each metric uses logarithmic/exponential curves
 * - Prevents score clustering around 55-60
 */

interface ScoringInput {
  // PRO analysis data (optional)
  readmeQuality?: {
    overallScore: number; // 0-10
    details?: {
      lengthScore?: number;
      sectionsScore?: number;
      badgesScore?: number;
      codeBlocksScore?: number;
    };
  };
  repoHealth?: {
    overallScore: number; // 0-10
    metrics?: {
      maintenance?: { score: number };
      issueManagement?: { score: number };
      pullRequests?: { score: number };
      activity?: { score: number };
    };
  };
  devPatterns?: {
    overallScore: number; // 0-10
    patterns?: {
      commitPatterns?: { score: number; consistency: number };
      codeQuality?: { score: number };
      workLifeBalance?: { score: number };
      collaboration?: { score: number };
      productivity?: { score: number };
    };
  };
  careerInsights?: {
    overallScore: number; // 0-10
    skills?: {
      technicalBreadth?: number;
      documentation?: number;
      collaboration?: number;
      codeQuality?: number;
      productivity?: number;
    };
    professional?: {
      portfolioStrength?: number;
      consistency?: number;
    };
  };
  
  // Basic GitHub metrics (always available)
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
  };
}

interface ComponentScore {
  score: number; // 0-100 with 2 decimals
  weight: number; // percentage
  source: 'pro' | 'fallback';
  description: string;
  details?: string;
  subScores?: { [key: string]: number }; // breakdown of component
}

interface ScoringResult {
  overallScore: number; // 0-100 with 2 decimals (e.g., 67.23)
  components: {
    readmeQuality: ComponentScore;
    repoHealth: ComponentScore;
    devPatterns: ComponentScore;
    careerInsights: ComponentScore;
  };
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  percentile: number;
  scoringMethod: 'pro' | 'fallback';
  strengths: string[];
  improvements: string[];
  rawTotal: number; // before any adjustments
  breakdown: string; // mathematical formula used
}

/**
 * COMPONENT WEIGHTS
 */
const WEIGHTS = {
  readmeQuality: 0.20,   // 20%
  repoHealth: 0.25,      // 25%
  devPatterns: 0.30,     // 30% (most important)
  careerInsights: 0.25,  // 25%
};

/**
 * Main scoring function with precision calculation
 */
export function calculateDeveloperScore(input: ScoringInput): ScoringResult {
  console.log('🎯 Starting precision score calculation...');
  
  const hasProData = !!(
    input.readmeQuality?.overallScore ||
    input.repoHealth?.overallScore ||
    input.devPatterns?.overallScore ||
    input.careerInsights?.overallScore
  );

  console.log('  - Has PRO data:', hasProData);

  if (hasProData) {
    return calculatePrecisionProScore(input);
  } else {
    return calculatePrecisionFallbackScore(input.basicMetrics);
  }
}

/**
 * PRO SCORING with mathematical precision
 */
function calculatePrecisionProScore(input: ScoringInput): ScoringResult {
  console.log('✅ Using PRECISION PRO scoring');

  // README Quality: Enhanced with sub-metrics
  const readmeScore = calculateReadmeScore(input.readmeQuality);
  
  // Repository Health: Non-linear scaling
  const healthScore = calculateHealthScore(input.repoHealth);
  
  // Developer Patterns: Most complex (30% weight)
  const patternsScore = calculatePatternsScore(input.devPatterns);
  
  // Career Insights: Professional assessment
  const careerScore = calculateCareerScore(input.careerInsights);

  console.log('  📊 Component scores:', {
    readme: readmeScore.score,
    health: healthScore.score,
    patterns: patternsScore.score,
    career: careerScore.score,
  });

  // Calculate weighted average with 2 decimal precision
  const rawTotal = 
    readmeScore.score * WEIGHTS.readmeQuality +
    healthScore.score * WEIGHTS.repoHealth +
    patternsScore.score * WEIGHTS.devPatterns +
    careerScore.score * WEIGHTS.careerInsights;

  // Round to 2 decimals
  const overallScore = Math.round(rawTotal * 100) / 100;

  console.log('  🎯 Final PRECISION score:', overallScore);

  const breakdown = `(${readmeScore.score.toFixed(2)} × 20%) + (${healthScore.score.toFixed(2)} × 25%) + (${patternsScore.score.toFixed(2)} × 30%) + (${careerScore.score.toFixed(2)} × 25%)`;

  // Build components with sub-score details
  const components = {
    readmeQuality: {
      ...readmeScore,
      weight: WEIGHTS.readmeQuality * 100,
      source: 'pro' as const,
      description: `Documentation & README quality across ${input.basicMetrics?.totalRepos || 0} repositories`,
    },
    repoHealth: {
      ...healthScore,
      weight: WEIGHTS.repoHealth * 100,
      source: 'pro' as const,
      description: `Code maintenance, PR workflow, and repository activity patterns`,
    },
    devPatterns: {
      ...patternsScore,
      weight: WEIGHTS.devPatterns * 100,
      source: 'pro' as const,
      description: `Coding consistency, commit patterns, and work habits analysis`,
    },
    careerInsights: {
      ...careerScore,
      weight: WEIGHTS.careerInsights * 100,
      source: 'pro' as const,
      description: `Professional profile, skills diversity, and community engagement`,
    },
  };

  const grade = getGrade(overallScore);
  const percentile = calculatePercentile(overallScore);
  const { strengths, improvements } = analyzePerformance({
    readmeQuality: readmeScore.score,
    repoHealth: healthScore.score,
    devPatterns: patternsScore.score,
    careerInsights: careerScore.score,
  });

  return {
    overallScore,
    components,
    grade,
    percentile,
    scoringMethod: 'pro',
    strengths,
    improvements,
    rawTotal,
    breakdown,
  };
}

/**
 * README QUALITY: LINEAR MAPPING (REALISTIC)
 * Direct conversion: 0-10 → 0-100 with aggressive caps
 * Junior (8.4/10): ~50-55
 * Senior (9.5/10): ~70-75
 */
function calculateReadmeScore(data?: ScoringInput['readmeQuality']): Omit<ComponentScore, 'weight' | 'source' | 'description'> {
  if (!data?.overallScore) {
    return {
      score: 25.00,
      details: 'No README analysis available',
    };
  }

  const baseScore = data.overallScore; // 0-10 from PRO

  // ✅ SIMPLE LINEAR: base × 10, then cap aggressively
  // 4.8 → 48, 6.6 → 66, 7.0 → 70, 8.4 → 84
  let score = baseScore * 10;
  
  // ✅ AGGRESSIVE CAPS for junior/mid developers
  // If score from PRO is inflated, we cap it hard
  if (baseScore < 6.0) score = Math.min(score, 45); // Junior cap
  else if (baseScore < 7.5) score = Math.min(score, 58); // Mid cap
  else if (baseScore < 8.5) score = Math.min(score, 68); // Senior cap
  else if (baseScore < 9.5) score = Math.min(score, 78); // Expert cap
  
  score = Math.min(score, 85); // Absolute maximum
  
  // ✅ NO BONUSES - score is score
  const finalScore = Math.round(score * 100) / 100;

  return {
    score: finalScore,
    details: `Documentation quality (capped)`,
    subScores: data.details ? {
      length: data.details.lengthScore || 0,
      sections: data.details.sectionsScore || 0,
      badges: data.details.badgesScore || 0,
      codeBlocks: data.details.codeBlocksScore || 0,
    } : undefined,
  };
}

/**
 * REPOSITORY HEALTH: LINEAR (SIMPLE)
 * 4.8/10 → 48 → cap at 40
 */
function calculateHealthScore(data?: ScoringInput['repoHealth']): Omit<ComponentScore, 'weight' | 'source' | 'description'> {
  if (!data?.overallScore) {
    return {
      score: 20.00,
      details: 'No repository health data',
    };
  }

  const baseScore = data.overallScore; // 0-10

  // Simple: base × 10
  let score = baseScore * 10;
  
  // Aggressive caps
  if (baseScore < 5.0) score = Math.min(score, 38);
  else if (baseScore < 6.5) score = Math.min(score, 52);
  else if (baseScore < 8.0) score = Math.min(score, 65);
  else if (baseScore < 9.0) score = Math.min(score, 75);
  
  score = Math.min(score, 82);

  // Small penalties for bad maintenance
  if (data.metrics?.maintenance && data.metrics.maintenance.score < 3) {
    score -= 5;
  }

  const finalScore = Math.max(15, Math.round(score * 100) / 100);

  return {
    score: finalScore,
    details: `Health metrics with maintenance focus`,
    subScores: data.metrics ? {
      maintenance: data.metrics.maintenance?.score || 0,
      issues: data.metrics.issueManagement?.score || 0,
      prs: data.metrics.pullRequests?.score || 0,
      activity: data.metrics.activity?.score || 0,
    } : undefined,
  };
}

/**
 * DEVELOPER PATTERNS: LINEAR (30% weight)
 * 7.0/10 → 70 → cap at 60
 */
function calculatePatternsScore(data?: ScoringInput['devPatterns']): Omit<ComponentScore, 'weight' | 'source' | 'description'> {
  if (!data?.overallScore) {
    return {
      score: 30.00,
      details: 'No pattern analysis available',
    };
  }

  const baseScore = data.overallScore; // 0-10

  // Simple: base × 10
  let score = baseScore * 10;
  
  // Aggressive caps
  if (baseScore < 6.0) score = Math.min(score, 48);
  else if (baseScore < 7.5) score = Math.min(score, 62);
  else if (baseScore < 8.5) score = Math.min(score, 72);
  else if (baseScore < 9.5) score = Math.min(score, 82);
  
  score = Math.min(score, 88);

  // Penalty for low consistency
  if (data.patterns?.commitPatterns?.consistency && data.patterns.commitPatterns.consistency < 20) {
    score -= 8;
  }

  const finalScore = Math.max(25, Math.round(score * 100) / 100);

  return {
    score: finalScore,
    details: `Activity patterns (capped)`,
    subScores: data.patterns ? {
      commits: data.patterns.commitPatterns?.score || 0,
      quality: data.patterns.codeQuality?.score || 0,
      balance: data.patterns.workLifeBalance?.score || 0,
      collab: data.patterns.collaboration?.score || 0,
      productivity: data.patterns.productivity?.score || 0,
    } : undefined,
  };
}

/**
 * CAREER INSIGHTS: LINEAR
 * 6.6/10 → 66 → cap at 55
 */
function calculateCareerScore(data?: ScoringInput['careerInsights']): Omit<ComponentScore, 'weight' | 'source' | 'description'> {
  if (!data?.overallScore) {
    return {
      score: 38.00,
      details: 'No career insights available',
    };
  }

  const baseScore = data.overallScore; // 0-10

  // Simple: base × 10
  let score = baseScore * 10;
  
  // Aggressive caps
  if (baseScore < 6.0) score = Math.min(score, 45);
  else if (baseScore < 7.5) score = Math.min(score, 60);
  else if (baseScore < 8.5) score = Math.min(score, 72);
  else if (baseScore < 9.5) score = Math.min(score, 82);
  
  score = Math.min(score, 88);

  const finalScore = Math.max(22, Math.round(score * 100) / 100);

  return {
    score: finalScore,
    details: `Career assessment (capped)`,
    subScores: data.skills ? {
      breadth: data.skills.technicalBreadth || 0,
      docs: data.skills.documentation || 0,
      quality: data.skills.codeQuality || 0,
      productivity: data.skills.productivity || 0,
    } : undefined,
  };
}

/**
 * FALLBACK SCORING: ULTRA STRICT - Realistic for actual GitHub usage
 * Uses logarithmic scaling with VERY HIGH bars for good scores
 * 
 * REALISTIC RANGES:
 * - Beginner (0-2 years, <10 repos): 25-38
 * - Junior (2-4 years, 10-25 repos): 40-52  
 * - Mid (4-7 years, 25-50 repos): 55-68
 * - Senior (7+ years, 50+ repos): 70-82
 * - Elite (exceptional): 85-92
 */
function calculatePrecisionFallbackScore(metrics: ScoringInput['basicMetrics']): ScoringResult {
  console.log('⚠️ Using ULTRA STRICT fallback scoring');
  console.log('📊 All metrics:', metrics);

  // ========================================
  // COMPONENT 1: README QUALITY (VERY STRICT)
  // ========================================
  const repoCount = metrics.totalRepos || 0;
  const avgRepoSize = metrics.averageRepoSize || 0;
  const gists = metrics.gistsCount || 0;
  
  // ✅ ULTRA STRICT: Base score muy bajo para juniors
  // Formula: 18 + log(repos + 1) × 8
  // 0 repos → 18, 5 repos → 32, 10 repos → 37, 25 repos → 48
  let readmeScore = 18 + Math.min(Math.log(repoCount + 1) * 8, 28);
  
  // Bonuses - MUY DIFÍCIL de conseguir
  if (avgRepoSize > 1000) readmeScore += 4; // Was 5, now needs 1MB+
  else if (avgRepoSize > 500) readmeScore += 2; // Was 3
  
  // Gists bonus - casi nada
  readmeScore += Math.min(Math.log(gists + 1) * 1.5, 5); // Was ×2, max 8
  
  // Junior cap - no puede pasar de 48
  if (repoCount < 15) readmeScore = Math.min(readmeScore, 48);
  readmeScore = Math.min(readmeScore, 75); // Hard cap
  
  // ========================================
  // COMPONENT 2: REPOSITORY HEALTH (ULTRA STRICT)
  // ========================================
  const stars = metrics.totalStars || 0;
  const forks = metrics.totalForks || 0;
  const watchers = metrics.totalWatchers || 0;
  const prs = metrics.totalPRs || 0;
  const merged = metrics.mergedPRs || 0;
  const openPRs = metrics.openPRs || 0;
  const openIssues = metrics.totalOpenIssues || 0;
  const reviews = metrics.totalReviews || 0;
  
  let healthScore = 15; // Muy bajo base
  
  // Stars - LOGARITHMIC con umbral MUY ALTO
  // 0→15, 5→28, 10→34, 50→51, 100→60
  healthScore += Math.min(Math.log(stars + 1) * 6, 18); // Was ×8, max 20
  
  // Forks - menos importante
  healthScore += Math.min(Math.log(forks + 1) * 3.5, 8); // Was ×5, max 12
  
  // Watchers - casi nada
  healthScore += Math.min(Math.log(watchers + 1) * 2, 5); // Was ×3, max 8
  
  // PR merge rate - CRÍTICO pero poca gente tiene PRs
  const mergeRate = prs > 5 ? (merged / prs) * 100 : 40; // Solo cuenta si >5 PRs
  healthScore += Math.min(mergeRate * 0.18, 12); // Was ×0.25, max 15
  
  // PR management - penaliza backlog
  if (openPRs > 0 && openPRs < 8 && prs > 10) healthScore += 2; // Was any openPRs
  if (openPRs > 25) healthScore -= 4; // Was >20, -3
  
  // Issue management - más estricto
  if (openIssues < 3 && repoCount > 5) healthScore += 2; // Was <5
  if (openIssues > 40) healthScore -= 3; // Was >30, -2
  
  // Code reviews - LOGARITHMIC
  healthScore += Math.min(Math.log(reviews + 1) * 3, 8); // Was ×4, max 10
  
  // Junior cap - máximo 42 para <15 repos
  if (repoCount < 15) healthScore = Math.min(healthScore, 42);
  if (stars < 20) healthScore = Math.min(healthScore, 50);
  healthScore = Math.max(15, Math.min(healthScore, 78));
  
  // ========================================
  // COMPONENT 3: DEVELOPER PATTERNS (MOST STRICT - 30%)
  // ========================================
  const commits = metrics.totalCommits || 0;
  const streak = metrics.currentStreak || 0;
  const longestStreak = metrics.longestStreak || 0;
  const avgCommitsPerDay = metrics.averageCommitsPerDay || 0;
  const weekendActivity = metrics.weekendActivity || 0;
  const contributions = metrics.totalContributions || 0;
  
  let patternsScore = 22; // MUY bajo base
  
  // Commit volume - ULTRA LOGARITHMIC
  // 0→22, 100→38, 300→47, 500→52, 1000→59, 3000→70
  patternsScore += Math.min(Math.log(commits + 1) * 7.5, 32); // Was ×10, max 30
  
  // Current streak - DURO
  patternsScore += Math.min(streak * 0.9, 10); // Was ×1.2, max 12
  
  // Longest streak - menos peso
  patternsScore += Math.min(longestStreak * 0.3, 8); // Was ×0.4, max 10
  
  // Daily average - MUY ESTRICTO
  if (avgCommitsPerDay >= 5) patternsScore += 5; // Was >=3
  else if (avgCommitsPerDay >= 3) patternsScore += 3; // Was >=1.5
  else if (avgCommitsPerDay >= 1.5) patternsScore += 1.5; // Was >=0.5, +1
  
  // Weekend activity - balance (no es bueno trabajar MUCHO fin de semana)
  if (weekendActivity > 15 && weekendActivity < 40) patternsScore += 2.5; // Was 20-50, +3
  if (weekendActivity > 60) patternsScore -= 1; // Burnout warning
  
  // Total contributions - LOGARITHMIC
  patternsScore += Math.min(Math.log(contributions + 1) * 4, 10); // Was ×5, max 12
  
  // Junior cap - máximo 48 para <500 commits
  if (commits < 500) patternsScore = Math.min(patternsScore, 48);
  if (commits < 200) patternsScore = Math.min(patternsScore, 38);
  patternsScore = Math.max(22, Math.min(patternsScore, 82));
  
  // ========================================
  // COMPONENT 4: CAREER INSIGHTS (STRICT)
  // ========================================
  const followers = metrics.followersCount || 0;
  const following = metrics.followingCount || 0;
  const orgs = metrics.organizationsCount || 0;
  const age = metrics.accountAge || 0;
  const issues = metrics.totalIssuesOpened || 0;
  
  let careerScore = 20; // Bajo base
  
  // Followers - LOGARITHMIC con techo bajo
  // 0→20, 10→35, 50→50, 100→57, 500→73
  careerScore += Math.min(Math.log(followers + 1) * 8, 20); // Was ×10, max 22
  
  // Following ratio - penaliza follow spam
  const followRatio = followers > 0 ? following / followers : 1;
  if (followRatio < 1.5 && followers > 20) careerScore += 3; // Was <2, >10
  if (followRatio > 5) careerScore -= 2; // Spammer
  
  // Organizations - menos importante
  careerScore += Math.min(orgs * 3, 10); // Was ×4, max 12
  
  // Account age - MÁS REALISTA
  // 1 year → 23, 3 years → 27, 5 years → 30, 10 years → 35
  careerScore += Math.min(age * 0.5, 14); // Was ×0.7, max 16
  
  // Issues - LOGARITHMIC
  careerScore += Math.min(Math.log(issues + 1) * 5, 8); // Was ×6, max 10
  
  // External PRs estimate
  const externalPRs = Math.max(0, prs - repoCount * 2);
  if (externalPRs > 20) careerScore += 4; // Was >10
  else if (externalPRs > 10) careerScore += 2; // Was >5
  
  // Junior cap - máximo 45 para age<5
  if (age < 5) careerScore = Math.min(careerScore, 45);
  if (followers < 30) careerScore = Math.min(careerScore, 52);
  careerScore = Math.max(20, Math.min(careerScore, 78));

  console.log('  📊 Detailed component calculations:', {
    readme: {
      base: 25,
      repoCount: repoCount,
      avgSize: avgRepoSize,
      gists: gists,
      final: readmeScore.toFixed(2),
    },
    health: {
      base: 25,
      stars: stars,
      forks: forks,
      mergeRate: mergeRate.toFixed(1) + '%',
      reviews: reviews,
      final: healthScore.toFixed(2),
    },
    patterns: {
      base: 30,
      commits: commits,
      streak: streak,
      avgPerDay: avgCommitsPerDay?.toFixed(2),
      contributions: contributions,
      final: patternsScore.toFixed(2),
    },
    career: {
      base: 28,
      followers: followers,
      orgs: orgs,
      age: age + ' years',
      final: careerScore.toFixed(2),
    },
  });

  // Calculate weighted average
  const rawTotal =
    readmeScore * WEIGHTS.readmeQuality +
    healthScore * WEIGHTS.repoHealth +
    patternsScore * WEIGHTS.devPatterns +
    careerScore * WEIGHTS.careerInsights;

  const overallScore = Math.round(rawTotal * 100) / 100;

  const breakdown = `(${readmeScore.toFixed(2)} × 20%) + (${healthScore.toFixed(2)} × 25%) + (${patternsScore.toFixed(2)} × 30%) + (${careerScore.toFixed(2)} × 25%)`;

  console.log('  🎯 Final fallback score:', overallScore);
  console.log('  📐 Breakdown:', breakdown);

  const components = {
    readmeQuality: {
      score: Math.round(readmeScore * 100) / 100,
      weight: WEIGHTS.readmeQuality * 100,
      source: 'fallback' as const,
      description: `Estimated from ${repoCount} repos, ${gists} gists`,
      details: 'Upgrade to PRO for detailed README analysis',
      subScores: {
        repoCount,
        avgRepoSize,
        gists,
      },
    },
    repoHealth: {
      score: Math.round(healthScore * 100) / 100,
      weight: WEIGHTS.repoHealth * 100,
      source: 'fallback' as const,
      description: `Based on ${stars} stars, ${forks} forks, ${mergeRate.toFixed(0)}% merge rate`,
      details: 'Upgrade to PRO for detailed health metrics',
      subScores: {
        stars,
        forks,
        watchers,
        mergeRate: Math.round(mergeRate * 100) / 100,
        reviews,
      },
    },
    devPatterns: {
      score: Math.round(patternsScore * 100) / 100,
      weight: WEIGHTS.devPatterns * 100,
      source: 'fallback' as const,
      description: `${commits} commits, ${streak}-day streak, ${avgCommitsPerDay?.toFixed(1) || 0}/day avg`,
      details: 'Upgrade to PRO for pattern analysis',
      subScores: {
        commits,
        currentStreak: streak,
        longestStreak,
        avgCommitsPerDay: avgCommitsPerDay || 0,
        weekendActivity: weekendActivity || 0,
        contributions,
      },
    },
    careerInsights: {
      score: Math.round(careerScore * 100) / 100,
      weight: WEIGHTS.careerInsights * 100,
      source: 'fallback' as const,
      description: `${followers} followers, ${orgs} orgs, ${age} years experience`,
      details: 'Upgrade to PRO for career insights',
      subScores: {
        followers,
        following,
        orgs,
        accountAge: age,
        issues,
      },
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
    scoringMethod: 'fallback',
    strengths,
    improvements,
    rawTotal,
    breakdown,
  };
}

/**
 * GRADE CALCULATION
 */
function getGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

/**
 * PERCENTILE CALCULATION
 * Based on normal distribution assumption
 */
function calculatePercentile(score: number): number {
  // Assuming mean = 55, std dev = 15
  // This creates realistic percentiles
  const mean = 55;
  const stdDev = 15;
  const z = (score - mean) / stdDev;
  
  // Approximate percentile from z-score
  // Using error function approximation
  const percentile = Math.round(50 * (1 + erf(z / Math.sqrt(2))));
  
  return Math.max(1, Math.min(99, percentile));
}

// Error function approximation
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

/**
 * PERFORMANCE ANALYSIS
 */
function analyzePerformance(scores: {
  readmeQuality: number;
  repoHealth: number;
  devPatterns: number;
  careerInsights: number;
}): { strengths: string[]; improvements: string[] } {
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Identify strengths (top 2 scores)
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  
  if (sortedScores[0][1] >= 70) {
    strengths.push(getStrengthMessage(sortedScores[0][0]));
  }
  if (sortedScores[1][1] >= 65) {
    strengths.push(getStrengthMessage(sortedScores[1][0]));
  }

  // Identify improvements (bottom 2 scores)
  if (sortedScores[3][1] < 50) {
    improvements.push(getImprovementMessage(sortedScores[3][0]));
  }
  if (sortedScores[2][1] < 55) {
    improvements.push(getImprovementMessage(sortedScores[2][0]));
  }

  return { strengths, improvements };
}

function getStrengthMessage(component: string): string {
  const messages: { [key: string]: string } = {
    readmeQuality: 'Excellent documentation skills',
    repoHealth: 'Well-maintained repositories',
    devPatterns: 'Consistent development activity',
    careerInsights: 'Strong professional profile',
  };
  return messages[component] || 'Strong performance';
}

function getImprovementMessage(component: string): string {
  const messages: { [key: string]: string } = {
    readmeQuality: 'Improve documentation quality',
    repoHealth: 'Focus on repository maintenance',
    devPatterns: 'Build more consistent coding habits',
    careerInsights: 'Expand professional presence',
  };
  return messages[component] || 'Room for improvement';
}
/**
 * DEVELOPER SCORE CALCULATION
 * ============================
 * Combines data from all PRO features into a comprehensive developer score (0-100)
 * 
 * COMPONENTS:
 * 1. README Quality (20%) - Documentation & communication
 * 2. Repository Health (25%) - Code quality & maintenance
 * 3. Developer Patterns (30%) - Activity & consistency
 * 4. Career Insights (25%) - Skills & experience
 */

interface ScoringInput {
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
  }
  
  interface ScoringResult {
    overallScore: number; // 0-100
    breakdown: {
      readmeQuality: number;
      repoHealth: number;
      devPatterns: number;
      careerInsights: number;
    };
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    percentile: number;
    strengths: string[];
    improvements: string[];
  }
  
  /**
   * WEIGHTS - Total: 100%
   */
  const WEIGHTS = {
    readmeQuality: 0.20,   // 20% - Documentation
    repoHealth: 0.25,      // 25% - Code quality
    devPatterns: 0.30,     // 30% - Activity (en önemli)
    careerInsights: 0.25,  // 25% - Skills
  };
  
  /**
   * Calculate comprehensive developer score
   */
  export function calculateDeveloperScore(input: ScoringInput): ScoringResult {
    // Normalize scores to 0-100 scale (input'lar 0-10)
    const scores = {
      readmeQuality: (input.readmeQuality?.overallScore || 0) * 10,
      repoHealth: (input.repoHealth?.overallScore || 0) * 10,
      devPatterns: (input.devPatterns?.overallScore || 0) * 10,
      careerInsights: (input.careerInsights?.overallScore || 0) * 10,
    };
  
    // Calculate weighted average
    const overallScore = Math.round(
      scores.readmeQuality * WEIGHTS.readmeQuality +
      scores.repoHealth * WEIGHTS.repoHealth +
      scores.devPatterns * WEIGHTS.devPatterns +
      scores.careerInsights * WEIGHTS.careerInsights
    );
  
    // Calculate grade
    const grade = getGrade(overallScore);
  
    // Calculate percentile (based on score distribution)
    const percentile = calculatePercentile(overallScore);
  
    // Identify strengths and improvements
    const { strengths, improvements } = analyzePerformance(scores);
  
    return {
      overallScore,
      breakdown: scores,
      grade,
      percentile,
      strengths,
      improvements,
    };
  }
  
  /**
   * GRADE SYSTEM
   * S: 95-100 (Elite)
   * A: 85-94  (Excellent)
   * B: 70-84  (Good)
   * C: 55-69  (Average)
   * D: 40-54  (Below Average)
   * F: 0-39   (Needs Work)
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
   * Based on normal distribution curve
   * 
   * Score -> Percentile mapping:
   * 95+ -> 99th percentile (top 1%)
   * 85+ -> 90th percentile (top 10%)
   * 70+ -> 75th percentile (top 25%)
   * 55+ -> 50th percentile (median)
   * 40+ -> 25th percentile
   * <40 -> <25th percentile
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
  
    // README Quality
    if (scores.readmeQuality >= 80) {
      strengths.push('Excellent documentation');
    } else if (scores.readmeQuality < 60) {
      improvements.push('Improve repository documentation');
    }
  
    // Repo Health
    if (scores.repoHealth >= 80) {
      strengths.push('Well-maintained repositories');
    } else if (scores.repoHealth < 60) {
      improvements.push('Focus on code quality and maintenance');
    }
  
    // Dev Patterns
    if (scores.devPatterns >= 80) {
      strengths.push('Consistent development activity');
    } else if (scores.devPatterns < 60) {
      improvements.push('Build more consistent coding habits');
    }
  
    // Career Insights
    if (scores.careerInsights >= 80) {
      strengths.push('Strong technical skills');
    } else if (scores.careerInsights < 60) {
      improvements.push('Expand technical skill set');
    }
  
    return { strengths, improvements };
  }
  
  /**
   * FALLBACK SCORING (when PRO data not available)
   * Uses basic GitHub metrics
   * 
   * SCORING LOGIC:
   * - Commits: Up to 25 points (1000+ commits = max)
   * - Repos: Up to 15 points (30+ repos = max)
   * - Stars: Up to 15 points (200+ stars = max)
   * - Streak: Up to 15 points (60+ day streak = max)
   * - Community: Up to 15 points (100+ followers = max)
   * - PRs: Up to 15 points (100+ PRs = max)
   * Total: 100 points
   */
  export function calculateBasicScore(profileData: any): ScoringResult {
    const {
      totalCommits = 0,
      totalRepos = 0,
      totalStars = 0,
      currentStreak = 0,
      followersCount = 0,
      totalPRs = 0,
    } = profileData;
  
    // More balanced scoring (total: 100 points)
    const commitScore = Math.min((totalCommits / 1000) * 25, 25); // Max 25
    const repoScore = Math.min((totalRepos / 30) * 15, 15);       // Max 15
    const starScore = Math.min((totalStars / 200) * 15, 15);      // Max 15
    const streakScore = Math.min((currentStreak / 60) * 15, 15);  // Max 15
    const communityScore = Math.min((followersCount / 100) * 15, 15); // Max 15
    const prScore = Math.min((totalPRs / 100) * 15, 15);          // Max 15
  
    const overallScore = Math.round(
      commitScore + repoScore + starScore + streakScore + communityScore + prScore
    );
  
    return {
      overallScore,
      breakdown: {
        readmeQuality: 0,
        repoHealth: 0,
        devPatterns: overallScore, // Put all score in devPatterns for simplicity
        careerInsights: 0,
      },
      grade: getGrade(overallScore),
      percentile: calculatePercentile(overallScore),
      strengths: getBasicStrengths(profileData),
      improvements: ['Upgrade to PRO for detailed insights based on code quality, repo health, and career analysis'],
    };
  }
  
  /**
   * Identify strengths from basic metrics
   */
  function getBasicStrengths(profileData: any): string[] {
    const strengths: string[] = [];
    
    if (profileData.totalCommits > 500) {
      strengths.push('Active contributor');
    }
    
    if (profileData.totalStars > 50) {
      strengths.push('Popular repositories');
    }
    
    if (profileData.currentStreak > 7) {
      strengths.push('Consistent coding habit');
    }
    
    if (profileData.followersCount > 20) {
      strengths.push('Growing community presence');
    }
    
    if (profileData.totalPRs > 20) {
      strengths.push('Strong collaboration skills');
    }
    
    // Fallback
    if (strengths.length === 0) {
      strengths.push('Building GitHub presence');
    }
    
    return strengths.slice(0, 3); // Max 3 strengths
  }
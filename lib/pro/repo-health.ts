// lib/pro/repo-health.ts - OPTIMIZED
import { Octokit } from "@octokit/rest";

export async function analyzeRepositoryHealth(
  octokit: Octokit,
  username: string
): Promise<{
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
  story?: string;
  trend: 'improving' | 'stable' | 'declining';
}> {
  const startTime = Date.now();
  console.log(`⏱️  [REPO HEALTH] Starting analysis for: ${username}`);

  try {
    const reposResponse = await octokit.request('GET /users/{username}/repos', {
      username,
      per_page: 100,
      sort: 'updated',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const repos = reposResponse.data.filter((repo: any) => !repo.fork);

    if (repos.length === 0) {
      throw new Error('No repositories found');
    }

    // 🚀 SMART SAMPLING: Sadece ilk 10 repo
    const primaryRepos = repos.slice(0, 10);

    // ==========================================
    // 1. MAINTENANCE SCORE (OPTIMIZED)
    // ==========================================

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let totalCommits = 0;
    let recentCommits = 0;
    let activeDays = new Set<string>();
    let lastCommitDate = new Date(0);

    for (const repo of primaryRepos) {
      try {
        const commitsResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/commits',
          {
            owner: username,
            repo: repo.name,
            since: sixMonthsAgo.toISOString(),
            per_page: 50,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        const commits = commitsResponse.data;
        totalCommits += commits.length;

        commits.forEach((commit: any) => {
          const commitDate = new Date(commit.commit.author.date);
          recentCommits++;

          const dayKey = commitDate.toISOString().split('T')[0];
          activeDays.add(dayKey);

          if (commitDate > lastCommitDate) {
            lastCommitDate = commitDate;
          }
        });
      } catch (error) {
        continue;
      }
    }

    const weeksInPeriod = 26;
    const commitFrequency = recentCommits / weeksInPeriod;
    const lastCommitDays = Math.floor((Date.now() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));
    const activeDaysRatio = (activeDays.size / 180) * 100;

    let maintenanceScore = 0;
    
    if (commitFrequency >= 10) maintenanceScore += 40;
    else if (commitFrequency >= 5) maintenanceScore += 30;
    else if (commitFrequency >= 2) maintenanceScore += 20;
    else if (commitFrequency >= 1) maintenanceScore += 10;
    
    if (lastCommitDays <= 7) maintenanceScore += 30;
    else if (lastCommitDays <= 14) maintenanceScore += 25;
    else if (lastCommitDays <= 30) maintenanceScore += 20;
    else if (lastCommitDays <= 60) maintenanceScore += 10;
    
    if (activeDaysRatio >= 30) maintenanceScore += 30;
    else if (activeDaysRatio >= 20) maintenanceScore += 20;
    else if (activeDaysRatio >= 10) maintenanceScore += 10;

    console.log(`  ⏱️  [Maintenance] ${((Date.now() - startTime) / 1000).toFixed(2)}s - Score: ${maintenanceScore}/100`);

    // ==========================================
    // 2. ISSUE MANAGEMENT SCORE (OPTIMIZED)
    // ==========================================
    
    const t2 = Date.now();
    let totalIssues = 0;
    let closedIssues = 0;
    let totalResolutionTime = 0;
    let resolvedIssuesCount = 0;

    for (const repo of primaryRepos.slice(0, 5)) {
      try {
        const closedIssuesResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/issues',
          {
            owner: username,
            repo: repo.name,
            state: 'closed',
            per_page: 30,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        const closed = closedIssuesResponse.data.filter((issue: any) => !issue.pull_request);
        closedIssues += closed.length;

        closed.forEach((issue: any) => {
          if (issue.closed_at && issue.created_at) {
            const created = new Date(issue.created_at).getTime();
            const closedAt = new Date(issue.closed_at).getTime();
            const resolutionDays = (closedAt - created) / (1000 * 60 * 60 * 24);
            totalResolutionTime += resolutionDays;
            resolvedIssuesCount++;
          }
        });

        const openIssuesResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/issues',
          {
            owner: username,
            repo: repo.name,
            state: 'open',
            per_page: 30,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        const open = openIssuesResponse.data.filter((issue: any) => !issue.pull_request);
        totalIssues += open.length + closed.length;
      } catch (error) {
        continue;
      }
    }

    const averageResolutionDays = resolvedIssuesCount > 0 
      ? totalResolutionTime / resolvedIssuesCount 
      : 0;
    const openClosedRatio = totalIssues > 0 
      ? (closedIssues / totalIssues) * 100 
      : 100;

    let issueScore = 0;
    
    if (averageResolutionDays === 0) issueScore += 25;
    else if (averageResolutionDays <= 7) issueScore += 50;
    else if (averageResolutionDays <= 14) issueScore += 40;
    else if (averageResolutionDays <= 30) issueScore += 30;
    else if (averageResolutionDays <= 60) issueScore += 20;
    
    if (openClosedRatio >= 80) issueScore += 50;
    else if (openClosedRatio >= 60) issueScore += 40;
    else if (openClosedRatio >= 40) issueScore += 30;
    else if (openClosedRatio >= 20) issueScore += 20;

    console.log(`  ⏱️  [Issue Management] ${((Date.now() - t2) / 1000).toFixed(2)}s - Score: ${issueScore}/100`);

    // ==========================================
    // 3. PULL REQUEST SCORE (OPTIMIZED)
    // ==========================================
    
    const t3 = Date.now();
    let totalPRs = 0;
    let mergedPRs = 0;
    let totalMergeTime = 0;
    let mergedPRsCount = 0;

    for (const repo of primaryRepos.slice(0, 5)) {
      try {
        const prsResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/pulls',
          {
            owner: username,
            repo: repo.name,
            state: 'all',
            per_page: 30,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        const prs = prsResponse.data;
        totalPRs += prs.length;

        prs.forEach((pr: any) => {
          if (pr.merged_at) {
            mergedPRs++;
            const created = new Date(pr.created_at).getTime();
            const merged = new Date(pr.merged_at).getTime();
            const mergeDays = (merged - created) / (1000 * 60 * 60 * 24);
            totalMergeTime += mergeDays;
            mergedPRsCount++;
          }
        });
      } catch (error) {
        continue;
      }
    }

    const mergeRate = totalPRs > 0 ? (mergedPRs / totalPRs) * 100 : 0;
    const averageMergeDays = mergedPRsCount > 0 ? totalMergeTime / mergedPRsCount : 0;

    let prScore = 0;
    
    if (mergeRate >= 80) prScore += 60;
    else if (mergeRate >= 60) prScore += 50;
    else if (mergeRate >= 40) prScore += 40;
    else if (mergeRate >= 20) prScore += 30;
    
    if (averageMergeDays === 0) prScore += 20;
    else if (averageMergeDays <= 1) prScore += 40;
    else if (averageMergeDays <= 3) prScore += 35;
    else if (averageMergeDays <= 7) prScore += 30;
    else if (averageMergeDays <= 14) prScore += 20;

    console.log(`  ⏱️  [Pull Requests] ${((Date.now() - t3) / 1000).toFixed(2)}s - Score: ${prScore}/100`);

    // ==========================================
    // 4. ACTIVITY SCORE (OPTIMIZED)
    // ==========================================
    
    const t4 = Date.now();
    const contributors = new Set<string>();
    let staleBranches = 0;
    let stalePRs = 0;

    for (const repo of primaryRepos.slice(0, 5)) {
      try {
        const contributorsResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/contributors',
          {
            owner: username,
            repo: repo.name,
            per_page: 50,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        contributorsResponse.data.forEach((contributor: any) => {
          contributors.add(contributor.login);
        });

        const branchesResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/branches',
          {
            owner: username,
            repo: repo.name,
            per_page: 10,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        for (const branch of branchesResponse.data.slice(0, 5)) {
          try {
            const commitResponse = await octokit.request(
              'GET /repos/{owner}/{repo}/commits/{ref}',
              {
                owner: username,
                repo: repo.name,
                ref: branch.commit.sha,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28',
                },
              }
            );
        
            const commitAuthor = (commitResponse.data as any)?.commit?.author;
            if (commitAuthor?.date) {
              const lastCommitDate = new Date(commitAuthor.date);
              if (lastCommitDate < threeMonthsAgo) {
                staleBranches++;
              }
            }
          } catch (error) {
            continue;
          }
        }

        const openPRsResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/pulls',
          {
            owner: username,
            repo: repo.name,
            state: 'open',
            per_page: 20,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        openPRsResponse.data.forEach((pr: any) => {
          const createdDate = new Date(pr.created_at);
          if (createdDate < threeMonthsAgo) {
            stalePRs++;
          }
        });
      } catch (error) {
        continue;
      }
    }

    const contributorCount = contributors.size;

    let activityScore = 0;
    
    if (contributorCount >= 10) activityScore += 50;
    else if (contributorCount >= 5) activityScore += 40;
    else if (contributorCount >= 3) activityScore += 30;
    else if (contributorCount >= 2) activityScore += 20;
    else activityScore += 10;
    
    let staleScore = 50;
    staleScore -= Math.min(staleBranches * 5, 25);
    staleScore -= Math.min(stalePRs * 5, 25);
    activityScore += Math.max(staleScore, 0);

    console.log(`  ⏱️  [Activity] ${((Date.now() - t4) / 1000).toFixed(2)}s - Score: ${activityScore}/100`);

    // ==========================================
    // OVERALL SCORE (0-100 with decimal precision)
    // ==========================================

    // Keep scores in 0-100 range with 2 decimal places
    const maintenanceScoreFinal = Math.round(maintenanceScore * 100) / 100;
    const issueScoreFinal = Math.round(issueScore * 100) / 100;
    const prScoreFinal = Math.round(prScore * 100) / 100;
    const activityScoreFinal = Math.round(activityScore * 100) / 100;

    const overallScore = Math.round(
      (maintenanceScoreFinal * 0.3 + issueScoreFinal * 0.25 + prScoreFinal * 0.25 + activityScoreFinal * 0.2) * 100
    ) / 100;

    let grade = 'F';
    if (overallScore >= 95) grade = 'A+';
    else if (overallScore >= 90) grade = 'A';
    else if (overallScore >= 85) grade = 'A-';
    else if (overallScore >= 80) grade = 'B+';
    else if (overallScore >= 75) grade = 'B';
    else if (overallScore >= 70) grade = 'B-';
    else if (overallScore >= 65) grade = 'C+';
    else if (overallScore >= 60) grade = 'C';
    else if (overallScore >= 55) grade = 'C-';
    else if (overallScore >= 50) grade = 'D+';
    else if (overallScore >= 45) grade = 'D';
    else if (overallScore >= 40) grade = 'D-';

    // ==========================================
    // INSIGHTS & RECOMMENDATIONS
    // ==========================================

    const strengths: string[] = [];
    const concerns: string[] = [];
    const recommendations: string[] = [];

    // Strengths
    if (maintenanceScore >= 70) strengths.push('Consistent maintenance with regular commits');
    if (issueScore >= 70) strengths.push('Effective issue resolution process');
    if (prScore >= 70) strengths.push('Strong pull request workflow with high merge rate');
    if (activityScore >= 70) strengths.push('Active community with multiple contributors');
    if (activeDaysRatio > 50) strengths.push('High activity ratio shows consistent engagement');

    // Concerns
    if (lastCommitDays > 60) concerns.push('Repository appears inactive with stale commits');
    if (openClosedRatio < 30) concerns.push('Low issue resolution rate may indicate maintenance challenges');
    if (mergeRate < 40) concerns.push('Low PR merge rate indicates workflow issues');
    if (staleBranches > 10) concerns.push('High number of stale branches needs cleanup');
    if (stalePRs > 5) concerns.push('Multiple stale pull requests need attention');

    // Recommendations
    if (lastCommitDays > 30) recommendations.push('Consider more frequent commits to show active development');
    if (staleBranches > 5) recommendations.push('Clean up stale branches to maintain repository hygiene');
    if (averageResolutionDays > 14) recommendations.push('Improve issue response time for better community engagement');
    if (mergeRate < 60) recommendations.push('Review PR workflow to increase merge success rate');
    if (contributorCount < 2) recommendations.push('Encourage community contributions with good documentation');

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (maintenanceScore >= 70 && lastCommitDays <= 14) trend = 'improving';
    else if (lastCommitDays > 60 || maintenanceScore < 40) trend = 'declining';

    // Generate personalized story
    let story = "";
    if (overallScore >= 85) {
      story = `Your repositories are exceptionally well-maintained. With ${Math.round(commitFrequency * 10) / 10} commits per week and ${Math.round(openClosedRatio)}% issue resolution rate, you demonstrate professional-grade repository management. This level of maintenance shows strong commitment to code quality and user support.`;
    } else if (overallScore >= 70) {
      story = `Your repositories show solid health metrics. You maintain ${Math.round(commitFrequency * 10) / 10} commits per week with active development. ${lastCommitDays <= 14 ? 'Recent activity shows continued engagement.' : 'Consider more frequent commits to show active maintenance.'} Focus on ${issueScore < 70 ? 'improving issue resolution times' : prScore < 70 ? 'streamlining your PR workflow' : 'maintaining current momentum'} to reach exceptional status.`;
    } else if (overallScore >= 50) {
      story = `Your repositories have good foundations but room for improvement. With ${lastCommitDays} days since last commit, ${lastCommitDays > 30 ? 'more frequent updates would signal active maintenance' : 'you\'re staying engaged'}. Priority areas: ${maintenanceScore < 60 ? 'increase commit frequency' : issueScore < 60 ? 'faster issue resolution' : 'better PR management'}. These improvements will significantly boost repository health.`;
    } else {
      story = `Your repositories need more consistent maintenance. ${lastCommitDays > 60 ? 'Repositories appear inactive - regular commits signal active development.' : ''} Focus on establishing consistent patterns: commit regularly, ${openClosedRatio < 50 ? 'resolve issues promptly,' : ''} and maintain active branches. Repository health directly impacts user trust and adoption.`;
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [REPO HEALTH] Complete in ${duration}s - Score: ${overallScore.toFixed(2)}/100`);

    return {
      overallScore,
      grade,
      metrics: {
        maintenance: {
          score: maintenanceScoreFinal,
          commitFrequency: Math.round(commitFrequency * 10) / 10,
          lastCommitDays,
          activeDaysRatio: Math.round(activeDaysRatio * 10) / 10,
        },
        issueManagement: {
          score: issueScoreFinal,
          averageResolutionDays: Math.round(averageResolutionDays * 10) / 10,
          openClosedRatio: Math.round(openClosedRatio * 10) / 10,
          totalIssues,
          closedIssues,
        },
        pullRequests: {
          score: prScoreFinal,
          mergeRate: Math.round(mergeRate * 10) / 10,
          averageMergeDays: Math.round(averageMergeDays * 10) / 10,
          totalPRs,
          mergedPRs,
        },
        activity: {
          score: activityScoreFinal,
          contributorCount,
          staleBranches,
          stalePRs,
        },
      },
      insights: {
        strengths,
        concerns,
        recommendations,
      },
      story,
      trend,
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ [REPO HEALTH] Failed after ${duration}s:`, error);
    throw error;
  }
}
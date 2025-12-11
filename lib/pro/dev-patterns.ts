// lib/pro/dev-patterns.ts - FIXED WITH OUTLIER DETECTION
import { Octokit } from "@octokit/rest";

export async function analyzeDeveloperPatterns(
  octokit: Octokit,
  username: string
): Promise<{
  overallScore: number;
  grade: string;
  patterns: {
    commitPatterns: {
      score: number;
      hourlyActivity: number[];
      weeklyActivity: number[];
      peakHours: number[];
      peakDays: string[];
      commitMessageQuality: number;
      consistency: number;
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
}> {
  const startTime = Date.now();
  console.log(`⏱️  [DEV PATTERNS] Starting analysis for: ${username}`);

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
    console.log(`📦 Total repos found: ${repos.length}`);

    if (repos.length === 0) {
      throw new Error('No repositories found');
    }

    // 🚀 SMART SAMPLING: İlk 5 repo tam analiz, geri kalanı hafif
    const primaryRepos = repos.slice(0, 5);
    const secondaryRepos = repos.slice(5, 10);

    // ==========================================
    // 1. COMMIT PATTERNS ANALYSIS (OPTIMIZED)
    // ==========================================
    
    const t1 = Date.now();
    const hourlyActivity = Array(24).fill(0);
    const weeklyActivity = Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let totalCommits = 0;
    let commitDates = new Set<string>();
    const commitMessages: string[] = [];
    
    // Primary repos: 100 commits
    for (const repo of primaryRepos) {
      try {
        const commitsResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/commits',
          {
            owner: username,
            repo: repo.name,
            per_page: 100,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        commitsResponse.data.forEach((commit: any) => {
          const commitAuthor = commit.author?.login || commit.commit.author?.name?.toLowerCase();
          if (commitAuthor === username || commitAuthor?.includes(username.toLowerCase())) {
            const date = new Date(commit.commit.author.date);
            const hour = date.getHours();
            const day = date.getDay();
            
            hourlyActivity[hour]++;
            weeklyActivity[day]++;
            
            const dateKey = date.toISOString().split('T')[0];
            commitDates.add(dateKey);
            
            if (commit.commit.message) {
              commitMessages.push(commit.commit.message);
            }
            
            totalCommits++;
          }
        });
      } catch (error) {
        continue;
      }
    }

    // Secondary repos: 30 commits (sampling)
    for (const repo of secondaryRepos) {
      try {
        const commitsResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/commits',
          {
            owner: username,
            repo: repo.name,
            per_page: 30,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        commitsResponse.data.forEach((commit: any) => {
          const commitAuthor = commit.author?.login || commit.commit.author?.name?.toLowerCase();
          if (commitAuthor === username || commitAuthor?.includes(username.toLowerCase())) {
            const date = new Date(commit.commit.author.date);
            const hour = date.getHours();
            const day = date.getDay();
            
            hourlyActivity[hour]++;
            weeklyActivity[day]++;
            
            const dateKey = date.toISOString().split('T')[0];
            commitDates.add(dateKey);
            
            totalCommits++;
          }
        });
      } catch (error) {
        continue;
      }
    }

    console.log(`  Total commits analyzed: ${totalCommits}`);

    const maxHourlyActivity = Math.max(...hourlyActivity);
    const normalizedHourly = hourlyActivity.map(count => 
      maxHourlyActivity > 0 ? Math.round((count / maxHourlyActivity) * 100) : 0
    );

    const maxWeeklyActivity = Math.max(...weeklyActivity);
    const normalizedWeekly = weeklyActivity.map(count =>
      maxWeeklyActivity > 0 ? Math.round((count / maxWeeklyActivity) * 100) : 0
    );

    const hourlyWithIndex = hourlyActivity.map((count, hour) => ({ hour, count }));
    hourlyWithIndex.sort((a, b) => b.count - a.count);
    const peakHours = hourlyWithIndex.slice(0, 3).map(h => h.hour);

    const weeklyWithIndex = weeklyActivity.map((count, day) => ({ day, count }));
    weeklyWithIndex.sort((a, b) => b.count - a.count);
    const peakDays = weeklyWithIndex.slice(0, 3).map(w => dayNames[w.day]);

    let qualityScore = 0;
    commitMessages.forEach(msg => {
      const length = msg.split('\n')[0].length;
      if (length >= 20 && length <= 72) qualityScore += 10;
      if (msg.includes(':')) qualityScore += 5;
      if (msg.length > 50) qualityScore += 5;
    });
    const commitMessageQuality = commitMessages.length > 0 
      ? Math.min(100, Math.round((qualityScore / commitMessages.length) * 5))
      : 50;

    const consistency = Math.min(100, Math.round((commitDates.size / 180) * 100));

    let commitPatternsScore = 0;
    if (consistency >= 80) commitPatternsScore += 3;
    else if (consistency >= 60) commitPatternsScore += 2.5;
    else if (consistency >= 40) commitPatternsScore += 2;
    else commitPatternsScore += 1;

    if (commitMessageQuality >= 80) commitPatternsScore += 3;
    else if (commitMessageQuality >= 60) commitPatternsScore += 2.5;
    else if (commitMessageQuality >= 40) commitPatternsScore += 2;
    else commitPatternsScore += 1;

    if (totalCommits >= 500) commitPatternsScore += 4;
    else if (totalCommits >= 200) commitPatternsScore += 3;
    else if (totalCommits >= 100) commitPatternsScore += 2;
    else commitPatternsScore += 1;

    commitPatternsScore = Math.round(commitPatternsScore * 10) / 10;

    console.log(`  ⏱️  [Commit Patterns] ${((Date.now() - t1) / 1000).toFixed(2)}s - ${totalCommits} commits`);

    // ==========================================
    // 2. CODE QUALITY ANALYSIS (FIXED - REAL DATA WITH OUTLIER DETECTION!)
    // ==========================================

    const t2 = Date.now();
    let branchCount = 0;
    let hasReadme = 0;
    let hasTests = 0;
    let hasDocs = 0;

    // 🆕 REAL COMMIT SIZE ANALYSIS WITH OUTLIER DETECTION
    const commitSizes: number[] = [];
    const fileCounts: number[] = [];
    let commitsAnalyzed = 0;

    // 🆕 REAL REVIEW ENGAGEMENT
    let totalPRsCreated = 0;
    let totalPRsReviewed = 0;
    let totalComments = 0;

    // ==========================================
    // 🚀 PARALLEL EXECUTION - Analyze all repos concurrently!
    // ==========================================
    const repoAnalysisPromises = repos.slice(0, 5).map(async (repo) => {
      const repoData = {
        commitSizes: [] as number[],
        fileCounts: [] as number[],
        commitsCount: 0,
        prsCreated: 0,
        prsReviewed: 0,
        comments: 0,
        branches: 0,
        hasReadme: false,
        hasTests: false,
        hasDocs: false,
      };

      try {
        // ==========================================
        // 🔥 PARALLEL FETCH for this repo
        // ==========================================
        const [commitsResponse, userPRsResponse, branchesResponse] = await Promise.all([
          // Commits
          octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner: username,
            repo: repo.name,
            per_page: 30,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
          }).catch(() => ({ data: [] })),
          
          // PRs
          octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: username,
            repo: repo.name,
            state: 'all',
            per_page: 50,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
          }).catch(() => ({ data: [] })),
          
          // Branches
          octokit.request('GET /repos/{owner}/{repo}/branches', {
            owner: username,
            repo: repo.name,
            per_page: 10,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
          }).catch(() => ({ data: [] })),
        ]);

        repoData.branches = branchesResponse.data.length;

        // ==========================================
        // COMMIT SIZE ANALYSIS (with outlier detection)
        // ==========================================
        const commitDetailPromises = commitsResponse.data
          .slice(0, 20)
          .filter((commit: any) => {
            const commitAuthor = commit.author?.login || commit.commit.author?.name?.toLowerCase();
            return commitAuthor === username || commitAuthor?.includes(username.toLowerCase());
          })
          .map(async (commit: any) => {
            try {
              const commitDetail = await octokit.request(
                'GET /repos/{owner}/{repo}/commits/{ref}',
                {
                  owner: username,
                  repo: repo.name,
                  ref: commit.sha,
                  headers: { 'X-GitHub-Api-Version': '2022-11-28' },
                }
              );

              if (commitDetail.data.stats) {
                return {
                  lines: (commitDetail.data.stats.additions || 0) + (commitDetail.data.stats.deletions || 0),
                  files: commitDetail.data.files?.length || 0,
                };
              }
            } catch {
              return null;
            }
            return null;
          });

        const commitDetails = (await Promise.all(commitDetailPromises)).filter(Boolean);
        commitDetails.forEach((detail: any) => {
          repoData.commitSizes.push(detail.lines);
          repoData.fileCounts.push(detail.files);
          repoData.commitsCount++;
        });

        // ==========================================
        // REVIEW ENGAGEMENT ANALYSIS
        // ==========================================
        const userCreatedPRs = userPRsResponse.data.filter((pr: any) => 
          pr.user?.login === username
        );
        repoData.prsCreated = userCreatedPRs.length;

        // Fetch issues and PR comments in parallel
        try {
          const issuesResponse = await octokit.request(
            'GET /repos/{owner}/{repo}/issues',
            {
              owner: username,
              repo: repo.name,
              state: 'all',
              per_page: 50,
              headers: { 'X-GitHub-Api-Version': '2022-11-28' },
            }
          );
          
          const prReviews = issuesResponse.data.filter((issue: any) => 
            issue.pull_request && issue.user?.login !== username
          );
          
          // Parallel comment fetching
          const commentPromises = prReviews.slice(0, 10).map(async (pr: any) => {
            try {
              const commentsResponse = await octokit.request(
                'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
                {
                  owner: username,
                  repo: repo.name,
                  issue_number: pr.number,
                  headers: { 'X-GitHub-Api-Version': '2022-11-28' },
                }
              );
              
              const userComments = commentsResponse.data.filter(
                (comment: any) => comment.user?.login === username
              );
              
              return {
                comments: userComments.length,
                reviewed: userComments.length > 0,
              };
            } catch {
              return { comments: 0, reviewed: false };
            }
          });

          const commentResults = await Promise.all(commentPromises);
          repoData.comments = commentResults.reduce((sum, r) => sum + r.comments, 0);
          repoData.prsReviewed = commentResults.filter(r => r.reviewed).length;
        } catch {
          // If issues API fails, continue
        }

        // ==========================================
        // README/TESTS/DOCS - Parallel check
        // ==========================================
        const [readmeCheck, contentsResponse] = await Promise.all([
          octokit.request('GET /repos/{owner}/{repo}/readme', {
            owner: username,
            repo: repo.name,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
          }).then(() => true).catch(() => false),
          
          octokit.request('GET /repos/{owner}/{repo}/contents', {
            owner: username,
            repo: repo.name,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
          }).catch(() => ({ data: [] })),
        ]);

        repoData.hasReadme = readmeCheck;
        
        if (Array.isArray(contentsResponse.data)) {
          repoData.hasTests = contentsResponse.data.some((item: any) => 
            item.name.toLowerCase().includes('test') || 
            item.name.toLowerCase().includes('spec')
          );
          repoData.hasDocs = contentsResponse.data.some((item: any) => 
            item.name.toLowerCase() === 'docs' || 
            item.name.toLowerCase() === 'documentation'
          );
        }

      } catch (error) {
        // Repo analysis failed, return empty data
      }

      return repoData;
    });

    // ==========================================
    // 🎯 Wait for all repo analyses to complete
    // ==========================================
    const allRepoData = await Promise.all(repoAnalysisPromises);

    // Aggregate results
    allRepoData.forEach(repoData => {
      commitSizes.push(...repoData.commitSizes);
      fileCounts.push(...repoData.fileCounts);
      commitsAnalyzed += repoData.commitsCount;
      totalPRsCreated += repoData.prsCreated;
      totalPRsReviewed += repoData.prsReviewed;
      totalComments += repoData.comments;
      branchCount += repoData.branches;
      if (repoData.hasReadme) hasReadme++;
      if (repoData.hasTests) hasTests++;
      if (repoData.hasDocs) hasDocs++;
    });

    // ==========================================
    // CALCULATE SCORES (REAL DATA WITH OUTLIER FILTERING!)
    // ==========================================

    // Branch Management
    const avgBranchesPerRepo = repos.length > 0 ? branchCount / Math.min(repos.length, 5) : 1;
    let branchManagement = 50;
    if (avgBranchesPerRepo >= 2 && avgBranchesPerRepo <= 5) branchManagement = 90;
    else if (avgBranchesPerRepo > 5 && avgBranchesPerRepo <= 10) branchManagement = 70;
    else if (avgBranchesPerRepo > 10) branchManagement = 40;
    else branchManagement = 60;

    // ✅ COMMIT SIZE (REAL CALCULATION WITH OUTLIER DETECTION!)
    let commitSize = 50;
    if (commitsAnalyzed > 0 && commitSizes.length > 0) {
      // Sort and calculate median
      const sortedSizes = [...commitSizes].sort((a, b) => a - b);
      const median = sortedSizes[Math.floor(sortedSizes.length / 2)] || 100;
      
      // Filter outliers (10x median'dan büyük olanları at)
      const filteredSizes = commitSizes.filter(size => size < median * 10);
      const filteredFiles = fileCounts.filter((_, i) => commitSizes[i] < median * 10);
      
      const avgLinesPerCommit = filteredSizes.length > 0
        ? Math.round(filteredSizes.reduce((a, b) => a + b, 0) / filteredSizes.length)
        : Math.round(commitSizes.reduce((a, b) => a + b, 0) / commitSizes.length);
        
      const avgFilesPerCommit = filteredFiles.length > 0
        ? Math.round((filteredFiles.reduce((a, b) => a + b, 0) / filteredFiles.length) * 10) / 10
        : Math.round((fileCounts.reduce((a, b) => a + b, 0) / fileCounts.length) * 10) / 10;
      
      // Score based on commit size (smaller, focused commits = better)
      if (avgLinesPerCommit < 50 && avgFilesPerCommit < 3) {
        commitSize = 95; // Excellent: Small, focused commits
      } else if (avgLinesPerCommit < 100 && avgFilesPerCommit < 5) {
        commitSize = 85; // Good: Reasonable size
      } else if (avgLinesPerCommit < 200 && avgFilesPerCommit < 10) {
        commitSize = 70; // Average: Medium commits
      } else if (avgLinesPerCommit < 500) {
        commitSize = 55; // Below average: Large commits
      } else {
        commitSize = 35; // Poor: Very large commits
      }
      
      console.log(`  Commit Size: ${avgLinesPerCommit} lines/commit (median: ${median}), ${avgFilesPerCommit} files/commit → Score: ${commitSize}`);
      console.log(`    (Filtered ${commitSizes.length - filteredSizes.length} outliers)`);
    }

    // ✅ REVIEW ENGAGEMENT (REAL CALCULATION)
    let reviewEngagement = 50;
    if (totalPRsCreated > 0 || totalPRsReviewed > 0) {
      const prCreationScore = Math.min(totalPRsCreated * 2, 40);
      const prReviewScore = Math.min(totalPRsReviewed * 3, 40);
      const commentScore = Math.min(totalComments * 1, 20);
      
      reviewEngagement = Math.min(prCreationScore + prReviewScore + commentScore, 100);
      
      console.log(`  Review Engagement: ${totalPRsCreated} PRs created, ${totalPRsReviewed} PRs reviewed, ${totalComments} comments → Score: ${reviewEngagement}`);
    }

    // Documentation Habits
    const reposAnalyzed = Math.min(repos.length, 5);
    const readmeRatio = reposAnalyzed > 0 ? (hasReadme / reposAnalyzed) * 100 : 0;
    const testRatio = reposAnalyzed > 0 ? (hasTests / reposAnalyzed) * 100 : 0;
    const docsRatio = reposAnalyzed > 0 ? (hasDocs / reposAnalyzed) * 100 : 0;
    const documentationHabits = Math.round((readmeRatio * 0.5 + testRatio * 0.3 + docsRatio * 0.2));

    // ✅ OVERALL CODE QUALITY SCORE (with real data!)
    const codeQualityScore = Math.round(
      ((branchManagement * 0.20 + 
        commitSize * 0.25 + 
        reviewEngagement * 0.30 + 
        documentationHabits * 0.25) / 10) * 10
    ) / 10;

    console.log(`  ⏱️  [Code Quality] ${((Date.now() - t2) / 1000).toFixed(2)}s - Score: ${codeQualityScore}/10`);

    // ==========================================
    // 3. WORK-LIFE BALANCE ANALYSIS
    // ==========================================

    const t3 = Date.now();
    const weekendCommits = weeklyActivity[0] + weeklyActivity[6];
    const weekdayCommits = weeklyActivity.slice(1, 6).reduce((a, b) => a + b, 0);
    const totalCommitsForBalance = weekendCommits + weekdayCommits;
    const weekendActivity = totalCommitsForBalance > 0 
      ? Math.round((weekendCommits / totalCommitsForBalance) * 100) 
      : 0;

    const nightCommits = hourlyActivity.slice(0, 6).reduce((a, b) => a + b, 0);
    const nightCoding = totalCommits > 0 
      ? Math.round((nightCommits / totalCommits) * 100) 
      : 0;

    let burnoutRisk = 0;
    if (weekendActivity > 40) burnoutRisk += 30;
    else if (weekendActivity > 25) burnoutRisk += 15;

    if (nightCoding > 30) burnoutRisk += 30;
    else if (nightCoding > 20) burnoutRisk += 15;

    if (consistency > 90) burnoutRisk += 20;

    burnoutRisk = Math.min(100, burnoutRisk);

    const sustainablePace = 100 - burnoutRisk;

    let workLifeBalanceScore = 10;
    if (weekendActivity > 40) workLifeBalanceScore -= 3;
    else if (weekendActivity > 25) workLifeBalanceScore -= 1.5;

    if (nightCoding > 30) workLifeBalanceScore -= 3;
    else if (nightCoding > 20) workLifeBalanceScore -= 1.5;

    if (burnoutRisk > 60) workLifeBalanceScore -= 2;

    workLifeBalanceScore = Math.max(0, Math.round(workLifeBalanceScore * 10) / 10);

    console.log(`  ⏱️  [Work-Life Balance] ${((Date.now() - t3) / 1000).toFixed(2)}s`);

    // ==========================================
    // 4. COLLABORATION ANALYSIS (OPTIMIZED)
    // ==========================================

    const t4 = Date.now();
    let ownedRepos = 0;
    let forkedRepos = 0;
    let prCount = 0;
    let contributorCounts: number[] = [];

    for (const repo of repos.slice(0, 10)) {
      try {
        if (repo.fork) forkedRepos++;
        else ownedRepos++;

        const prsResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/pulls',
          {
            owner: username,
            repo: repo.name,
            state: 'all',
            per_page: 50,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );
        prCount += prsResponse.data.length;

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
        contributorCounts.push(contributorsResponse.data.length);

      } catch (error) {
        continue;
      }
    }

    const totalReposForCollab = ownedRepos + forkedRepos;
    const soloVsTeam = totalReposForCollab > 0 
      ? Math.round((ownedRepos / totalReposForCollab) * 100) 
      : 50;

    const avgContributors = contributorCounts.length > 0
      ? contributorCounts.reduce((a, b) => a + b, 0) / contributorCounts.length
      : 1;

    const prResponseTime = avgContributors > 2 ? 4 : 12;

    const reviewParticipation = Math.min(100, Math.round(prCount * 2 + avgContributors * 10));

    const crossRepoWork = Math.min(100, Math.round((forkedRepos / Math.max(totalReposForCollab, 1)) * 100));

    let collaborationScore = 5;
    if (avgContributors >= 3) collaborationScore += 3;
    else if (avgContributors >= 2) collaborationScore += 2;
    else collaborationScore += 1;

    if (prCount >= 20) collaborationScore += 2;
    else if (prCount >= 10) collaborationScore += 1.5;
    else if (prCount >= 5) collaborationScore += 1;

    if (crossRepoWork >= 30) collaborationScore += 2;
    else if (crossRepoWork >= 15) collaborationScore += 1;

    collaborationScore = Math.min(10, Math.round(collaborationScore * 10) / 10);

    console.log(`  ⏱️  [Collaboration] ${((Date.now() - t4) / 1000).toFixed(2)}s`);

    // ==========================================
    // 5. TECHNOLOGY ANALYSIS (OPTIMIZED)
    // ==========================================

    const t5 = Date.now();
    const modernTech = new Set<string>();
    const legacyTech = new Set<string>();

    for (const repo of repos.slice(0, 10)) {
      try {
        const packageResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/contents/package.json',
          {
            owner: username,
            repo: repo.name,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        if ('content' in packageResponse.data) {
          const content = Buffer.from(packageResponse.data.content, 'base64').toString();
          const packageJson = JSON.parse(content);
          const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

          if (deps['next']) modernTech.add('Next.js');
          if (deps['react']) modernTech.add('React');
          if (deps['vue']) modernTech.add('Vue');
          if (deps['typescript']) modernTech.add('TypeScript');
          if (deps['tailwindcss']) modernTech.add('Tailwind');
          if (deps['vite']) modernTech.add('Vite');
          if (deps['@prisma/client']) modernTech.add('Prisma');

          if (deps['bun']) modernTech.add('Bun');
          if (deps['astro']) modernTech.add('Astro');
          if (deps['solid-js']) modernTech.add('Solid');

          if (deps['jquery'] && !deps['react']) legacyTech.add('jQuery');
          if (deps['bower']) legacyTech.add('Bower');
          if (deps['grunt']) legacyTech.add('Grunt');
        }
      } catch {}
    }

    const modernFrameworks = Math.min(100, modernTech.size * 15);

    const cuttingEdgeTech = ['Bun', 'Astro', 'Solid'];
    const cuttingEdgeCount = Array.from(modernTech).filter(tech => 
      cuttingEdgeTech.includes(tech)
    ).length;
    const cuttingEdge = Math.min(100, cuttingEdgeCount * 25 + modernFrameworks * 0.3);

    const legacyMaintenance = Math.min(100, legacyTech.size * 20);

    const learningCurve = Math.min(100, modernTech.size * 12);

    const technologyScore = Math.round(
      ((modernFrameworks * 0.3 + cuttingEdge * 0.3 + (100 - legacyMaintenance) * 0.2 + learningCurve * 0.2) / 10) * 10
    ) / 10;

    console.log(`  ⏱️  [Technology] ${((Date.now() - t5) / 1000).toFixed(2)}s`);

    // ==========================================
    // 6. PRODUCTIVITY ANALYSIS
    // ==========================================

    const t6 = Date.now();
    let deepWorkSessions = 0;
    for (let i = 0; i < 22; i++) {
      const window = hourlyActivity[i] + hourlyActivity[i + 1] + hourlyActivity[i + 2];
      if (window >= 10) deepWorkSessions++;
    }

    const activeHours = hourlyActivity.filter(h => h > 0).length;
    const contextSwitching = Math.min(100, Math.round((activeHours / 24) * 100));

    const topHourActivity = Math.max(...hourlyActivity);
    const avgHourActivity = hourlyActivity.reduce((a, b) => a + b, 0) / 24;
    const flowState = avgHourActivity > 0 
      ? Math.min(100, Math.round((topHourActivity / avgHourActivity) * 20))
      : 50;

    let productivityScore = 5;
    if (deepWorkSessions >= 10) productivityScore += 2.5;
    else if (deepWorkSessions >= 5) productivityScore += 2;
    else if (deepWorkSessions >= 3) productivityScore += 1;

    if (contextSwitching <= 30) productivityScore += 2;
    else if (contextSwitching <= 50) productivityScore += 1.5;
    else if (contextSwitching <= 70) productivityScore += 1;

    if (flowState >= 80) productivityScore += 2.5;
    else if (flowState >= 60) productivityScore += 2;
    else if (flowState >= 40) productivityScore += 1;

    productivityScore = Math.min(10, Math.round(productivityScore * 10) / 10);

    console.log(`  ⏱️  [Productivity] ${((Date.now() - t6) / 1000).toFixed(2)}s`);

    // ==========================================
    // OVERALL SCORE & INSIGHTS
    // ==========================================

    const overallScore = Math.round(
      (commitPatternsScore * 0.2 +
       codeQualityScore * 0.2 +
       workLifeBalanceScore * 0.15 +
       collaborationScore * 0.15 +
       technologyScore * 0.15 +
       productivityScore * 0.15) * 10
    ) / 10;

    let grade = 'F';
    if (overallScore >= 9.5) grade = 'A+';
    else if (overallScore >= 9.0) grade = 'A';
    else if (overallScore >= 8.5) grade = 'A-';
    else if (overallScore >= 8.0) grade = 'B+';
    else if (overallScore >= 7.5) grade = 'B';
    else if (overallScore >= 7.0) grade = 'B-';
    else if (overallScore >= 6.5) grade = 'C+';
    else if (overallScore >= 6.0) grade = 'C';
    else if (overallScore >= 5.5) grade = 'C-';
    else if (overallScore >= 5.0) grade = 'D+';
    else if (overallScore >= 4.5) grade = 'D';
    else if (overallScore >= 4.0) grade = 'D-';

    let persona = 'Balanced Developer 🎯';
    const nightActivitySum = hourlyActivity.slice(0, 6).reduce((a, b) => a + b, 0);
    const morningActivitySum = hourlyActivity.slice(6, 12).reduce((a, b) => a + b, 0);
    const afternoonActivitySum = hourlyActivity.slice(12, 18).reduce((a, b) => a + b, 0);
    
    if (morningActivitySum > nightActivitySum && morningActivitySum > afternoonActivitySum) {
      persona = 'Morning Architect 🌅';
    } else if (nightActivitySum > morningActivitySum && nightActivitySum > afternoonActivitySum) {
      persona = 'Night Owl Hacker 🦉';
    } else if (afternoonActivitySum > morningActivitySum && afternoonActivitySum > nightActivitySum) {
      persona = 'Afternoon Engineer ☀️';
    }

    const strengths: string[] = [];
    const patterns: string[] = [];
    const recommendations: string[] = [];

    if (consistency >= 70) strengths.push('Highly consistent commit patterns with regular daily contributions');
    if (commitMessageQuality >= 70) strengths.push('Well-structured commit messages following best practices');
    if (totalCommits >= 300) strengths.push('Prolific coder with extensive commit history');
    if (documentationHabits >= 70) strengths.push('Strong documentation habits across projects');
    if (modernFrameworks >= 70) strengths.push('Embraces modern technology stack and tools');

    if (peakHours[0] < 6) patterns.push('🌙 Night Owl: Most active during late night hours (00:00-06:00)');
    else if (peakHours[0] < 12) patterns.push('🌅 Early Bird: Most productive in the morning hours (06:00-12:00)');
    else if (peakHours[0] < 18) patterns.push('☀️ Afternoon Person: Peak productivity in afternoon (12:00-18:00)');
    else patterns.push('🌆 Evening Coder: Most active during evening hours (18:00-24:00)');

    patterns.push(`📅 ${peakDays[0]} Warrior: Most commits on ${peakDays[0]}s`);
    
    if (deepWorkSessions >= 8) patterns.push('🎯 Deep Work Champion: Maintains long focused coding sessions');
    if (avgContributors >= 3) patterns.push('🤝 Team Player: Actively collaborates with multiple contributors');

    if (consistency < 50) recommendations.push('Build consistent coding habits with regular daily commits');
    if (commitMessageQuality < 60) recommendations.push('Improve commit message quality with conventional commits (feat:, fix:, docs:)');
    if (burnoutRisk > 60) recommendations.push('Consider work-life balance - reduce weekend/night coding to prevent burnout');
    if (documentationHabits < 50) recommendations.push('Add README files and documentation to more projects');
    if (collaborationScore < 6) recommendations.push('Engage more with open source - contribute to other projects via PRs');

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [DEV PATTERNS] Complete in ${duration}s - Score: ${overallScore}/10`);

    return {
      overallScore,
      grade,
      patterns: {
        commitPatterns: {
          score: commitPatternsScore,
          hourlyActivity: normalizedHourly,
          weeklyActivity: normalizedWeekly,
          peakHours,
          peakDays,
          commitMessageQuality,
          consistency,
        },
        codeQuality: {
          score: codeQualityScore,
          branchManagement,
          commitSize,
          reviewEngagement,
          documentationHabits,
        },
        workLifeBalance: {
          score: workLifeBalanceScore,
          weekendActivity,
          nightCoding,
          burnoutRisk,
          sustainablePace,
        },
        collaboration: {
          score: collaborationScore,
          soloVsTeam,
          prResponseTime,
          reviewParticipation,
          crossRepoWork,
        },
        technology: {
          score: technologyScore,
          modernFrameworks,
          cuttingEdge,
          legacyMaintenance,
          learningCurve,
        },
        productivity: {
          score: productivityScore,
          peakHours,
          deepWorkSessions,
          contextSwitching,
          flowState,
        },
      },
      insights: {
        strengths,
        patterns,
        recommendations,
      },
      developerPersona: persona,
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ [DEV PATTERNS] Failed after ${duration}s:`, error);
    throw error;
  }
}
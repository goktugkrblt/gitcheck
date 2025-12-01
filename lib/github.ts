import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";
import { 
  GitHubUser, 
  GitHubRepo, 
  LanguageStats,
  GitHubContributions,
  PullRequestMetrics,
  ActivityMetrics,
  RepoDetailedMetrics
} from "@/types";

export class GitHubService {
  private octokit: Octokit;
  private graphqlClient: any;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${accessToken}`,
      },
    });
  }

  async getUserData(username: string): Promise<GitHubUser> {
    const { data } = await this.octokit.users.getByUsername({ username });
    return data as GitHubUser;
  }

  async getRepositories(username: string): Promise<GitHubRepo[]> {
    const { data } = await this.octokit.repos.listForUser({
      username,
      type: "owner",
      sort: "updated",
      per_page: 100,
    });
    return data as GitHubRepo[];
  }

  async getLanguageStats(repos: GitHubRepo[]): Promise<LanguageStats> {
    const languages: Record<string, number> = {};

    for (const repo of repos) {
      if (!repo.fork) {
        try {
          const { data } = await this.octokit.repos.listLanguages({
            owner: repo.owner.login,
            repo: repo.name,
          });

          Object.entries(data).forEach(([lang, bytes]) => {
            languages[lang] = (languages[lang] || 0) + (bytes as number);
          });
        } catch (error) {
          console.error(`Error fetching languages for ${repo.name}`);
        }
      }
    }

    // Convert to percentages
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    const percentages: LanguageStats = {};

    Object.entries(languages).forEach(([lang, bytes]) => {
      percentages[lang] = Number(((bytes / total) * 100).toFixed(1));
    });

    return percentages;
  }

  async getTotalStars(repos: GitHubRepo[]): Promise<number> {
    return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  }

  async getTotalForks(repos: GitHubRepo[]): Promise<number> {
    return repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
  }

  async getContributions(username: string): Promise<GitHubContributions> {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
            commitContributionsByRepository(maxRepositories: 100) {
              repository {
                name
                owner {
                  login
                }
              }
              contributions {
                totalCount
              }
            }
          }
        }
      }
    `;

    try {
      const result = await this.graphqlClient(query, { username });
      const collection = result.user.contributionsCollection;

      return {
        totalCommits: collection.totalCommitContributions,
        totalPRs: collection.totalPullRequestContributions,
        totalIssues: collection.totalIssueContributions,
        totalReviews: collection.totalPullRequestReviewContributions,
        contributionCalendar: collection.contributionCalendar,
        commitsByRepo: collection.commitContributionsByRepository.map((item: any) => ({
          repoName: `${item.repository.owner.login}/${item.repository.name}`,
          commitCount: item.contributions.totalCount,
        })),
      };
    } catch (error) {
      console.error('Error fetching contributions:', error);
      return {
        totalCommits: 0,
        totalPRs: 0,
        totalIssues: 0,
        totalReviews: 0,
        contributionCalendar: {
          totalContributions: 0,
          weeks: [],
        },
        commitsByRepo: [],
      };
    }
  }

  async getPullRequestMetrics(username: string): Promise<PullRequestMetrics> {
    try {
      const { data } = await this.octokit.search.issuesAndPullRequests({
        q: `author:${username} type:pr`,
        per_page: 100,
        sort: 'created',
      });

      const contributedRepos = new Set<string>();
      let mergedCount = 0;
      let openCount = 0;
      let closedCount = 0;

      data.items.forEach((pr: any) => {
        contributedRepos.add(pr.repository_url.split('/').slice(-2).join('/'));
        
        if (pr.state === 'open') {
          openCount++;
        } else if (pr.pull_request?.merged_at) {
          mergedCount++;
        } else {
          closedCount++;
        }
      });

      return {
        totalPRs: data.total_count,
        mergedPRs: mergedCount,
        openPRs: openCount,
        closedPRs: closedCount,
        contributedRepos: Array.from(contributedRepos),
      };
    } catch (error) {
      console.error('Error fetching PR metrics:', error);
      return {
        totalPRs: 0,
        mergedPRs: 0,
        openPRs: 0,
        closedPRs: 0,
        contributedRepos: [],
      };
    }
  }

  async getActivityMetrics(contributions: GitHubContributions): Promise<ActivityMetrics> {
    const calendar = contributions.contributionCalendar;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalDays = 0;
    let activeDays = 0;
    const dayActivity: Record<string, number> = {};
    let weekendCommits = 0;
    let weekdayCommits = 0;

    // Flatten all contribution days
    const allDays = calendar.weeks.flatMap(week => week.contributionDays);
    
    // Calculate streaks and activity patterns
    allDays.forEach((day, index) => {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      dayActivity[dayName] = (dayActivity[dayName] || 0) + day.contributionCount;
      
      if (day.contributionCount > 0) {
        tempStreak++;
        activeDays++;
        
        if (dayName === 'Saturday' || dayName === 'Sunday') {
          weekendCommits += day.contributionCount;
        } else {
          weekdayCommits += day.contributionCount;
        }
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
      }
      
      totalDays++;
    });

    // Check if the last streak is the longest
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    // Current streak (from the end)
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (allDays[i].contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    const mostActiveDay = Object.entries(dayActivity).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Monday';
    const averageCommitsPerDay = totalDays > 0 ? calendar.totalContributions / totalDays : 0;
    const totalCommits = weekendCommits + weekdayCommits;
    const weekendActivity = totalCommits > 0 ? (weekendCommits / totalCommits) * 100 : 0;

    return {
      currentStreak,
      longestStreak,
      averageCommitsPerDay: Math.round(averageCommitsPerDay * 10) / 10,
      mostActiveDay,
      mostActiveHour: 14, // Default value, can be calculated with more detailed data
      weekendActivity: Math.round(weekendActivity),
    };
  }

  async getRepoDetailedMetrics(owner: string, repo: string): Promise<RepoDetailedMetrics> {
    const metrics: RepoDetailedMetrics = {
      hasReadme: false,
      hasLicense: false,
      hasCI: false,
      commitFrequency: 0,
      lastCommitDate: '',
      openIssuesCount: 0,
      contributorsCount: 0,
      releasesCount: 0,
      branchesCount: 0,
      isArchived: false,
      isFork: false,
      techStack: [],
    };

    try {
      // Repo details
      const { data: repoData } = await this.octokit.repos.get({ owner, repo });
      metrics.isArchived = repoData.archived;
      metrics.isFork = repoData.fork;
      metrics.openIssuesCount = repoData.open_issues_count;
      metrics.hasLicense = !!repoData.license;

      // README check
      try {
        const { data: readme } = await this.octokit.repos.getReadme({ owner, repo });
        metrics.hasReadme = true;
        metrics.readmeLength = Buffer.from(readme.content, 'base64').toString().length;
      } catch {}

      // Recent commits
      try {
        const { data: commits } = await this.octokit.repos.listCommits({
          owner,
          repo,
          per_page: 100,
        });
        
        if (commits.length > 0) {
          metrics.lastCommitDate = commits[0].commit.author?.date || '';
          
          // Calculate commit frequency
          const firstCommitDate = new Date(commits[commits.length - 1].commit.author?.date || '');
          const lastCommitDate = new Date(commits[0].commit.author?.date || '');
          const monthsDiff = (lastCommitDate.getTime() - firstCommitDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          metrics.commitFrequency = Math.round(commits.length / Math.max(monthsDiff, 1));
        }
      } catch {}

      // Contributors
      try {
        const { data: contributors } = await this.octokit.repos.listContributors({
          owner,
          repo,
          per_page: 100,
        });
        metrics.contributorsCount = contributors.length;
      } catch {}

      // Releases
      try {
        const { data: releases } = await this.octokit.repos.listReleases({
          owner,
          repo,
          per_page: 100,
        });
        metrics.releasesCount = releases.length;
      } catch {}

      // Branches
      try {
        const { data: branches } = await this.octokit.repos.listBranches({
          owner,
          repo,
          per_page: 100,
        });
        metrics.branchesCount = branches.length;
        
        // Check for CI (GitHub Actions)
        metrics.hasCI = branches.some(b => b.protection?.required_status_checks);
      } catch {}

      // Tech stack detection
      metrics.techStack = await this.detectTechStack(owner, repo);

    } catch (error) {
      console.error(`Error getting detailed metrics for ${owner}/${repo}:`, error);
    }

    return metrics;
  }

  async detectTechStack(owner: string, repo: string): Promise<string[]> {
    const techStack = new Set<string>();

    // Check package.json
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'package.json',
      });

      if ('content' in data) {
        const packageJson = JSON.parse(Buffer.from(data.content, 'base64').toString());
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        // Frameworks
        if (deps['next']) techStack.add('Next.js');
        if (deps['react']) techStack.add('React');
        if (deps['vue']) techStack.add('Vue');
        if (deps['@angular/core']) techStack.add('Angular');
        if (deps['express']) techStack.add('Express');
        if (deps['nestjs']) techStack.add('NestJS');
        
        // Databases & ORMs
        if (deps['mongoose'] || deps['mongodb']) techStack.add('MongoDB');
        if (deps['pg'] || deps['postgres']) techStack.add('PostgreSQL');
        if (deps['mysql']) techStack.add('MySQL');
        if (deps['redis']) techStack.add('Redis');
        if (deps['@prisma/client']) techStack.add('Prisma');
        
        // Tools
        if (deps['typescript']) techStack.add('TypeScript');
        if (deps['tailwindcss']) techStack.add('Tailwind CSS');
        if (deps['graphql']) techStack.add('GraphQL');
        if (deps['jest'] || deps['vitest']) techStack.add('Testing');
      }
    } catch {}

    // Check for other language files
    const filesToCheck = [
      { file: 'requirements.txt', tech: 'Python' },
      { file: 'go.mod', tech: 'Go' },
      { file: 'Cargo.toml', tech: 'Rust' },
      { file: 'pom.xml', tech: 'Java' },
      { file: 'build.gradle', tech: 'Java' },
      { file: 'composer.json', tech: 'PHP' },
      { file: 'Gemfile', tech: 'Ruby' },
      { file: '.github/workflows', tech: 'GitHub Actions' },
      { file: 'Dockerfile', tech: 'Docker' },
    ];

    for (const { file, tech } of filesToCheck) {
      try {
        await this.octokit.repos.getContent({ owner, repo, path: file });
        techStack.add(tech);
      } catch {}
    }

    return Array.from(techStack);
  }

  async getOrganizations(username: string): Promise<string[]> {
    try {
      const { data } = await this.octokit.orgs.listForUser({
        username,
        per_page: 100,
      });
      return data.map(org => org.login);
    } catch {
      return [];
    }
  }

  async getGistsCount(username: string): Promise<number> {
    try {
      const { data } = await this.octokit.gists.listForUser({
        username,
        per_page: 1,
      });
      return data.length;
    } catch {
      return 0;
    }
  }

  // YENİ: Framework Detection
  async detectFrameworks(repos: GitHubRepo[]): Promise<Record<string, number>> {
    const frameworkCounts: Record<string, number> = {};

    for (const repo of repos) {
      if (repo.fork) continue;

      const detected = await this.detectRepoFrameworks(repo.owner.login, repo.name);
      detected.forEach(framework => {
        frameworkCounts[framework] = (frameworkCounts[framework] || 0) + 1;
      });
    }

    return frameworkCounts;
  }

  private async detectRepoFrameworks(owner: string, repo: string): Promise<string[]> {
    const frameworks = new Set<string>();

    // Check package.json
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'package.json',
      });

      if ('content' in data) {
        const packageJson = JSON.parse(Buffer.from(data.content, 'base64').toString());
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        // Frontend Frameworks
        if (deps['next']) frameworks.add('Next.js');
        if (deps['react'] && !deps['next']) frameworks.add('React');
        if (deps['vue']) frameworks.add('Vue.js');
        if (deps['@angular/core']) frameworks.add('Angular');
        if (deps['svelte']) frameworks.add('Svelte');
        if (deps['nuxt']) frameworks.add('Nuxt.js');

        // Backend Frameworks
        if (deps['express']) frameworks.add('Express');
        if (deps['@nestjs/core']) frameworks.add('NestJS');
        if (deps['fastify']) frameworks.add('Fastify');

        // Mobile
        if (deps['react-native']) frameworks.add('React Native');
        if (deps['@ionic/angular']) frameworks.add('Ionic');

        // CSS Frameworks
        if (deps['tailwindcss']) frameworks.add('Tailwind CSS');
        if (deps['bootstrap']) frameworks.add('Bootstrap');

        // Other
        if (deps['electron']) frameworks.add('Electron');
        if (deps['gatsby']) frameworks.add('Gatsby');
      }
    } catch {}

    // Python frameworks
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'requirements.txt',
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString().toLowerCase();
        if (content.includes('django')) frameworks.add('Django');
        if (content.includes('flask')) frameworks.add('Flask');
        if (content.includes('fastapi')) frameworks.add('FastAPI');
      }
    } catch {}

    // Java frameworks
    const javaFiles = ['pom.xml', 'build.gradle'];
    for (const file of javaFiles) {
      try {
        const { data } = await this.octokit.repos.getContent({ owner, repo, path: file });
        if ('content' in data) {
          const content = Buffer.from(data.content, 'base64').toString().toLowerCase();
          if (content.includes('spring-boot') || content.includes('springframework')) {
            frameworks.add('Spring Boot');
          }
        }
      } catch {}
    }

    // PHP frameworks
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'composer.json',
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString().toLowerCase();
        if (content.includes('laravel/framework')) frameworks.add('Laravel');
        if (content.includes('symfony/')) frameworks.add('Symfony');
      }
    } catch {}

    // Ruby frameworks
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'Gemfile',
      });

      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString().toLowerCase();
        if (content.includes('rails')) frameworks.add('Ruby on Rails');
      }
    } catch {}

    return Array.from(frameworks);
  }
  // CACHE: Check if we need to re-fetch data
  shouldRefetchData(cachedRepoCount: number, currentRepoCount: number, lastScan: Date | null, maxAgeHours: number = 24): boolean {
    // If repo count changed, always refetch
    if (cachedRepoCount !== currentRepoCount) {
      console.log('🔄 Repo count changed, refetching...');
      return true;
    }

    // If no previous scan, fetch
    if (!lastScan) {
      console.log('🔄 No previous scan, fetching...');
      return true;
    }

    // Check if cache is expired
    const hoursSinceLastScan = (Date.now() - new Date(lastScan).getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastScan > maxAgeHours) {
      console.log(`🔄 Cache expired (${Math.round(hoursSinceLastScan)}h old), refetching...`);
      return true;
    }

    console.log(`✅ Using cached data (${Math.round(hoursSinceLastScan)}h old)`);
    return false;
  }

  // CACHED: Get languages with cache support
  async getLanguageStatsCached(
    repos: GitHubRepo[], 
    cachedLanguages: any,
    cachedRepoCount: number,
    lastScan: Date | null
  ): Promise<LanguageStats> {
    const shouldRefetch = this.shouldRefetchData(cachedRepoCount, repos.length, lastScan, 168); // 7 days

    if (!shouldRefetch && cachedLanguages) {
      console.log('📦 Using cached languages');
      return cachedLanguages;
    }

    console.log('🔍 Fetching fresh language data...');
    return await this.getLanguageStats(repos);
  }

  // CACHED: Get frameworks with cache support
  async detectFrameworksCached(
    repos: GitHubRepo[],
    cachedFrameworks: any,
    cachedRepoCount: number,
    lastScan: Date | null
  ): Promise<Record<string, number>> {
    const shouldRefetch = this.shouldRefetchData(cachedRepoCount, repos.length, lastScan, 168); // 7 days

    if (!shouldRefetch && cachedFrameworks) {
      console.log('📦 Using cached frameworks');
      return cachedFrameworks;
    }

    console.log('🔍 Detecting frameworks...');
    return await this.detectFrameworks(repos);
  }

  // CACHED: Get organizations with cache support
  async getOrganizationsCached(
    username: string,
    cachedOrgCount: number,
    lastScan: Date | null
  ): Promise<string[]> {
    const hoursSinceLastScan = lastScan ? (Date.now() - new Date(lastScan).getTime()) / (1000 * 60 * 60) : Infinity;
    
    if (hoursSinceLastScan < 168 && cachedOrgCount > 0) { // 7 days
      console.log('📦 Using cached organization count');
      return []; // Return empty, we only need the count
    }

    console.log('🔍 Fetching organizations...');
    return await this.getOrganizations(username);
  }

  // Rate limit info
  async getRateLimitInfo(): Promise<{ limit: number; remaining: number; reset: Date }> {
    try {
      const { data } = await this.octokit.rateLimit.get();
      return {
        limit: data.rate.limit,
        remaining: data.rate.remaining,
        reset: new Date(data.rate.reset * 1000),
      };
    } catch (error) {
      console.error('Error fetching rate limit:', error);
      return { limit: 5000, remaining: 5000, reset: new Date() };
    }
  }
  // README Quality Analysis
// README Quality Analysis - PRO VERSION
async analyzeReadmeQuality(username: string): Promise<{
  score: number;
  grade: string;
  details: {
    length: number;
    lengthScore: number;
    sections: number;
    sectionsScore: number;
    badges: number;
    badgesScore: number;
    codeBlocks: number;
    codeBlocksScore: number;
    links: number;
    linksScore: number;
    images: number;
    imagesScore: number;
    tables: number;
    tablesScore: number;
    toc: boolean;
    tocScore: number;
  };
  strengths: string[];
  improvements: string[];
  insights: {
    readability: number;
    completeness: number;
    professionalism: number;
  };
}> {
  try {
    // Get repositories (ilk 100)
    const reposResponse = await this.octokit.request('GET /users/{username}/repos', {
      username,
      per_page: 100,
      sort: 'updated',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    const repos = reposResponse.data;
    
    // Find best README (longest, non-fork)
    let bestReadme = '';
    let bestReadmeRepo = '';
    
    for (const repo of repos) {
      if (repo.fork) continue;
      
      try {
        const readmeResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/readme',
          {
            owner: username,
            repo: repo.name,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );
        
        const content = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
        
        if (content.length > bestReadme.length) {
          bestReadme = content;
          bestReadmeRepo = repo.name;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!bestReadme) {
      return {
        score: 0,
        grade: "F",
        details: {
          length: 0,
          lengthScore: 0,
          sections: 0,
          sectionsScore: 0,
          badges: 0,
          badgesScore: 0,
          codeBlocks: 0,
          codeBlocksScore: 0,
          links: 0,
          linksScore: 0,
          images: 0,
          imagesScore: 0,
          tables: 0,
          tablesScore: 0,
          toc: false,
          tocScore: 0,
        },
        strengths: [],
        improvements: ['No README found. Add detailed documentation to your projects.'],
        insights: {
          readability: 0,
          completeness: 0,
          professionalism: 0,
        },
      };
    }
    
    console.log(`📖 Analyzing README from: ${bestReadmeRepo} (${bestReadme.length} chars)`);
    
    // ==========================================
    // ADVANCED ANALYSIS
    // ==========================================
    
    const length = bestReadme.length;
    const sections = (bestReadme.match(/^#{1,6}\s+.+$/gm) || []).length;
    const badges = (bestReadme.match(/!\[.*?\]\(https:\/\/img\.shields\.io.*?\)/g) || []).length;
    const codeBlocks = (bestReadme.match(/```[\s\S]*?```/g) || []).length;
    const links = (bestReadme.match(/\[.*?\]\((?!#).*?\)/g) || []).length; // Exclude anchor links
    const images = (bestReadme.match(/!\[.*?\]\((?!https:\/\/img\.shields\.io).*?\)/g) || []).length; // Exclude badges
    const tables = (bestReadme.match(/\|[\s\S]*?\|/g) || []).length;
    
    // Table of Contents detection
    const toc = /##?\s+(table of contents|contents|toc)/i.test(bestReadme);
    
    // Check for essential sections (case-insensitive)
    const hasInstallation = /##?\s+(installation|install|setup|getting started)/i.test(bestReadme);
    const hasUsage = /##?\s+(usage|example|examples|how to use)/i.test(bestReadme);
    const hasFeatures = /##?\s+(features|what'?s included)/i.test(bestReadme);
    const hasContributing = /##?\s+(contributing|contribution)/i.test(bestReadme);
    const hasLicense = /##?\s+(license)/i.test(bestReadme);
    
    // ==========================================
    // SOPHISTICATED SCORING (out of 100)
    // ==========================================
    
    // 1. Length Score (15 points) - Detailed content
    let lengthScore = 0;
    if (length >= 3000) lengthScore = 15;
    else if (length >= 2000) lengthScore = 12;
    else if (length >= 1500) lengthScore = 10;
    else if (length >= 1000) lengthScore = 7;
    else if (length >= 500) lengthScore = 4;
    else lengthScore = 2;
    
    // 2. Sections Score (20 points) - Well organized
    let sectionsScore = 0;
    if (sections >= 10) sectionsScore = 20;
    else if (sections >= 8) sectionsScore = 17;
    else if (sections >= 6) sectionsScore = 14;
    else if (sections >= 4) sectionsScore = 10;
    else if (sections >= 2) sectionsScore = 5;
    else sectionsScore = 2;
    
    // Essential sections bonus
    const essentialSections = [hasInstallation, hasUsage, hasFeatures, hasContributing, hasLicense].filter(Boolean).length;
    sectionsScore += essentialSections * 2; // +2 per essential section (max +10)
    sectionsScore = Math.min(sectionsScore, 20);
    
    // 3. Badges Score (10 points) - Professional appearance
    let badgesScore = 0;
    if (badges >= 5) badgesScore = 10;
    else if (badges >= 3) badgesScore = 7;
    else if (badges >= 1) badgesScore = 4;
    else badgesScore = 0;
    
    // 4. Code Blocks Score (15 points) - Good examples
    let codeBlocksScore = 0;
    if (codeBlocks >= 5) codeBlocksScore = 15;
    else if (codeBlocks >= 3) codeBlocksScore = 10;
    else if (codeBlocks >= 2) codeBlocksScore = 6;
    else if (codeBlocks >= 1) codeBlocksScore = 3;
    else codeBlocksScore = 0;
    
    // 5. Links Score (10 points) - External resources
    let linksScore = 0;
    if (links >= 10) linksScore = 10;
    else if (links >= 7) linksScore = 8;
    else if (links >= 5) linksScore = 6;
    else if (links >= 3) linksScore = 4;
    else linksScore = 1;
    
    // 6. Images Score (10 points) - Visual aids
    let imagesScore = 0;
    if (images >= 5) imagesScore = 10;
    else if (images >= 3) imagesScore = 7;
    else if (images >= 1) imagesScore = 5;
    else imagesScore = 0;
    
    // 7. Tables Score (10 points) - Structured data
    let tablesScore = 0;
    if (tables >= 3) tablesScore = 10;
    else if (tables >= 2) tablesScore = 7;
    else if (tables >= 1) tablesScore = 4;
    else tablesScore = 0;
    
    // 8. TOC Score (10 points) - Navigation
    const tocScore = toc ? 10 : 0;
    
    // Total Score (out of 100)
    const totalScore = lengthScore + sectionsScore + badgesScore + codeBlocksScore + linksScore + imagesScore + tablesScore + tocScore;
    
    // Convert to 10-point scale
    const finalScore = Math.round((totalScore / 100) * 10 * 10) / 10; // One decimal
    
    // Grade
    let grade = "F";
    if (finalScore >= 9) grade = "A+";
    else if (finalScore >= 8.5) grade = "A";
    else if (finalScore >= 8) grade = "A-";
    else if (finalScore >= 7.5) grade = "B+";
    else if (finalScore >= 7) grade = "B";
    else if (finalScore >= 6.5) grade = "B-";
    else if (finalScore >= 6) grade = "C+";
    else if (finalScore >= 5.5) grade = "C";
    else if (finalScore >= 5) grade = "C-";
    else if (finalScore >= 4) grade = "D";
    else grade = "F";
    
    // ==========================================
    // INSIGHTS & FEEDBACK
    // ==========================================
    
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    // Strengths
    if (lengthScore >= 12) strengths.push("Comprehensive documentation with detailed content");
    if (sectionsScore >= 15) strengths.push("Well-organized structure with clear sections");
    if (badgesScore >= 7) strengths.push("Professional appearance with informative badges");
    if (codeBlocksScore >= 10) strengths.push("Excellent code examples demonstrating usage");
    if (imagesScore >= 7) strengths.push("Great visual documentation with screenshots/diagrams");
    if (tocScore === 10) strengths.push("Easy navigation with table of contents");
    if (tablesScore >= 7) strengths.push("Clear data presentation with structured tables");
    
    // Improvements
    if (lengthScore < 7) improvements.push("Add more detailed content (aim for 1500+ characters)");
    if (!hasInstallation) improvements.push("Include an Installation/Setup section");
    if (!hasUsage) improvements.push("Add Usage examples to help users get started");
    if (!hasFeatures) improvements.push("List key Features to highlight project value");
    if (badgesScore < 4) improvements.push("Consider adding badges (build status, version, license)");
    if (codeBlocksScore < 6) improvements.push("Include more code examples with syntax highlighting");
    if (imagesScore === 0) improvements.push("Add screenshots or diagrams for better visual understanding");
    if (!toc && sections >= 6) improvements.push("Add a Table of Contents for easier navigation");
    if (tablesScore === 0 && length > 1000) improvements.push("Use tables to organize complex information");
    if (!hasLicense) improvements.push("Specify a License to clarify usage terms");
    if (!hasContributing && length > 1500) improvements.push("Add Contributing guidelines to encourage collaboration");
    
    // If excellent
    if (finalScore >= 9) {
      strengths.push("🎉 Outstanding documentation! Your README is a great example for others");
    }
    
    // Insights (0-100 scale)
    const readability = Math.min(100, Math.round(((codeBlocksScore / 15) * 40 + (sectionsScore / 20) * 30 + (tocScore / 10) * 30) * 100));
    const completeness = Math.min(100, Math.round(((lengthScore / 15) * 30 + (sectionsScore / 20) * 40 + (linksScore / 10) * 30) * 100));
    const professionalism = Math.min(100, Math.round(((badgesScore / 10) * 40 + (imagesScore / 10) * 30 + (tablesScore / 10) * 30) * 100));
    
    return {
      score: finalScore,
      grade,
      details: {
        length,
        lengthScore: Math.round((lengthScore / 15) * 10), // Normalize to 0-10
        sections,
        sectionsScore: Math.round((sectionsScore / 20) * 10),
        badges,
        badgesScore: Math.round((badgesScore / 10) * 10),
        codeBlocks,
        codeBlocksScore: Math.round((codeBlocksScore / 15) * 10),
        links,
        linksScore: Math.round((linksScore / 10) * 10),
        images,
        imagesScore: Math.round((imagesScore / 10) * 10),
        tables,
        tablesScore: Math.round((tablesScore / 10) * 10),
        toc,
        tocScore: Math.round((tocScore / 10) * 10),
      },
      strengths,
      improvements,
      insights: {
        readability,
        completeness,
        professionalism,
      },
    };
  } catch (error) {
    console.error('README analysis error:', error);
    throw error;
  }
}
// Repository Health Analysis
// Repository Health Analysis - PRO VERSION
async analyzeRepositoryHealth(username: string): Promise<{
  overallScore: number; // ✅ 0-10 scale
  grade: string;
  metrics: {
    maintenance: {
      score: number; // ✅ 0-100 scale
      commitFrequency: number;
      lastCommitDays: number;
      activeDaysRatio: number;
    };
    issueManagement: {
      score: number; // ✅ 0-100 scale
      averageResolutionDays: number;
      openClosedRatio: number;
      totalIssues: number;
      closedIssues: number;
    };
    pullRequests: {
      score: number; // ✅ 0-100 scale
      mergeRate: number;
      averageMergeDays: number;
      totalPRs: number;
      mergedPRs: number;
    };
    activity: {
      score: number; // ✅ 0-100 scale
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
  trend: 'improving' | 'stable' | 'declining';
}> {
  try {
    console.log(`🏥 Analyzing repository health for: ${username}`);

    // Get all repos (non-fork)
    const reposResponse = await this.octokit.request('GET /users/{username}/repos', {
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

    // ==========================================
    // 1. MAINTENANCE SCORE (0-100)
    // ==========================================
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let totalCommits = 0;
    let recentCommits = 0;
    let activeDays = new Set<string>();
    let lastCommitDate = new Date(0);

    for (const repo of repos.slice(0, 20)) {
      try {
        const commitsResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/commits',
          {
            owner: username,
            repo: repo.name,
            since: sixMonthsAgo.toISOString(),
            per_page: 100,
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
        console.log(`Skipping commits for ${repo.name}`);
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

    // ==========================================
    // 2. ISSUE MANAGEMENT SCORE (0-100)
    // ==========================================
    
    let totalIssues = 0;
    let closedIssues = 0;
    let totalResolutionTime = 0;
    let resolvedIssuesCount = 0;

    for (const repo of repos.slice(0, 10)) {
      try {
        const closedIssuesResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/issues',
          {
            owner: username,
            repo: repo.name,
            state: 'closed',
            per_page: 50,
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

        const openIssuesResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/issues',
          {
            owner: username,
            repo: repo.name,
            state: 'open',
            per_page: 50,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        const open = openIssuesResponse.data.filter((issue: any) => !issue.pull_request);
        totalIssues += open.length + closed.length;
      } catch (error) {
        console.log(`Skipping issues for ${repo.name}`);
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

    // ==========================================
    // 3. PULL REQUEST SCORE (0-100)
    // ==========================================
    
    let totalPRs = 0;
    let mergedPRs = 0;
    let totalMergeTime = 0;
    let mergedPRsCount = 0;

    for (const repo of repos.slice(0, 10)) {
      try {
        const prsResponse = await this.octokit.request(
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
        console.log(`Skipping PRs for ${repo.name}`);
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

    // ==========================================
    // 4. ACTIVITY SCORE (0-100)
    // ==========================================
    
    const contributors = new Set<string>();
    let staleBranches = 0;
    let stalePRs = 0;

    for (const repo of repos.slice(0, 10)) {
      try {
        const contributorsResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/contributors',
          {
            owner: username,
            repo: repo.name,
            per_page: 100,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        contributorsResponse.data.forEach((contributor: any) => {
          contributors.add(contributor.login);
        });

        const branchesResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/branches',
          {
            owner: username,
            repo: repo.name,
            per_page: 100,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        for (const branch of branchesResponse.data) {
          try {
            const commitResponse = await this.octokit.request(
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

        const openPRsResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/pulls',
          {
            owner: username,
            repo: repo.name,
            state: 'open',
            per_page: 100,
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
        console.log(`Skipping activity for ${repo.name}`);
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

    // ==========================================
    // OVERALL SCORE (0-10) ✅
    // ==========================================

    const maintenanceScore10 = Math.round(maintenanceScore / 10 * 10) / 10; // 8.5
    const issueScore10 = Math.round(issueScore / 10 * 10) / 10; // 7.5
    const prScore10 = Math.round(prScore / 10 * 10) / 10; // 9.0
    const activityScore10 = Math.round(activityScore / 10 * 10) / 10; // 6.5
    
    // Weighted average (0-100), then convert to 0-10
    const overallScore = Math.round(
      (maintenanceScore10 * 0.3 + issueScore10 * 0.25 + prScore10 * 0.25 + activityScore10 * 0.2) * 10
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

// ==========================================
// INSIGHTS & RECOMMENDATIONS
// ==========================================

const strengths: string[] = [];
const concerns: string[] = [];
const recommendations: string[] = [];

if (maintenanceScore >= 80) strengths.push('Excellent maintenance with consistent commit activity');
if (issueScore >= 80) strengths.push('Strong issue management and quick resolution times');
if (prScore >= 80) strengths.push('Efficient PR workflow with high merge rates');
if (contributorCount >= 5) strengths.push('Active community with multiple contributors');

if (lastCommitDays > 30) concerns.push('No recent commits in the last month');
if (averageResolutionDays > 30) concerns.push('Issues take long to resolve (30+ days average)');
if (mergeRate < 50) concerns.push('Low PR merge rate indicates workflow issues');
if (staleBranches > 5) concerns.push(`${staleBranches} stale branches need cleanup`);
if (stalePRs > 3) concerns.push(`${stalePRs} stale PRs need attention`);

if (commitFrequency < 2) recommendations.push('Increase commit frequency to show active development');
if (averageResolutionDays > 14) recommendations.push('Set up issue triaging to improve response times');
if (staleBranches > 0) recommendations.push('Clean up stale branches to maintain repository hygiene');
if (contributorCount === 1) recommendations.push('Encourage community contributions with good documentation');

let trend: 'improving' | 'stable' | 'declining' = 'stable';
if (maintenanceScore >= 70 && lastCommitDays <= 14) trend = 'improving';
else if (lastCommitDays > 60 || maintenanceScore < 40) trend = 'declining';

return {
  overallScore, // ✅ 8.5/10
  grade,
  metrics: {
    maintenance: {
      score: maintenanceScore10, // ✅ 8.5/10 (100'den çevrildi)
      commitFrequency: Math.round(commitFrequency * 10) / 10,
      lastCommitDays,
      activeDaysRatio: Math.round(activeDaysRatio * 10) / 10,
    },
    issueManagement: {
      score: issueScore10, // ✅ 7.5/10
      averageResolutionDays: Math.round(averageResolutionDays * 10) / 10,
      openClosedRatio: Math.round(openClosedRatio * 10) / 10,
      totalIssues,
      closedIssues,
    },
    pullRequests: {
      score: prScore10, // ✅ 9.0/10
      mergeRate: Math.round(mergeRate * 10) / 10,
      averageMergeDays: Math.round(averageMergeDays * 10) / 10,
      totalPRs,
      mergedPRs,
    },
    activity: {
      score: activityScore10, // ✅ 6.5/10
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
  trend,
};
  } catch (error) {
    console.error('Repository health analysis error:', error);
    throw error;
  }
}

async analyzeDeveloperPatterns(username: string): Promise<{
  
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
  try {
    console.log(`🎨 Analyzing developer patterns for: ${username}`);

    // Get user's repos
    const reposResponse = await this.octokit.request('GET /users/{username}/repos', {
      username,
      per_page: 100,
      sort: 'updated',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const repos = reposResponse.data.filter((repo: any) => !repo.fork);
    console.log(`📦 Total repos found: ${repos.length}`);
    console.log(`📦 First 20 repos:`, repos.slice(0, 20).map(r => r.name));

    if (repos.length === 0) {
      throw new Error('No repositories found');
    }

    // ==========================================
    // 1. COMMIT PATTERNS ANALYSIS
    // ==========================================
    
    const hourlyActivity = Array(24).fill(0);
    const weeklyActivity = Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let totalCommits = 0;
    let commitDates = new Set<string>();
    const commitMessages: string[] = [];
    
    for (const repo of repos.slice(0, 20)) {
      try {
        const commitsResponse = await this.octokit.request(
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
        });
      } catch (error) {
        console.log(`Skipping commits for ${repo.name}`);
        continue;
      }
    }

    console.log(`🎯 FINAL RESULTS:`);
    console.log(`  Total commits analyzed: ${totalCommits}`);
    console.log(`  Hourly activity:`, hourlyActivity);
    console.log(`  Peak hours:`, hourlyActivity.map((count, hour) => ({ hour, count })).sort((a, b) => b.count - a.count).slice(0, 3));

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
    const commitMessageQuality = Math.min(100, Math.round((qualityScore / commitMessages.length) * 5));

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

    // ==========================================
    // 2. CODE QUALITY ANALYSIS
    // ==========================================

    let branchCount = 0;
    let avgCommitSize = 0;
    let totalFilesChanged = 0;
    let commitCount = 0;
    let hasReadme = 0;
    let hasTests = 0;
    let hasDocs = 0;

    for (const repo of repos.slice(0, 15)) {
      try {
        const branchesResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/branches',
          {
            owner: username,
            repo: repo.name,
            per_page: 100,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );
        branchCount += branchesResponse.data.length;

        const commitsResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/commits',
          {
            owner: username,
            repo: repo.name,
            per_page: 50,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        for (const commit of commitsResponse.data.slice(0, 20)) {
          try {
            const commitDetailResponse = await this.octokit.request(
              'GET /repos/{owner}/{repo}/commits/{ref}',
              {
                owner: username,
                repo: repo.name,
                ref: commit.sha,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28',
                },
              }
            );
            
            totalFilesChanged += commitDetailResponse.data.files?.length || 0;
            commitCount++;
          } catch (error) {
            continue;
          }
        }

        try {
          await this.octokit.request('GET /repos/{owner}/{repo}/readme', {
            owner: username,
            repo: repo.name,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          });
          hasReadme++;
        } catch {}

        try {
          const contentsResponse = await this.octokit.request(
            'GET /repos/{owner}/{repo}/contents',
            {
              owner: username,
              repo: repo.name,
              headers: {
                'X-GitHub-Api-Version': '2022-11-28',
              },
            }
          );
          
          const hasTestFolder = contentsResponse.data.some((item: any) => 
            item.name.toLowerCase().includes('test') || 
            item.name.toLowerCase().includes('spec')
          );
          if (hasTestFolder) hasTests++;

          const hasDocsFolder = contentsResponse.data.some((item: any) => 
            item.name.toLowerCase() === 'docs' || 
            item.name.toLowerCase() === 'documentation'
          );
          if (hasDocsFolder) hasDocs++;
        } catch {}

      } catch (error) {
        console.log(`Skipping code quality analysis for ${repo.name}`);
        continue;
      }
    }

    avgCommitSize = commitCount > 0 ? totalFilesChanged / commitCount : 0;

    const avgBranchesPerRepo = repos.length > 0 ? branchCount / repos.length : 1;
    let branchManagement = 50;
    if (avgBranchesPerRepo >= 2 && avgBranchesPerRepo <= 5) branchManagement = 90;
    else if (avgBranchesPerRepo > 5 && avgBranchesPerRepo <= 10) branchManagement = 70;
    else if (avgBranchesPerRepo > 10) branchManagement = 40;
    else branchManagement = 60;

    let commitSize = 50;
    if (avgCommitSize >= 3 && avgCommitSize <= 10) commitSize = 90;
    else if (avgCommitSize > 10 && avgCommitSize <= 20) commitSize = 70;
    else if (avgCommitSize > 20) commitSize = 40;
    else if (avgCommitSize < 3) commitSize = 60;

    const reviewEngagement = 75;

    const readmeRatio = repos.length > 0 ? (hasReadme / repos.length) * 100 : 0;
    const testRatio = repos.length > 0 ? (hasTests / repos.length) * 100 : 0;
    const docsRatio = repos.length > 0 ? (hasDocs / repos.length) * 100 : 0;
    const documentationHabits = Math.round((readmeRatio * 0.5 + testRatio * 0.3 + docsRatio * 0.2));

    const codeQualityScore = Math.round(
      ((branchManagement * 0.25 + commitSize * 0.25 + reviewEngagement * 0.25 + documentationHabits * 0.25) / 10) * 10
    ) / 10;

    // ==========================================
    // 3. WORK-LIFE BALANCE ANALYSIS
    // ==========================================

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

    // ==========================================
    // 4. COLLABORATION ANALYSIS
    // ==========================================

    let ownedRepos = 0;
    let forkedRepos = 0;
    let prCount = 0;
    let contributorCounts: number[] = [];

    for (const repo of repos.slice(0, 15)) {
      try {
        if (repo.fork) forkedRepos++;
        else ownedRepos++;

        const prsResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/pulls',
          {
            owner: username,
            repo: repo.name,
            state: 'all',
            per_page: 100,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );
        prCount += prsResponse.data.length;

        const contributorsResponse = await this.octokit.request(
          'GET /repos/{owner}/{repo}/contributors',
          {
            owner: username,
            repo: repo.name,
            per_page: 100,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );
        contributorCounts.push(contributorsResponse.data.length);

      } catch (error) {
        console.log(`Skipping collaboration analysis for ${repo.name}`);
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

    // ==========================================
    // 5. TECHNOLOGY ANALYSIS
    // ==========================================

    const modernTech = new Set<string>();
    const legacyTech = new Set<string>();

    for (const repo of repos.slice(0, 20)) {
      try {
        try {
          const packageResponse = await this.octokit.request(
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

      } catch (error) {
        continue;
      }
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

    // ==========================================
    // 6. PRODUCTIVITY ANALYSIS
    // ==========================================

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
    console.error('Developer patterns analysis error:', error);
    throw error;
  }
}
  
}


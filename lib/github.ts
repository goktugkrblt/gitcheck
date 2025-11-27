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
  
}


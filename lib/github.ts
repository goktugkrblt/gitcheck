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

// PRO Feature Imports
import { analyzeReadmeQuality } from "./pro/readme-quality";
import { analyzeRepositoryHealth } from "./pro/repo-health";
import { analyzeDeveloperPatterns } from "./pro/dev-patterns";

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

  // ==========================================
  // CORE METHODS (kept in github.ts)
  // ==========================================

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

    const allDays = calendar.weeks.flatMap(week => week.contributionDays);
    
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

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

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
      mostActiveHour: 14,
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
      const { data: repoData } = await this.octokit.repos.get({ owner, repo });
      metrics.isArchived = repoData.archived;
      metrics.isFork = repoData.fork;
      metrics.openIssuesCount = repoData.open_issues_count;
      metrics.hasLicense = !!repoData.license;

      try {
        const { data: readme } = await this.octokit.repos.getReadme({ owner, repo });
        metrics.hasReadme = true;
        metrics.readmeLength = Buffer.from(readme.content, 'base64').toString().length;
      } catch {}

      try {
        const { data: commits } = await this.octokit.repos.listCommits({
          owner,
          repo,
          per_page: 100,
        });
        
        if (commits.length > 0) {
          metrics.lastCommitDate = commits[0].commit.author?.date || '';
          
          const firstCommitDate = new Date(commits[commits.length - 1].commit.author?.date || '');
          const lastCommitDate = new Date(commits[0].commit.author?.date || '');
          const monthsDiff = (lastCommitDate.getTime() - firstCommitDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          metrics.commitFrequency = Math.round(commits.length / Math.max(monthsDiff, 1));
        }
      } catch {}

      try {
        const { data: contributors } = await this.octokit.repos.listContributors({
          owner,
          repo,
          per_page: 100,
        });
        metrics.contributorsCount = contributors.length;
      } catch {}

      try {
        const { data: releases } = await this.octokit.repos.listReleases({
          owner,
          repo,
          per_page: 100,
        });
        metrics.releasesCount = releases.length;
      } catch {}

      try {
        const { data: branches } = await this.octokit.repos.listBranches({
          owner,
          repo,
          per_page: 100,
        });
        metrics.branchesCount = branches.length;
        metrics.hasCI = branches.some(b => b.protection?.required_status_checks);
      } catch {}

      metrics.techStack = await this.detectTechStack(owner, repo);

    } catch (error) {
      console.error(`Error getting detailed metrics for ${owner}/${repo}:`, error);
    }

    return metrics;
  }

  async detectTechStack(owner: string, repo: string): Promise<string[]> {
    const techStack = new Set<string>();

    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'package.json',
      });

      if ('content' in data) {
        const packageJson = JSON.parse(Buffer.from(data.content, 'base64').toString());
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        if (deps['next']) techStack.add('Next.js');
        if (deps['react']) techStack.add('React');
        if (deps['vue']) techStack.add('Vue');
        if (deps['@angular/core']) techStack.add('Angular');
        if (deps['express']) techStack.add('Express');
        if (deps['nestjs']) techStack.add('NestJS');
        
        if (deps['mongoose'] || deps['mongodb']) techStack.add('MongoDB');
        if (deps['pg'] || deps['postgres']) techStack.add('PostgreSQL');
        if (deps['mysql']) techStack.add('MySQL');
        if (deps['redis']) techStack.add('Redis');
        if (deps['@prisma/client']) techStack.add('Prisma');
        
        if (deps['typescript']) techStack.add('TypeScript');
        if (deps['tailwindcss']) techStack.add('Tailwind CSS');
        if (deps['graphql']) techStack.add('GraphQL');
        if (deps['jest'] || deps['vitest']) techStack.add('Testing');
      }
    } catch {}

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

    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'package.json',
      });

      if ('content' in data) {
        const packageJson = JSON.parse(Buffer.from(data.content, 'base64').toString());
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        if (deps['next']) frameworks.add('Next.js');
        if (deps['react'] && !deps['next']) frameworks.add('React');
        if (deps['vue']) frameworks.add('Vue.js');
        if (deps['@angular/core']) frameworks.add('Angular');
        if (deps['svelte']) frameworks.add('Svelte');
        if (deps['nuxt']) frameworks.add('Nuxt.js');

        if (deps['express']) frameworks.add('Express');
        if (deps['@nestjs/core']) frameworks.add('NestJS');
        if (deps['fastify']) frameworks.add('Fastify');

        if (deps['react-native']) frameworks.add('React Native');
        if (deps['@ionic/angular']) frameworks.add('Ionic');

        if (deps['tailwindcss']) frameworks.add('Tailwind CSS');
        if (deps['bootstrap']) frameworks.add('Bootstrap');

        if (deps['electron']) frameworks.add('Electron');
        if (deps['gatsby']) frameworks.add('Gatsby');
      }
    } catch {}

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

  // ==========================================
  // CACHE HELPERS
  // ==========================================

  shouldRefetchData(cachedRepoCount: number, currentRepoCount: number, lastScan: Date | null, maxAgeHours: number = 24): boolean {
    if (cachedRepoCount !== currentRepoCount) {
      console.log('🔄 Repo count changed, refetching...');
      return true;
    }

    if (!lastScan) {
      console.log('🔄 No previous scan, fetching...');
      return true;
    }

    const hoursSinceLastScan = (Date.now() - new Date(lastScan).getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastScan > maxAgeHours) {
      console.log(`🔄 Cache expired (${Math.round(hoursSinceLastScan)}h old), refetching...`);
      return true;
    }

    console.log(`✅ Using cached data (${Math.round(hoursSinceLastScan)}h old)`);
    return false;
  }

  async getLanguageStatsCached(
    repos: GitHubRepo[], 
    cachedLanguages: any,
    cachedRepoCount: number,
    lastScan: Date | null
  ): Promise<LanguageStats> {
    const shouldRefetch = this.shouldRefetchData(cachedRepoCount, repos.length, lastScan, 168);

    if (!shouldRefetch && cachedLanguages) {
      console.log('📦 Using cached languages');
      return cachedLanguages;
    }

    console.log('🔍 Fetching fresh language data...');
    return await this.getLanguageStats(repos);
  }

  async detectFrameworksCached(
    repos: GitHubRepo[],
    cachedFrameworks: any,
    cachedRepoCount: number,
    lastScan: Date | null
  ): Promise<Record<string, number>> {
    const shouldRefetch = this.shouldRefetchData(cachedRepoCount, repos.length, lastScan, 168);

    if (!shouldRefetch && cachedFrameworks) {
      console.log('📦 Using cached frameworks');
      return cachedFrameworks;
    }

    console.log('🔍 Detecting frameworks...');
    return await this.detectFrameworks(repos);
  }

  async getOrganizationsCached(
    username: string,
    cachedOrgCount: number,
    lastScan: Date | null
  ): Promise<string[]> {
    const hoursSinceLastScan = lastScan ? (Date.now() - new Date(lastScan).getTime()) / (1000 * 60 * 60) : Infinity;
    
    if (hoursSinceLastScan < 168 && cachedOrgCount > 0) {
      console.log('📦 Using cached organization count');
      return [];
    }

    console.log('🔍 Fetching organizations...');
    return await this.getOrganizations(username);
  }

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

  // ==========================================
  // PRO FEATURES DELEGATION
  // ==========================================

  async analyzeReadmeQuality(username: string) {
    return analyzeReadmeQuality(this.octokit, username);
  }

  async analyzeRepositoryHealth(username: string) {
    return analyzeRepositoryHealth(this.octokit, username);
  }

  async analyzeDeveloperPatterns(username: string) {
    return analyzeDeveloperPatterns(this.octokit, username);
  }
}
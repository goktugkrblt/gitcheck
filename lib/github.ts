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
}
import { Octokit } from "@octokit/rest";
import { GitHubUser, GitHubRepo, LanguageStats } from "@/types";

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
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
}
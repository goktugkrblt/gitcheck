// lib/github-graphql.ts
// 🚀 GitHub GraphQL Optimization
// Replaces 300+ REST API calls with 1 GraphQL query

import { graphql } from "@octokit/graphql";
import { LanguageStats, GitHubRepo } from "@/types";

interface GraphQLRepoData {
  name: string;
  description: string;
  stargazerCount: number;
  forkCount: number;
  isArchived: boolean;
  isFork: boolean;
  url: string;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  languages: {
    edges: Array<{
      size: number;
      node: {
        name: string;
        color: string;
      };
    }>;
  };
  defaultBranchRef: {
    target: {
      history: {
        totalCount: number;
      };
    };
  } | null;
  object: {
    text: string;
  } | null;
}

export class GitHubGraphQLService {
  private graphqlClient: any;

  constructor(accessToken: string) {
    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${accessToken}`,
      },
    });
  }

  /**
   * 🚀 REPLACES 300+ REST CALLS WITH 1 GRAPHQL QUERY
   * 
   * Before: 
   * - getRepositories: 1 request
   * - getLanguageStats: 100 requests (1 per repo)
   * - detectFrameworks: 200 requests (2 per repo)
   * TOTAL: 301 requests
   * 
   * After:
   * - getRepositoriesWithDetails: 1 request
   * TOTAL: 1 request
   * 
   * Improvement: 99.7% reduction! 🎉
   */
  async getRepositoriesWithDetails(username: string, limit: number = 100) {
    const query = `
      query($username: String!, $limit: Int!) {
        user(login: $username) {
          repositories(
            first: $limit, 
            orderBy: {field: UPDATED_AT, direction: DESC},
            ownerAffiliations: OWNER
          ) {
            totalCount
            nodes {
              name
              description
              stargazerCount
              forkCount
              isArchived
              isFork
              url
              createdAt
              updatedAt
              primaryLanguage {
                name
                color
              }
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                totalSize
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
              object(expression: "HEAD:package.json") {
                ... on Blob {
                  text
                }
              }
            }
          }
        }
      }
    `;

    try {
      const result: any = await this.graphqlClient(query, { 
        username, 
        limit 
      });

      const repos = result.user.repositories.nodes;
      
      console.log(`✅ Fetched ${repos.length} repos in 1 GraphQL query`);

      return {
        repos: this.formatRepos(repos),
        languages: this.extractLanguages(repos),
        frameworks: this.extractFrameworks(repos),
        totalRepoCount: result.user.repositories.totalCount,
      };
    } catch (error) {
      console.error('❌ GraphQL query failed:', error);
      throw error;
    }
  }

  /**
   * Format GraphQL repos to match REST format
   */
  private formatRepos(graphqlRepos: GraphQLRepoData[]): GitHubRepo[] {
    return graphqlRepos.map(repo => ({
      id: 0, // Not used
      name: repo.name,
      full_name: `owner/${repo.name}`, // Will be updated
      description: repo.description || null,
      html_url: repo.url,
      stargazers_count: repo.stargazerCount,
      forks_count: repo.forkCount,
      archived: repo.isArchived,
      fork: repo.isFork,
      language: repo.primaryLanguage?.name || null,
      owner: {
        login: '', // Will be updated
      },
      // Add other fields as needed
    } as any));
  }

  /**
   * Extract language statistics from GraphQL response
   */
  private extractLanguages(repos: GraphQLRepoData[]): LanguageStats {
    const languages: Record<string, number> = {};

    repos.forEach(repo => {
      if (!repo.isFork && repo.languages.edges.length > 0) {
        repo.languages.edges.forEach(edge => {
          const lang = edge.node.name;
          const bytes = edge.size;
          languages[lang] = (languages[lang] || 0) + bytes;
        });
      }
    });

    // Convert to percentages
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    const percentages: LanguageStats = {};

    Object.entries(languages).forEach(([lang, bytes]) => {
      percentages[lang] = Number(((bytes / total) * 100).toFixed(1));
    });

    return percentages;
  }

  /**
   * Extract frameworks from package.json in GraphQL response
   */
  private extractFrameworks(repos: GraphQLRepoData[]): Record<string, number> {
    const frameworkCounts: Record<string, number> = {};

    repos.forEach(repo => {
      if (repo.isFork || !repo.object?.text) return;

      try {
        const packageJson = JSON.parse(repo.object.text);
        const deps = { 
          ...packageJson.dependencies, 
          ...packageJson.devDependencies 
        };

        const detectedFrameworks = this.detectFrameworksFromDeps(deps);
        detectedFrameworks.forEach(framework => {
          frameworkCounts[framework] = (frameworkCounts[framework] || 0) + 1;
        });
      } catch {
        // Invalid package.json, skip
      }
    });

    return frameworkCounts;
  }

  /**
   * Detect frameworks from package.json dependencies
   */
  private detectFrameworksFromDeps(deps: Record<string, string>): string[] {
    const frameworks = new Set<string>();

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

    return Array.from(frameworks);
  }
}
import { Plan } from "@prisma/client";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  size: number;
  has_readme: boolean;
  license: {
    name: string;
  } | null;
}

export interface LanguageStats {
  [language: string]: number; // percentage
}

export interface GitHubMetrics {
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: LanguageStats;
  avgRepoQuality: number;
  consistencyScore: number;
  ossContributions: number;
}

export interface ProfileData {
  score: number;
  percentile?: number;
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: LanguageStats;
  topRepos: TopRepo[];
  contributions: ContributionData[];
  strengths?: string[];
  weaknesses?: string[];
  roadmap?: RoadmapItem[];
  marketValue?: MarketValue;
}

export interface TopRepo {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
  qualityScore: number;
}

export interface ContributionData {
  date: string;
  count: number;
}

export interface RoadmapItem {
  title: string;
  description: string;
  impact: number; // score impact
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
}

export interface MarketValue {
  min: number;
  max: number;
  currency: string;
  location: string;
  improvements: ValueImprovement[];
}

export interface ValueImprovement {
  skill: string;
  impact: number; // $ impact
  description: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  githubUsername: string;
  plan: Plan;
  subscriptionEnd: Date | null;
}
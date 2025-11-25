import { Plan } from "@prisma/client";


// NextAuth type augmentation for v5
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
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
  owner: {
    login: string;
    id: number;
    avatar_url?: string;
    type?: string;
  };
  stargazers_count?: number;
  forks_count?: number;
  language: string | null;
  fork?: boolean;
  size?: number;
  updated_at: string;
  topics?: string[];
  license?: {
    key: string;
    name: string;
  } | null;
  html_url: string;
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

// types/index.ts dosyasının SONUNA ekle (mevcut kodları silme):

// Yeni eklenecek tipler:
export interface GitHubContributions {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
  contributionCalendar: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        contributionCount: number;
        date: string;
      }>;
    }>;
  };
  commitsByRepo: Array<{
    repoName: string;
    commitCount: number;
  }>;
}

export interface RepoDetailedMetrics {
  hasReadme: boolean;
  readmeLength?: number;
  hasLicense: boolean;
  hasCI: boolean;
  commitFrequency: number; // commits per month
  lastCommitDate: string;
  openIssuesCount: number;
  contributorsCount: number;
  releasesCount: number;
  branchesCount: number;
  isArchived: boolean;
  isFork: boolean;
  techStack: string[];
}

export interface PullRequestMetrics {
  totalPRs: number;
  mergedPRs: number;
  openPRs: number;
  closedPRs: number;
  averageMergeTime?: number; // in hours
  contributedRepos: string[];
}

export interface ActivityMetrics {
  currentStreak: number;
  longestStreak: number;
  averageCommitsPerDay: number;
  mostActiveDay: string;
  mostActiveHour: number;
  weekendActivity: number; // percentage
}

export interface DeveloperProfile extends ProfileData {
  contributions: GitHubContributions;
  pullRequests: PullRequestMetrics;
  activity: ActivityMetrics;
  organizations: string[];
  gistsCount: number;
  followersCount: number;
  followingCount: number;
  accountAge: number; // in years
  hireable: boolean;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
  twitter?: string;
}
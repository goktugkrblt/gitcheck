import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-500";
  if (score >= 6) return "text-blue-500";
  if (score >= 4) return "text-yellow-500";
  return "text-red-500";
}

export function getScoreBadge(score: number): string {
  if (score >= 9) return "Elite";
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Great";
  if (score >= 6) return "Good";
  if (score >= 5) return "Average";
  return "Beginner";
}
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - GitCheck",
  description: "Insights on developer analytics, GitHub best practices, statistical scoring, and data-driven career growth for developers.",
  keywords: [
    "developer analytics blog",
    "GitHub tips",
    "developer scoring",
    "code metrics",
    "GitHub best practices",
    "developer career growth",
    "statistical analysis",
    "percentile rankings",
    "GitHub profile optimization",
    "developer insights"
  ],
  openGraph: {
    title: "GitCheck Blog - Developer Analytics Insights",
    description: "Learn about developer analytics, GitHub optimization, and data-driven career growth strategies.",
    type: "website",
    url: "https://gitcheck.me/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitCheck Blog - Developer Analytics Insights",
    description: "Learn about developer analytics, GitHub optimization, and data-driven career growth strategies.",
  },
  alternates: {
    canonical: "https://gitcheck.me/blog"
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

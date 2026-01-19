import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CookieConsent } from "@/components/cookie-consent";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GitCheck - GitHub Analytics & Developer Score Platform",
    template: "%s | GitCheck"
  },
  description: "GitCheck: The leading GitHub analytics platform. Get your developer score (0-100), global ranking, and comprehensive insights. No login required - analyze any GitHub username instantly. Used by 10K+ developers worldwide.",
  keywords: [
    "gitcheck",
    "GitCheck",
    "git check",
    "github check",
    "github analytics",
    "github developer score",
    "github profile analyzer",
    "github stats",
    "github metrics",
    "developer score calculator",
    "github ranking",
    "github leaderboard",
    "developer analytics",
    "code quality metrics",
    "github contribution analysis",
    "github profile optimization",
    "developer portfolio",
    "github insights",
    "github verified",
    "public github analytics",
    "no login github analytics",
    "github developer ranking",
    "z-score github",
    "statistical github analysis",
    "github profile checker"
  ],
  authors: [{ name: "Goktug Karabulut", url: "https://goktug.info" }],
  creator: "Goktug Karabulut",
  publisher: "GitCheck",
  metadataBase: new URL("https://gitcheck.me"),
  alternates: {
    canonical: "https://gitcheck.me"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gitcheck.me",
    title: "GitCheck - GitHub Analytics & Developer Score Platform",
    description: "GitCheck: The leading GitHub analytics platform. Get your developer score (0-100), global ranking, and comprehensive insights. No login required - analyze any GitHub username instantly.",
    siteName: "GitCheck",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GitCheck - Leading GitHub Analytics Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GitCheck - GitHub Analytics Platform",
    description: "GitCheck: Get your GitHub developer score (0-100), global ranking, and comprehensive insights. No login required - analyze any username instantly. Used by 10K+ developers.",
    images: ["/og-image.png"],
    creator: "@goktugkrblt"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code",     
  },
  category: "technology"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* ... (head aynı) */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <CookieConsent />

        {/* ✅ BRAND SCHEMA - For "gitcheck" keyword dominance */}
        <Script
          id="brand-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              "name": "GitCheck",
              "alternateName": ["gitcheck", "GitCheck.me", "git check"],
              "url": "https://gitcheck.me",
              "logo": "https://gitcheck.me/og-image.jpg",
              "description": "GitCheck is the leading GitHub analytics platform providing developer scores (0-100), global rankings, and comprehensive insights for any GitHub username. No login required.",
              "slogan": "GitHub Checked",
              "brand": {
                "@type": "Brand",
                "name": "GitCheck"
              }
            })
          }}
        />

        {/* ✅ ORGANIZATION SCHEMA */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "GitCheck",
              "alternateName": "gitcheck",
              "url": "https://gitcheck.me",
              "logo": "https://gitcheck.me/og-image.jpg",
              "description": "GitCheck is the leading GitHub analytics platform providing developer scores (0-100), global rankings, and comprehensive insights. No authentication required - analyze any GitHub username instantly.",
              "founder": {
                "@type": "Person",
                "name": "Goktug Karabulut",
                "url": "https://goktug.info"
              },
              "foundingDate": "2025",
              "sameAs": [
                "https://twitter.com/goktugkrblt"
              ],
              "knowsAbout": ["GitHub Analytics", "Developer Metrics", "Code Quality Analysis", "Developer Scoring", "GitHub API"],
              "areaServed": "Worldwide"
            })
          }}
        />

        {/* ✅ WEBSITE SCHEMA */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GitCheck - GitHub Analytics Platform",
              "alternateName": ["gitcheck", "GitCheck.me", "git check"],
              "url": "https://gitcheck.me",
              "description": "GitCheck: The leading GitHub analytics platform. Get your developer score (0-100), global ranking, and comprehensive insights. No login required - analyze any GitHub username instantly.",
              "inLanguage": "en-US",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://gitcheck.me/dashboard?username={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "keywords": "gitcheck, github analytics, developer score, github ranking, github leaderboard"
            })
          }}
        />

        {/* ✅ SOFTWARE APPLICATION SCHEMA */}
        <Script
          id="software-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "GitCheck",
              "alternateName": "gitcheck",
              "url": "https://gitcheck.me",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "description": "GitCheck is a GitHub analytics platform that provides developer scores (0-100), global rankings, and comprehensive insights for any GitHub username. No login required.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "500",
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Person",
                "name": "Goktug Karabulut"
              },
              "datePublished": "2025-01-01",
              "keywords": "gitcheck, github analytics, developer score, github stats"
            })
          }}
        />

        {/* ✅ FAQ SCHEMA - FİYAT GÜNCELLENDİ */}
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is my GitHub data secure?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. GitCheck is a public analytics service - we only access data that is already publicly visible on GitHub. No authentication required, no OAuth permissions, no access to private repositories. We use GitHub's public API to analyze publicly available information only."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What's included in the PRO plan?",
                  "acceptedAnswer": {
                    "@type": "Answer",
    "text": "The platform provides a comprehensive 0-100 developer score based on four weighted components: Impact (35%), Code Quality (30%), Consistency (20%), and Collaboration (15%). Scores use z-score normalization against a baseline of 100K+ developers for meaningful percentile-based rankings."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to create an account?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. GitCheck is a public analytics service - simply enter any GitHub username to analyze. No registration, no authentication, no OAuth permissions required."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is my developer score calculated?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Your score is calculated from 4 weighted components: Impact (35%) - stars, forks, watchers; Code Quality (30%) - README, documentation; Consistency (20%) - commit frequency, contribution patterns; Collaboration (15%) - PRs, issues, discussions. Uses z-score normalization for percentile-based 0-100 scoring."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How often can I analyze a profile?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Each GitHub username can be analyzed once every 24 hours due to our caching system. This prevents API abuse and ensures fast response times (~50ms for cached results vs 30-45s for full analysis)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What programming languages are supported?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "GitCheck analyzes all programming languages that GitHub recognizes. We track language usage, detect your primary tech stack, and show language evolution over time."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How often is my data updated?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Analysis results are cached for 24 hours to respect GitHub API limits and improve performance. After the cache expires, the next analysis will fetch fresh data. Real-time global rankings are updated continuously as new profiles are analyzed."
                  }
                }
              ]
            })
          }}
        />

        {/* ✅ SERVICE SCHEMA - FREE PUBLIC SERVICE */}
        <Script
          id="service-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "GitCheck - Public GitHub Analytics",
              "description": "Free public GitHub analytics service with statistical developer scoring, global rankings, and comprehensive insights. No authentication required.",
              "provider": {
                "@type": "Organization",
                "name": "GitCheck"
              },
              "serviceType": "Developer Analytics Platform",
              "areaServed": "Worldwide",
              "availableChannel": {
                "@type": "ServiceChannel",
                "serviceUrl": "https://gitcheck.me"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
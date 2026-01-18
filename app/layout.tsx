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
    default: "GitCheck - GitHub Checked",
    template: "%s | GitCheck"
  },
  description: "Public GitHub analytics platform with no authentication required. Enter any username to get a 0-100 developer score, global ranking, and comprehensive insights using statistical algorithms.",
  keywords: [
    "GitHub analytics",
    "developer tools",
    "GitHub profile analyzer",
    "developer score",
    "code metrics",
    "GitHub stats",
    "contribution tracking",
    "developer portfolio",
    "gitcheck",
    "github verified",
    "github checked",
    "public github analytics",
    "no login github analytics",
    "github developer ranking",
    "z-score github",
    "statistical github analysis"
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
    title: "GitCheck - GitHub Checked",
    description: "Public GitHub analytics platform. No authentication required - enter any username to get statistical developer scoring, global ranking, and comprehensive insights.",
    siteName: "GitCheck",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "GitCheck - GitHub Analytics Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GitCheck - GitHub Checked",
    description: "Public GitHub analytics - no login required. Statistical developer scoring, global ranking, and comprehensive insights for any GitHub username.",
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

        {/* ✅ ORGANIZATION SCHEMA */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "GitCheck",
              "url": "https://gitcheck.me",
              "logo": "https://gitcheck.me/og-image.jpg",
              "description": "Public GitHub analytics platform with statistical developer scoring, global rankings, and comprehensive insights. No authentication required - analyze any GitHub username.",
              "founder": {
                "@type": "Person",
                "name": "Goktug Karabulut",
                "url": "https://goktug.info"
              },
              "sameAs": [
                "https://twitter.com/goktugkrblt"
              ]
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
              "name": "GitCheck",
              "url": "https://gitcheck.me",
              "description": "Public GitHub analytics platform - no login required. Statistical developer scoring for any GitHub username.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://gitcheck.me/dashboard?username={search_term_string}",
                "query-input": "required name=search_term_string"
              }
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
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
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
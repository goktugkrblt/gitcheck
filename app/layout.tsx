import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "GitCheck - GitHub Quantified",
    template: "%s | GitCheck"
  },
  description: "Transform your GitHub contributions into quantifiable career metrics. Real-time analytics, developer scoring, and insights powered by advanced algorithms.",
  keywords: [
    "GitHub analytics",
    "developer tools",
    "GitHub profile analyzer",
    "developer score",
    "code metrics",
    "GitHub stats",
    "contribution tracking",
    "developer portfolio"
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
    title: "GitCheck - GitHub Quantified",
    description: "Transform your GitHub contributions into quantifiable career metrics with real-time analytics and developer scoring.",
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
    title: "GitCheck - GitHub Quantified",
    description: "Transform your GitHub contributions into quantifiable career metrics.",
    images: ["/og-image.png"], 
    creator: "@yourtwitterhandle" 
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />      
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        
        <meta name="msapplication-TileColor" content="#1f1f1f" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#1f1f1f" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
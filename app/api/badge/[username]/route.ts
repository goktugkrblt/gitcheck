import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Fetch profile from database
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: {
        score: true,
        username: true,
      },
    });

    // If not found or no score, return placeholder badge
    if (!profile || profile.score === null) {
      return new NextResponse(generatePlaceholderBadge(username), {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": process.env.NODE_ENV === 'development'
            ? "no-cache, no-store, must-revalidate"
            : "public, max-age=3600",
        },
      });
    }

    // Get global rank
    const higherScores = await prisma.profile.count({
      where: { score: { gt: profile.score } },
    });
    const rank = higherScores + 1;

    // Determine badge style based on rank
    const isTopTen = rank <= 10;
    const badgeSVG = isTopTen
      ? generateTopTenBadge(profile.score, rank)
      : generateRegularBadge(profile.score, rank);

    return new NextResponse(badgeSVG, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": process.env.NODE_ENV === 'development'
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Badge generation error:", error);
    return new NextResponse(generateErrorBadge(), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": process.env.NODE_ENV === 'development'
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=300",
      },
    });
  }
}

// Minimalist Badge - Clean and elegant
function generateTopTenBadge(score: number, rank: number): string {
  return generateMinimalistBadge(score, rank);
}

// Regular Badge for ranks 11+
function generateRegularBadge(score: number, rank: number): string {
  return generateMinimalistBadge(score, rank);
}

// Minimalist badge design - clean, simple, elegant with real GitCheck logo
function generateMinimalistBadge(score: number, rank: number): string {
  return `
<svg width="220" height="45" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 45">
  <!-- Background -->
  <rect width="220" height="45" rx="22.5" fill="#0D1117"/>
  <rect width="220" height="45" rx="22.5" fill="none" stroke="#30363D" stroke-width="1.5"/>

  <!-- Logo Container -->
  <g>
    <!-- Logo Background Circle -->
    <circle cx="22" cy="22" r="14" fill="#161B22"/>

    <!-- GitCheck Logo SVG Path (properly scaled to fit in 28x28) -->
    <g transform="translate(22, 22) scale(0.10) translate(-122.5, -122.5)">
      <path fill="#FFFFFF" d="M185.8,232.75c9.45-10.21,14.43-20.71,10.61-35.01-3.06-11.43-16.92-24.07-17.7-32.75-.63-6.99,4.82-11.41,11.39-10.36,3.39.54,7.83,6.36,10.94,1.42,2.68-4.25-2.55-8.92-6.08-10.4-13.81-5.82-28.46,6.66-25.94,21.63,1.6,9.54,10.16,16.72,14.56,24.99,3.82,7.17,7.21,17.59.1,23.85l-.74-.57c-3.08-19.66-14.33-38.23-26.34-53.5-1.01-1.28-7.78-8.71-7.78-9.33,0-.46.35-.74.67-.99,1.18-.91,4.66-2.18,6.32-3.16,5.5-3.27,9.63-7.39,13.21-12.74,14.05,2.14,27.19-7.72,29.33-22.13,2.18-14.68-6.37-25.09-20.84-24.72-.71.02-1.89.65-2.27.03-4.48-29.93-33.71-44.47-61.11-38.79-17.89,3.71-32.53,17.11-37.76,35.12-1.66.48-3.3.38-5.04.82-5.22,1.33-9.45,6.28-10.86,11.48-2.74,10.11,1.79,21.25,11.35,25.29-.48,13.41,9.63,23,20.87,27.66.05.29.11.67-.03.91-.31.54-9.44,5.46-10.74,6.1-2.12,1.05-7.03,3.62-9.15,2.96-4.11-1.28-13.8-13.56-14.39-17.86-.35-2.55.49-5.15.62-7.63.17-3.33.54-12.69-4.38-12.16-2.65.28-2.93,3.72-3.57,5.68-.09.29-.12.93-.64.66-.43-.22-3.10-4.45-3.89-5.33-9.26-10.38-17.82-.52-16.66,10.78.72,6.98,6.47,13.72,12.06,17.24.79.5,2.74,1.1,3.15,1.51.69.68,3.03,6.49,3.82,7.97,3.61,6.79,10.03,15.86,17.07,19.08,5.63,2.58,11.55.6,17.02-1.51,1.22-.47,6.1-3.05,6.71-3.11.42-.04.49.17.75.45-6.25,17.06-10.31,35.22-8.09,53.58l2.76,14.82c-.36.56-.55.08-.96-.01-8.95-2.11-21.45-9.12-29.2-14.29C-4.7,190.53-17.92,106.22,25.83,48.42c49.53-65.43,145.86-64.24,194.47,1.67,42.04,57.01,29.09,139.38-28.69,179.14-.63.43-5.56,3.75-5.81,3.52Z"/>
    </g>
  </g>

  <!-- Rank Text -->
  <text x="50" y="22.5" font-family="system-ui, -apple-system, sans-serif"
        font-size="14" font-weight="700" fill="#FFFFFF"
        dominant-baseline="central">
    Rank #${rank.toLocaleString()}
  </text>

  <!-- Divider -->
  <rect x="155" y="14" width="1" height="17" fill="#30363D"/>

  <!-- Score Text -->
  <text x="200" y="22.5" font-family="system-ui, -apple-system, sans-serif"
        font-size="13" font-weight="700" fill="#8B949E"
        text-anchor="end" dominant-baseline="central">
    ${score.toFixed(1)}
  </text>
</svg>`.trim();
}

// Placeholder badge for unanalyzed profiles
function generatePlaceholderBadge(username: string): string {
  return `
<svg width="220" height="45" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 45">
  <!-- Background -->
  <rect width="220" height="45" rx="22.5" fill="#0D1117"/>
  <rect width="220" height="45" rx="22.5" fill="none" stroke="#30363D" stroke-width="1.5"/>

  <!-- Logo Container -->
  <g>
    <!-- Logo Background Circle -->
    <circle cx="22" cy="22" r="14" fill="#161B22"/>

    <!-- GitCheck Logo SVG Path (properly scaled) -->
    <g transform="translate(22, 22) scale(0.10) translate(-122.5, -122.5)">
      <path fill="#FFFFFF" d="M185.8,232.75c9.45-10.21,14.43-20.71,10.61-35.01-3.06-11.43-16.92-24.07-17.7-32.75-.63-6.99,4.82-11.41,11.39-10.36,3.39.54,7.83,6.36,10.94,1.42,2.68-4.25-2.55-8.92-6.08-10.4-13.81-5.82-28.46,6.66-25.94,21.63,1.6,9.54,10.16,16.72,14.56,24.99,3.82,7.17,7.21,17.59.1,23.85l-.74-.57c-3.08-19.66-14.33-38.23-26.34-53.5-1.01-1.28-7.78-8.71-7.78-9.33,0-.46.35-.74.67-.99,1.18-.91,4.66-2.18,6.32-3.16,5.5-3.27,9.63-7.39,13.21-12.74,14.05,2.14,27.19-7.72,29.33-22.13,2.18-14.68-6.37-25.09-20.84-24.72-.71.02-1.89.65-2.27.03-4.48-29.93-33.71-44.47-61.11-38.79-17.89,3.71-32.53,17.11-37.76,35.12-1.66.48-3.3.38-5.04.82-5.22,1.33-9.45,6.28-10.86,11.48-2.74,10.11,1.79,21.25,11.35,25.29-.48,13.41,9.63,23,20.87,27.66.05.29.11.67-.03.91-.31.54-9.44,5.46-10.74,6.1-2.12,1.05-7.03,3.62-9.15,2.96-4.11-1.28-13.8-13.56-14.39-17.86-.35-2.55.49-5.15.62-7.63.17-3.33.54-12.69-4.38-12.16-2.65.28-2.93,3.72-3.57,5.68-.09.29-.12.93-.64.66-.43-.22-3.10-4.45-3.89-5.33-9.26-10.38-17.82-.52-16.66,10.78.72,6.98,6.47,13.72,12.06,17.24.79.5,2.74,1.1,3.15,1.51.69.68,3.03,6.49,3.82,7.97,3.61,6.79,10.03,15.86,17.07,19.08,5.63,2.58,11.55.6,17.02-1.51,1.22-.47,6.1-3.05,6.71-3.11.42-.04.49.17.75.45-6.25,17.06-10.31,35.22-8.09,53.58l2.76,14.82c-.36.56-.55.08-.96-.01-8.95-2.11-21.45-9.12-29.2-14.29C-4.7,190.53-17.92,106.22,25.83,48.42c49.53-65.43,145.86-64.24,194.47,1.67,42.04,57.01,29.09,139.38-28.69,179.14-.63.43-5.56,3.75-5.81,3.52Z"/>
    </g>
  </g>

  <!-- Not Analyzed Text -->
  <text x="50" y="22.5" font-family="system-ui, -apple-system, sans-serif"
        font-size="14" font-weight="600" fill="#8B949E"
        dominant-baseline="central">
    Not Analyzed Yet
  </text>
</svg>`.trim();
}

// Error badge
function generateErrorBadge(): string {
  return `
<svg width="220" height="45" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 45">
  <!-- Background -->
  <rect width="220" height="45" rx="22.5" fill="#0D1117"/>
  <rect width="220" height="45" rx="22.5" fill="none" stroke="#EF4444" stroke-width="1.5"/>

  <!-- Logo Container -->
  <g>
    <!-- Logo Background Circle -->
    <circle cx="22" cy="22" r="14" fill="#161B22"/>

    <!-- GitCheck Logo SVG Path (red for error) -->
    <g transform="translate(22, 22) scale(0.10) translate(-122.5, -122.5)">
      <path fill="#EF4444" d="M185.8,232.75c9.45-10.21,14.43-20.71,10.61-35.01-3.06-11.43-16.92-24.07-17.7-32.75-.63-6.99,4.82-11.41,11.39-10.36,3.39.54,7.83,6.36,10.94,1.42,2.68-4.25-2.55-8.92-6.08-10.4-13.81-5.82-28.46,6.66-25.94,21.63,1.6,9.54,10.16,16.72,14.56,24.99,3.82,7.17,7.21,17.59.1,23.85l-.74-.57c-3.08-19.66-14.33-38.23-26.34-53.5-1.01-1.28-7.78-8.71-7.78-9.33,0-.46.35-.74.67-.99,1.18-.91,4.66-2.18,6.32-3.16,5.5-3.27,9.63-7.39,13.21-12.74,14.05,2.14,27.19-7.72,29.33-22.13,2.18-14.68-6.37-25.09-20.84-24.72-.71.02-1.89.65-2.27.03-4.48-29.93-33.71-44.47-61.11-38.79-17.89,3.71-32.53,17.11-37.76,35.12-1.66.48-3.3.38-5.04.82-5.22,1.33-9.45,6.28-10.86,11.48-2.74,10.11,1.79,21.25,11.35,25.29-.48,13.41,9.63,23,20.87,27.66.05.29.11.67-.03.91-.31.54-9.44,5.46-10.74,6.1-2.12,1.05-7.03,3.62-9.15,2.96-4.11-1.28-13.8-13.56-14.39-17.86-.35-2.55.49-5.15.62-7.63.17-3.33.54-12.69-4.38-12.16-2.65.28-2.93,3.72-3.57,5.68-.09.29-.12.93-.64.66-.43-.22-3.10-4.45-3.89-5.33-9.26-10.38-17.82-.52-16.66,10.78.72,6.98,6.47,13.72,12.06,17.24.79.5,2.74,1.1,3.15,1.51.69.68,3.03,6.49,3.82,7.97,3.61,6.79,10.03,15.86,17.07,19.08,5.63,2.58,11.55.6,17.02-1.51,1.22-.47,6.1-3.05,6.71-3.11.42-.04.49.17.75.45-6.25,17.06-10.31,35.22-8.09,53.58l2.76,14.82c-.36.56-.55.08-.96-.01-8.95-2.11-21.45-9.12-29.2-14.29C-4.7,190.53-17.92,106.22,25.83,48.42c49.53-65.43,145.86-64.24,194.47,1.67,42.04,57.01,29.09,139.38-28.69,179.14-.63.43-5.56,3.75-5.81,3.52Z"/>
    </g>
  </g>

  <!-- Error Text -->
  <text x="50" y="22.5" font-family="system-ui, -apple-system, sans-serif"
        font-size="14" font-weight="600" fill="#EF4444"
        dominant-baseline="central">
    Error - Try Again
  </text>
</svg>`.trim();
}

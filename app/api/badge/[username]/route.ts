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
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
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
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Badge generation error:", error);
    return new NextResponse(generateErrorBadge(), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}

// Top 10 Special Badge with gradient and crown
function generateTopTenBadge(score: number, rank: number): string {
  const gradients = [
    { id: "gold", colors: ["#FFD700", "#FFA500"] }, // 1st
    { id: "silver", colors: ["#C0C0C0", "#808080"] }, // 2nd
    { id: "bronze", colors: ["#CD7F32", "#8B4513"] }, // 3rd
    { id: "purple", colors: ["#9333EA", "#6B21A8"] }, // 4-10
  ];

  const gradient = rank === 1 ? gradients[0] : rank === 2 ? gradients[1] : rank === 3 ? gradients[2] : gradients[3];

  return `
<svg width="240" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradient.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradient.colors[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradient.colors[1]};stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="240" height="100" rx="10" fill="#0D1117"/>
  <rect width="240" height="100" rx="10" fill="url(#${gradient.id})" opacity="0.1"/>

  <!-- Border -->
  <rect x="2" y="2" width="236" height="96" rx="8" fill="none" stroke="url(#${gradient.id})" stroke-width="2"/>

  <!-- Crown Icon (for top 3) -->
  ${rank <= 3 ? `
  <g transform="translate(20, 30)">
    <path d="M12 2L15 8L21 9L16.5 13.5L18 20L12 17L6 20L7.5 13.5L3 9L9 8L12 2Z"
          fill="url(#${gradient.id})" filter="url(#glow)"/>
  </g>
  ` : ''}

  <!-- GitCheck Logo -->
  <g transform="translate(${rank <= 3 ? '50' : '20'}, 35)">
    <text x="0" y="0" font-family="'SF Mono', 'Monaco', 'Courier New', monospace"
          font-size="12" font-weight="700" fill="#FFFFFF">
      GitCheck
    </text>
  </g>

  <!-- Score -->
  <g transform="translate(140, 30)">
    <text x="0" y="0" font-family="'SF Mono', monospace" font-size="32"
          font-weight="900" fill="url(#${gradient.id})" filter="url(#glow)">
      ${score.toFixed(1)}
    </text>
    <text x="0" y="18" font-family="'SF Mono', monospace" font-size="10"
          font-weight="600" fill="#FFFFFF" opacity="0.5">
      SCORE
    </text>
  </g>

  <!-- Rank Badge -->
  <g transform="translate(200, 30)">
    <rect x="0" y="-15" width="35" height="24" rx="4" fill="url(#${gradient.id})"/>
    <text x="17.5" y="2" font-family="'SF Mono', monospace" font-size="11"
          font-weight="900" fill="#000000" text-anchor="middle">
      #${rank}
    </text>
    <text x="17.5" y="16" font-family="'SF Mono', monospace" font-size="8"
          font-weight="600" fill="#FFFFFF" opacity="0.6" text-anchor="middle">
      TOP ${rank}
    </text>
  </g>
</svg>`.trim();
}

// Regular Badge for ranks 11+
function generateRegularBadge(score: number, rank: number): string {
  // Color based on score ranges
  let scoreColor = "#10B981"; // Green for high scores
  if (score < 50) scoreColor = "#EF4444"; // Red for low
  else if (score < 70) scoreColor = "#F59E0B"; // Orange for medium
  else if (score < 85) scoreColor = "#3B82F6"; // Blue for good

  return `
<svg width="240" height="80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${scoreColor};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${scoreColor};stop-opacity:0.4" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="240" height="80" rx="8" fill="#0D1117"/>

  <!-- Border -->
  <rect x="1" y="1" width="238" height="78" rx="7" fill="none" stroke="#30363D" stroke-width="1.5"/>

  <!-- Left Section: GitCheck -->
  <g transform="translate(15, 25)">
    <text x="0" y="0" font-family="'SF Mono', monospace" font-size="11"
          font-weight="700" fill="#FFFFFF">
      GitCheck
    </text>
    <text x="0" y="16" font-family="'SF Mono', monospace" font-size="8"
          font-weight="500" fill="#8B949E">
      Developer Score
    </text>
  </g>

  <!-- Score Display -->
  <g transform="translate(120, 22)">
    <rect x="-10" y="-5" width="60" height="32" rx="6" fill="url(#score-gradient)" opacity="0.15"/>
    <text x="0" y="0" font-family="'SF Mono', monospace" font-size="24"
          font-weight="900" fill="${scoreColor}">
      ${score.toFixed(1)}
    </text>
  </g>

  <!-- Rank -->
  <g transform="translate(190, 25)">
    <text x="0" y="0" font-family="'SF Mono', monospace" font-size="10"
          font-weight="600" fill="#8B949E">
      Rank
    </text>
    <text x="0" y="14" font-family="'SF Mono', monospace" font-size="13"
          font-weight="800" fill="#FFFFFF">
      #${rank}
    </text>
  </g>
</svg>`.trim();
}

// Placeholder badge for unanalyzed profiles
function generatePlaceholderBadge(username: string): string {
  return `
<svg width="240" height="80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="placeholder-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0.8" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="240" height="80" rx="8" fill="#0D1117"/>
  <rect width="240" height="80" rx="8" fill="url(#placeholder-gradient)" opacity="0.1"/>

  <!-- Border -->
  <rect x="1" y="1" width="238" height="78" rx="7" fill="none"
        stroke="url(#placeholder-gradient)" stroke-width="1.5"/>

  <!-- GitCheck Logo -->
  <g transform="translate(15, 28)">
    <text x="0" y="0" font-family="'SF Mono', monospace" font-size="12"
          font-weight="700" fill="#FFFFFF">
      GitCheck
    </text>
  </g>

  <!-- Message -->
  <g transform="translate(120, 30)">
    <text x="0" y="0" font-family="'SF Mono', monospace" font-size="13"
          font-weight="600" fill="url(#placeholder-gradient)">
      Not Analyzed
    </text>
    <text x="0" y="16" font-family="'SF Mono', monospace" font-size="9"
          font-weight="500" fill="#8B949E">
      Analyze on gitcheck.me
    </text>
  </g>
</svg>`.trim();
}

// Error badge
function generateErrorBadge(): string {
  return `
<svg width="240" height="80" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="80" rx="8" fill="#0D1117"/>
  <rect x="1" y="1" width="238" height="78" rx="7" fill="none" stroke="#EF4444" stroke-width="1.5"/>

  <g transform="translate(15, 28)">
    <text x="0" y="0" font-family="'SF Mono', monospace" font-size="12"
          font-weight="700" fill="#FFFFFF">
      GitCheck
    </text>
  </g>

  <g transform="translate(120, 35)">
    <text x="0" y="0" font-family="'SF Mono', monospace" font-size="11"
          font-weight="600" fill="#EF4444">
      Error
    </text>
  </g>
</svg>`.trim();
}

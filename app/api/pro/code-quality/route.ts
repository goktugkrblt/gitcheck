import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GitHubService } from "@/lib/github";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and check PRO status
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check PRO plan
    if (user.plan !== "PRO") {
      return NextResponse.json(
        { error: "PRO plan required" },
        { status: 403 }
      );
    }

    // Check if user has GitHub token
    if (!user.githubToken || !user.githubUsername) {
      return NextResponse.json(
        { error: "GitHub account not connected" },
        { status: 404 }
      );
    }

    // Initialize GitHub Service
    const githubService = new GitHubService(user.githubToken);

    console.log(`🔍 Analyzing code quality for: ${user.githubUsername}`);

    // Analyze README Quality
    const readmeAnalysis = await githubService.analyzeReadmeQuality(user.githubUsername);

    // TODO: Add more analyses (Test Coverage, CI/CD, Documentation)

    return NextResponse.json({
      success: true,
      data: {
        readmeQuality: readmeAnalysis,
        // testCoverage: null, // Coming soon
        // cicd: null, // Coming soon
        // documentation: null, // Coming soon
      },
    });
  } catch (error) {
    console.error("Code quality analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze code quality" },
      { status: 500 }
    );
  }
}
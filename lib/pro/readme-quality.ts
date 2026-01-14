// lib/pro/readme-quality.ts - OPTIMIZED
import { Octokit } from "@octokit/rest";

export async function analyzeReadmeQuality(
  octokit: Octokit,
  username: string
): Promise<{
  overallScore: number;
  grade: string;
  details: {
    length: number;
    lengthScore: number;
    sections: number;
    sectionsScore: number;
    badges: number;
    badgesScore: number;
    codeBlocks: number;
    codeBlocksScore: number;
    links: number;
    linksScore: number;
    images: number;
    imagesScore: number;
    tables: number;
    tablesScore: number;
    toc: boolean;
    tocScore: number;
  };
  strengths: string[];
  improvements: string[];
  story?: string;
  insights: {
    readability: number;
    completeness: number;
    professionalism: number;
  };
}> {
  const startTime = Date.now();
  console.log(`⏱️  [README] Starting analysis for: ${username}`);

  try {
    const reposResponse = await octokit.request('GET /users/{username}/repos', {
      username,
      per_page: 50,
      sort: 'updated',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const repos = reposResponse.data;

    // ✅ NEW APPROACH: Analyze multiple READMEs and pick the best by QUALITY, not just length
    const readmeAnalyses: Array<{
      content: string;
      repo: string;
      quickScore: number;
    }> = [];

    // Analyze first 30 repos to find quality READMEs
    for (const repo of repos.slice(0, 30)) {
      if (repo.fork) continue;

      try {
        const readmeResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/readme',
          {
            owner: username,
            repo: repo.name,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          }
        );

        const content = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');

        // Quick quality score based on key indicators
        const length = content.length;
        const sections = (content.match(/^#{1,6}\s+.+$/gm) || []).length;
        const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
        const badges = (content.match(/!\[.*?\]\(https:\/\/img\.shields\.io.*?\)/g) || []).length;

        // Quick score: favor structure and examples over raw length
        const quickScore =
          Math.min(20, length / 100) + // Max 20 points for length
          (sections * 5) +              // 5 points per section
          (codeBlocks * 10) +           // 10 points per code block
          (badges * 5);                 // 5 points per badge

        readmeAnalyses.push({
          content,
          repo: repo.name,
          quickScore,
        });
      } catch (error) {
        continue;
      }
    }

    // Sort by quality score and take top 10
    readmeAnalyses.sort((a, b) => b.quickScore - a.quickScore);
    const topReadmes = readmeAnalyses.slice(0, Math.min(10, readmeAnalyses.length));

    if (topReadmes.length === 0) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ [README] Complete in ${duration}s - Score: 0/100`);

      return {
        overallScore: 0,
        grade: "F",
        details: {
          length: 0,
          lengthScore: 0,
          sections: 0,
          sectionsScore: 0,
          badges: 0,
          badgesScore: 0,
          codeBlocks: 0,
          codeBlocksScore: 0,
          links: 0,
          linksScore: 0,
          images: 0,
          imagesScore: 0,
          tables: 0,
          tablesScore: 0,
          toc: false,
          tocScore: 0,
        },
        strengths: [],
        improvements: ['No README found. Add detailed documentation to your projects.'],
        insights: {
          readability: 0,
          completeness: 0,
          professionalism: 0,
        },
      };
    }

    console.log(`📖 Analyzing top ${topReadmes.length} READMEs by quality (not just length)`);

    // ✅ NEW: Calculate detailed scores for each top README and average them
    const detailedScores: Array<{
      overallScore: number;
      lengthScore: number;
      sectionsScore: number;
      badgesScore: number;
      codeBlocksScore: number;
      linksScore: number;
      imagesScore: number;
      tablesScore: number;
      tocScore: number;
      readability: number;
      completeness: number;
      professionalism: number;
    }> = [];

    let aggregatedDetails = {
      length: 0,
      sections: 0,
      badges: 0,
      codeBlocks: 0,
      links: 0,
      images: 0,
      tables: 0,
      toc: 0,
    };

    let aggregatedFlags = {
      hasInstallation: 0,
      hasUsage: 0,
      hasFeatures: 0,
      hasContributing: 0,
      hasLicense: 0,
    };

    // Analyze each top README in detail
    for (const readmeData of topReadmes) {
      const readme = readmeData.content;

      const length = readme.length;
      const sections = (readme.match(/^#{1,6}\s+.+$/gm) || []).length;
      const badges = (readme.match(/!\[.*?\]\(https:\/\/img\.shields\.io.*?\)/g) || []).length;
      const codeBlocks = (readme.match(/```[\s\S]*?```/g) || []).length;
      const links = (readme.match(/\[.*?\]\((?!#).*?\)/g) || []).length;
      const images = (readme.match(/!\[.*?\]\((?!https:\/\/img\.shields\.io).*?\)/g) || []).length;
      const tables = (readme.match(/\|[\s\S]*?\|/g) || []).length;
      const toc = /##?\s+(table of contents|contents|toc)/i.test(readme);

      const hasInstallation = /##?\s+(installation|install|setup|getting started)/i.test(readme);
      const hasUsage = /##?\s+(usage|example|examples|how to use)/i.test(readme);
      const hasFeatures = /##?\s+(features|what'?s included)/i.test(readme);
      const hasContributing = /##?\s+(contributing|contribution)/i.test(readme);
      const hasLicense = /##?\s+(license)/i.test(readme);

      // Aggregate data for display
      aggregatedDetails.length += length;
      aggregatedDetails.sections += sections;
      aggregatedDetails.badges += badges;
      aggregatedDetails.codeBlocks += codeBlocks;
      aggregatedDetails.links += links;
      aggregatedDetails.images += images;
      aggregatedDetails.tables += tables;
      aggregatedDetails.toc += toc ? 1 : 0;

      aggregatedFlags.hasInstallation += hasInstallation ? 1 : 0;
      aggregatedFlags.hasUsage += hasUsage ? 1 : 0;
      aggregatedFlags.hasFeatures += hasFeatures ? 1 : 0;
      aggregatedFlags.hasContributing += hasContributing ? 1 : 0;
      aggregatedFlags.hasLicense += hasLicense ? 1 : 0;

      // ✅ HASSAS PUANLAMA - Smooth continuous functions (0-100 scale)

      // Length Score (0-15): Logarithmic scale favoring comprehensive docs
      const lengthScore = Math.min(15, Math.round((Math.log(length + 1) / Math.log(4000)) * 15 * 100) / 100);

      // Sections Score (0-20): Linear + essential sections bonus
      const baseSectionsScore = Math.min(15, sections * 1.5);
      const essentialSections = [hasInstallation, hasUsage, hasFeatures, hasContributing, hasLicense].filter(Boolean).length;
      const sectionsScore = Math.min(20, Math.round((baseSectionsScore + essentialSections) * 100) / 100);

      // Badges Score (0-10): Diminishing returns after 5 badges
      const badgesScore = Math.min(10, Math.round((badges / (1 + badges / 6)) * 2 * 100) / 100);

      // Code Blocks Score (0-15): Essential for technical docs
      const codeBlocksScore = Math.min(15, Math.round((codeBlocks / (1 + codeBlocks / 7)) * 3 * 100) / 100);

      // Links Score (0-10): External references show depth
      const linksScore = Math.min(10, Math.round((links / (1 + links / 12)) * 2 * 100) / 100);

      // Images Score (0-10): Visual aids matter
      const imagesScore = Math.min(10, Math.round((images / (1 + images / 6)) * 2 * 100) / 100);

      // Tables Score (0-10): Structured data presentation
      const tablesScore = Math.min(10, Math.round((tables / (1 + tables / 4)) * 2 * 100) / 100);

      // TOC Score (0-10): Binary but important for navigation
      const tocScore = toc ? 10 : 0;

      // Total Score with decimal precision
      const totalScore = Math.round((lengthScore + sectionsScore + badgesScore + codeBlocksScore + linksScore + imagesScore + tablesScore + tocScore) * 100) / 100;

      // ✅ Insight scores (0-100 with decimal precision and smart weighting)
      const paragraphDensity = sections > 0 ? Math.min(100, (length / sections) / 10) : 0;
      const readability = Math.min(100, Math.round((
        (codeBlocksScore / 15) * 40 +
        (sectionsScore / 20) * 35 +
        (tocScore / 10) * 15 +
        (100 - paragraphDensity) * 0.10
      ) * 100) / 100);

      const essentialCoverage = Math.min(100, (essentialSections / 5) * 100);
      const projectMaturity = (hasContributing ? 50 : 0) + (hasLicense ? 50 : 0);
      const completeness = Math.min(100, Math.round((
        essentialCoverage * 0.50 +
        (lengthScore / 15) * 100 * 0.25 +
        (linksScore / 10) * 100 * 0.15 +
        projectMaturity * 0.10
      ) * 100) / 100);

      const professionalism = Math.min(100, Math.round((
        (badgesScore / 10) * 100 * 0.40 +
        (imagesScore / 10) * 100 * 0.35 +
        (tablesScore / 10) * 100 * 0.25
      ) * 100) / 100);

      // Store this README's scores
      detailedScores.push({
        overallScore: totalScore,
        lengthScore,
        sectionsScore,
        badgesScore,
        codeBlocksScore,
        linksScore,
        imagesScore,
        tablesScore,
        tocScore,
        readability,
        completeness,
        professionalism,
      });
    }

    // ✅ AVERAGE ALL SCORES from top READMEs
    const avgScores = {
      overallScore: 0,
      lengthScore: 0,
      sectionsScore: 0,
      badgesScore: 0,
      codeBlocksScore: 0,
      linksScore: 0,
      imagesScore: 0,
      tablesScore: 0,
      tocScore: 0,
      readability: 0,
      completeness: 0,
      professionalism: 0,
    };

    for (const score of detailedScores) {
      avgScores.overallScore += score.overallScore;
      avgScores.lengthScore += score.lengthScore;
      avgScores.sectionsScore += score.sectionsScore;
      avgScores.badgesScore += score.badgesScore;
      avgScores.codeBlocksScore += score.codeBlocksScore;
      avgScores.linksScore += score.linksScore;
      avgScores.imagesScore += score.imagesScore;
      avgScores.tablesScore += score.tablesScore;
      avgScores.tocScore += score.tocScore;
      avgScores.readability += score.readability;
      avgScores.completeness += score.completeness;
      avgScores.professionalism += score.professionalism;
    }

    const numReadmes = detailedScores.length;
    avgScores.overallScore = Math.round((avgScores.overallScore / numReadmes) * 100) / 100;
    avgScores.lengthScore = Math.round((avgScores.lengthScore / numReadmes) * 100) / 100;
    avgScores.sectionsScore = Math.round((avgScores.sectionsScore / numReadmes) * 100) / 100;
    avgScores.badgesScore = Math.round((avgScores.badgesScore / numReadmes) * 100) / 100;
    avgScores.codeBlocksScore = Math.round((avgScores.codeBlocksScore / numReadmes) * 100) / 100;
    avgScores.linksScore = Math.round((avgScores.linksScore / numReadmes) * 100) / 100;
    avgScores.imagesScore = Math.round((avgScores.imagesScore / numReadmes) * 100) / 100;
    avgScores.tablesScore = Math.round((avgScores.tablesScore / numReadmes) * 100) / 100;
    avgScores.tocScore = Math.round((avgScores.tocScore / numReadmes) * 100) / 100;
    avgScores.readability = Math.round((avgScores.readability / numReadmes) * 100) / 100;
    avgScores.completeness = Math.round((avgScores.completeness / numReadmes) * 100) / 100;
    avgScores.professionalism = Math.round((avgScores.professionalism / numReadmes) * 100) / 100;

    const finalScore = avgScores.overallScore;

    // Calculate aggregated display values (averages)
    const avgLength = Math.round(aggregatedDetails.length / numReadmes);
    const avgSections = Math.round(aggregatedDetails.sections / numReadmes);
    const avgBadges = Math.round(aggregatedDetails.badges / numReadmes);
    const avgCodeBlocks = Math.round(aggregatedDetails.codeBlocks / numReadmes);
    const avgLinks = Math.round(aggregatedDetails.links / numReadmes);
    const avgImages = Math.round(aggregatedDetails.images / numReadmes);
    const avgTables = Math.round(aggregatedDetails.tables / numReadmes);
    const hasToc = aggregatedDetails.toc >= (numReadmes / 2); // Majority have TOC

    const hasInstallation = aggregatedFlags.hasInstallation >= (numReadmes / 2);
    const hasUsage = aggregatedFlags.hasUsage >= (numReadmes / 2);
    const hasFeatures = aggregatedFlags.hasFeatures >= (numReadmes / 2);
    const hasContributing = aggregatedFlags.hasContributing >= (numReadmes / 2);
    const hasLicense = aggregatedFlags.hasLicense >= (numReadmes / 2);

    let grade = "F";
    if (finalScore >= 95) grade = "A+";
    else if (finalScore >= 90) grade = "A";
    else if (finalScore >= 85) grade = "A-";
    else if (finalScore >= 80) grade = "B+";
    else if (finalScore >= 75) grade = "B";
    else if (finalScore >= 70) grade = "B-";
    else if (finalScore >= 65) grade = "C+";
    else if (finalScore >= 60) grade = "C";
    else if (finalScore >= 55) grade = "C-";
    else if (finalScore >= 50) grade = "D";

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (avgScores.lengthScore >= 12) strengths.push("Comprehensive documentation with detailed content");
    if (avgScores.sectionsScore >= 15) strengths.push("Well-organized structure with clear sections");
    if (avgScores.badgesScore >= 7) strengths.push("Professional appearance with informative badges");
    if (avgScores.codeBlocksScore >= 10) strengths.push("Excellent code examples demonstrating usage");
    if (avgScores.imagesScore >= 7) strengths.push("Great visual documentation with screenshots/diagrams");
    if (avgScores.tocScore >= 5) strengths.push("Easy navigation with table of contents");
    if (avgScores.tablesScore >= 7) strengths.push("Clear data presentation with structured tables");

    if (avgScores.lengthScore < 7) improvements.push("Add more detailed content (aim for 1500+ characters)");
    if (!hasInstallation) improvements.push("Include an Installation/Setup section");
    if (!hasUsage) improvements.push("Add Usage examples to help users get started");
    if (!hasFeatures) improvements.push("List key Features to highlight project value");
    if (avgScores.badgesScore < 4) improvements.push("Consider adding badges (build status, version, license)");
    if (avgScores.codeBlocksScore < 6) improvements.push("Include more code examples with syntax highlighting");
    if (avgScores.imagesScore === 0) improvements.push("Add screenshots or diagrams for better visual understanding");
    if (!hasToc && avgSections >= 6) improvements.push("Add a Table of Contents for easier navigation");
    if (avgScores.tablesScore === 0 && avgLength > 1000) improvements.push("Use tables to organize complex information");
    if (!hasLicense) improvements.push("Specify a License to clarify usage terms");
    if (!hasContributing && avgLength > 1500) improvements.push("Add Contributing guidelines to encourage collaboration");

    if (finalScore >= 90) {
      strengths.push("🎉 Outstanding documentation! Your README is a great example for others");
    }

    // Generate personalized story
    let story = "";
    if (finalScore >= 85) {
      story = `Your documentation is exceptional. Averaging ${numReadmes} of your best READMEs, you consistently demonstrate professional standards with comprehensive guides, clear examples, and thoughtful structure. This level of documentation quality significantly increases project adoption and shows deep care for your users.`;
    } else if (finalScore >= 70) {
      story = `Your documentation is solid and functional. Across ${numReadmes} analyzed READMEs, you provide good coverage of essential information. With some enhancements to ${avgScores.readability < 70 ? 'readability (more code examples)' : avgScores.completeness < 70 ? 'completeness (essential sections)' : 'professionalism (badges, visuals)'}, your docs could move from good to exceptional.`;
    } else if (finalScore >= 50) {
      story = `Your documentation covers the basics but has room for growth. Looking at ${numReadmes} READMEs, you're establishing good foundations. Focus on adding ${!hasInstallation || !hasUsage ? 'Installation and Usage sections' : avgCodeBlocks < 3 ? 'more code examples' : 'more comprehensive content'} to help users understand and adopt your projects more easily.`;
    } else {
      story = `Your documentation is just getting started. Across ${numReadmes} analyzed projects, there's significant opportunity to improve. Great documentation is one of the highest-leverage investments you can make - it directly impacts how many people use and contribute to your work. Start with Installation, Usage, and clear examples.`;
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [README] Complete in ${duration}s - Analyzed ${numReadmes} READMEs - Avg Score: ${finalScore.toFixed(2)}/100`);

    return {
      overallScore: finalScore,
      grade,
      details: {
        length: avgLength,
        lengthScore: avgScores.lengthScore,
        sections: avgSections,
        sectionsScore: avgScores.sectionsScore,
        badges: avgBadges,
        badgesScore: avgScores.badgesScore,
        codeBlocks: avgCodeBlocks,
        codeBlocksScore: avgScores.codeBlocksScore,
        links: avgLinks,
        linksScore: avgScores.linksScore,
        images: avgImages,
        imagesScore: avgScores.imagesScore,
        tables: avgTables,
        tablesScore: avgScores.tablesScore,
        toc: hasToc,
        tocScore: avgScores.tocScore,
      },
      strengths,
      improvements,
      story,
      insights: {
        readability: avgScores.readability,
        completeness: avgScores.completeness,
        professionalism: avgScores.professionalism,
      },
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ [README] Failed after ${duration}s:`, error);
    throw error;
  }
}
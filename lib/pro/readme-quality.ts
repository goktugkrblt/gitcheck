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

    let bestReadme = '';
    let bestReadmeRepo = '';

    // Sadece ilk 20 repo'yu kontrol et
    for (const repo of repos.slice(0, 20)) {
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

        if (content.length > bestReadme.length) {
          bestReadme = content;
          bestReadmeRepo = repo.name;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!bestReadme) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ [README] Complete in ${duration}s - Score: 0/10`);
      
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
    
    console.log(`📖 Analyzing README from: ${bestReadmeRepo} (${bestReadme.length} chars)`);
    
    const length = bestReadme.length;
    const sections = (bestReadme.match(/^#{1,6}\s+.+$/gm) || []).length;
    const badges = (bestReadme.match(/!\[.*?\]\(https:\/\/img\.shields\.io.*?\)/g) || []).length;
    const codeBlocks = (bestReadme.match(/```[\s\S]*?```/g) || []).length;
    const links = (bestReadme.match(/\[.*?\]\((?!#).*?\)/g) || []).length;
    const images = (bestReadme.match(/!\[.*?\]\((?!https:\/\/img\.shields\.io).*?\)/g) || []).length;
    const tables = (bestReadme.match(/\|[\s\S]*?\|/g) || []).length;
    const toc = /##?\s+(table of contents|contents|toc)/i.test(bestReadme);
    
    const hasInstallation = /##?\s+(installation|install|setup|getting started)/i.test(bestReadme);
    const hasUsage = /##?\s+(usage|example|examples|how to use)/i.test(bestReadme);
    const hasFeatures = /##?\s+(features|what'?s included)/i.test(bestReadme);
    const hasContributing = /##?\s+(contributing|contribution)/i.test(bestReadme);
    const hasLicense = /##?\s+(license)/i.test(bestReadme);
    
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
    const finalScore = Math.round(totalScore * 100) / 100; // Keep as 0-100 scale
    
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
    
    if (lengthScore >= 12) strengths.push("Comprehensive documentation with detailed content");
    if (sectionsScore >= 15) strengths.push("Well-organized structure with clear sections");
    if (badgesScore >= 7) strengths.push("Professional appearance with informative badges");
    if (codeBlocksScore >= 10) strengths.push("Excellent code examples demonstrating usage");
    if (imagesScore >= 7) strengths.push("Great visual documentation with screenshots/diagrams");
    if (tocScore === 10) strengths.push("Easy navigation with table of contents");
    if (tablesScore >= 7) strengths.push("Clear data presentation with structured tables");
    
    if (lengthScore < 7) improvements.push("Add more detailed content (aim for 1500+ characters)");
    if (!hasInstallation) improvements.push("Include an Installation/Setup section");
    if (!hasUsage) improvements.push("Add Usage examples to help users get started");
    if (!hasFeatures) improvements.push("List key Features to highlight project value");
    if (badgesScore < 4) improvements.push("Consider adding badges (build status, version, license)");
    if (codeBlocksScore < 6) improvements.push("Include more code examples with syntax highlighting");
    if (imagesScore === 0) improvements.push("Add screenshots or diagrams for better visual understanding");
    if (!toc && sections >= 6) improvements.push("Add a Table of Contents for easier navigation");
    if (tablesScore === 0 && length > 1000) improvements.push("Use tables to organize complex information");
    if (!hasLicense) improvements.push("Specify a License to clarify usage terms");
    if (!hasContributing && length > 1500) improvements.push("Add Contributing guidelines to encourage collaboration");
    
    if (finalScore >= 90) {
      strengths.push("🎉 Outstanding documentation! Your README is a great example for others");
    }

    // ✅ Insight scores (0-100 with decimal precision)
    const readability = Math.min(100, Math.round(((codeBlocksScore / 15) * 40 + (sectionsScore / 20) * 30 + (tocScore / 10) * 30) * 100) / 100);
    const completeness = Math.min(100, Math.round(((lengthScore / 15) * 30 + (sectionsScore / 20) * 40 + (linksScore / 10) * 30) * 100) / 100);
    const professionalism = Math.min(100, Math.round(((badgesScore / 10) * 40 + (imagesScore / 10) * 30 + (tablesScore / 10) * 30) * 100) / 100);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [README] Complete in ${duration}s - Score: ${finalScore.toFixed(2)}/100`);
    
    return {
      overallScore: finalScore,
      grade,
      details: {
        length,
        lengthScore: Math.round((lengthScore / 15) * 10),
        sections,
        sectionsScore: Math.round((sectionsScore / 20) * 10),
        badges,
        badgesScore: Math.round((badgesScore / 10) * 10),
        codeBlocks,
        codeBlocksScore: Math.round((codeBlocksScore / 15) * 10),
        links,
        linksScore: Math.round((linksScore / 10) * 10),
        images,
        imagesScore: Math.round((imagesScore / 10) * 10),
        tables,
        tablesScore: Math.round((tablesScore / 10) * 10),
        toc,
        tocScore: Math.round((tocScore / 10) * 10),
      },
      strengths,
      improvements,
      insights: {
        readability,
        completeness,
        professionalism,
      },
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ [README] Failed after ${duration}s:`, error);
    throw error;
  }
}
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
    
    let lengthScore = 0;
    if (length >= 3000) lengthScore = 15;
    else if (length >= 2000) lengthScore = 12;
    else if (length >= 1500) lengthScore = 10;
    else if (length >= 1000) lengthScore = 7;
    else if (length >= 500) lengthScore = 4;
    else lengthScore = 2;
    
    let sectionsScore = 0;
    if (sections >= 10) sectionsScore = 20;
    else if (sections >= 8) sectionsScore = 17;
    else if (sections >= 6) sectionsScore = 14;
    else if (sections >= 4) sectionsScore = 10;
    else if (sections >= 2) sectionsScore = 5;
    else sectionsScore = 2;
    
    const essentialSections = [hasInstallation, hasUsage, hasFeatures, hasContributing, hasLicense].filter(Boolean).length;
    sectionsScore += essentialSections * 2;
    sectionsScore = Math.min(sectionsScore, 20);
    
    let badgesScore = 0;
    if (badges >= 5) badgesScore = 10;
    else if (badges >= 3) badgesScore = 7;
    else if (badges >= 1) badgesScore = 4;
    
    let codeBlocksScore = 0;
    if (codeBlocks >= 5) codeBlocksScore = 15;
    else if (codeBlocks >= 3) codeBlocksScore = 10;
    else if (codeBlocks >= 2) codeBlocksScore = 6;
    else if (codeBlocks >= 1) codeBlocksScore = 3;
    
    let linksScore = 0;
    if (links >= 10) linksScore = 10;
    else if (links >= 7) linksScore = 8;
    else if (links >= 5) linksScore = 6;
    else if (links >= 3) linksScore = 4;
    else linksScore = 1;
    
    let imagesScore = 0;
    if (images >= 5) imagesScore = 10;
    else if (images >= 3) imagesScore = 7;
    else if (images >= 1) imagesScore = 5;
    
    let tablesScore = 0;
    if (tables >= 3) tablesScore = 10;
    else if (tables >= 2) tablesScore = 7;
    else if (tables >= 1) tablesScore = 4;
    
    const tocScore = toc ? 10 : 0;
    
    const totalScore = lengthScore + sectionsScore + badgesScore + codeBlocksScore + linksScore + imagesScore + tablesScore + tocScore;
    const finalScore = Math.round((totalScore / 100) * 10 * 10) / 10;
    
    let grade = "F";
    if (finalScore >= 9) grade = "A+";
    else if (finalScore >= 8.5) grade = "A";
    else if (finalScore >= 8) grade = "A-";
    else if (finalScore >= 7.5) grade = "B+";
    else if (finalScore >= 7) grade = "B";
    else if (finalScore >= 6.5) grade = "B-";
    else if (finalScore >= 6) grade = "C+";
    else if (finalScore >= 5.5) grade = "C";
    else if (finalScore >= 5) grade = "C-";
    else if (finalScore >= 4) grade = "D";
    
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
    
    if (finalScore >= 9) {
      strengths.push("🎉 Outstanding documentation! Your README is a great example for others");
    }
    
    const readability = Math.min(100, Math.round(((codeBlocksScore / 15) * 40 + (sectionsScore / 20) * 30 + (tocScore / 10) * 30) * 100));
    const completeness = Math.min(100, Math.round(((lengthScore / 15) * 30 + (sectionsScore / 20) * 40 + (linksScore / 10) * 30) * 100));
    const professionalism = Math.min(100, Math.round(((badgesScore / 10) * 40 + (imagesScore / 10) * 30 + (tablesScore / 10) * 30) * 100));
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [README] Complete in ${duration}s - Score: ${finalScore}/10`);
    
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
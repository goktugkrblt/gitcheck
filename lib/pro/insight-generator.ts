/**
 * INSIGHT GENERATOR - Story-Driven Analysis
 *
 * Bu modül, ham metrikleri anlamlı, açıklayıcı ve actionable insight'lara dönüştürür.
 * Amaç: Kullanıcıya sadece sayılar değil, hikaye anlatmak.
 */

// ==========================================
// README QUALITY INSIGHTS
// ==========================================

export function generateReadmeInsights(data: {
  overallScore: number;
  details: {
    length: number;
    sections: number;
    badges: number;
    codeBlocks: number;
    links: number;
    images: number;
    toc: boolean;
  };
  insights: {
    readability: number;
    completeness: number;
    professionalism: number;
  };
}): {
  strengths: string[];
  improvements: string[];
  story: string;
} {
  const strengths: string[] = [];
  const improvements: string[] = [];

  // ✅ STRENGTHS - Specifik ve övgü dolu
  if (data.details.length >= 2000) {
    strengths.push(
      `📝 Comprehensive documentation with ${Math.round(data.details.length / 1000)}K+ characters - shows you care about onboarding new users`
    );
  }

  if (data.details.sections >= 5) {
    strengths.push(
      `📑 Well-structured with ${data.details.sections} clear sections - makes it easy for others to navigate your project`
    );
  }

  if (data.details.codeBlocks >= 3) {
    strengths.push(
      `💻 ${data.details.codeBlocks} code examples included - developers can start using your project immediately`
    );
  }

  if (data.details.badges >= 3) {
    strengths.push(
      `🏆 ${data.details.badges} status badges show active maintenance and quality standards`
    );
  }

  if (data.details.images >= 2) {
    strengths.push(
      `🎨 Visual elements (${data.details.images} images) make documentation engaging and easier to understand`
    );
  }

  if (data.details.toc) {
    strengths.push(
      `🗂️ Table of contents present - shows professional documentation practices`
    );
  }

  if (data.insights.professionalism >= 80) {
    strengths.push(
      `✨ Professional presentation with badges, structure, and formatting - ready for enterprise adoption`
    );
  }

  // ⚠️ IMPROVEMENTS - Constructive ve spesifik
  if (data.details.length < 1000) {
    improvements.push(
      `📝 README is brief (${data.details.length} chars) - expand with installation steps, usage examples, and FAQs to help users get started`
    );
  }

  if (data.details.codeBlocks === 0) {
    improvements.push(
      `💻 No code examples found - add quick start guide with copy-paste code blocks. This dramatically improves adoption rates`
    );
  }

  if (!data.details.toc && data.details.length >= 2000) {
    improvements.push(
      `🗂️ Long README without table of contents - add ToC for better navigation (users will thank you!)`
    );
  }

  if (data.details.badges === 0) {
    improvements.push(
      `🏆 No status badges - add CI/CD, coverage, and version badges to signal active maintenance and quality`
    );
  }

  if (data.details.images === 0) {
    improvements.push(
      `🎨 Pure text documentation - add screenshots, diagrams, or GIFs. Visual learners will appreciate it!`
    );
  }

  if (data.insights.completeness < 60) {
    improvements.push(
      `📋 Missing key sections - consider adding: Contributing guidelines, License info, Troubleshooting, and API docs`
    );
  }

  if (data.details.links < 3) {
    improvements.push(
      `🔗 Few external links - add links to docs, demos, related projects, or your blog for better context`
    );
  }

  // 📖 STORY - Genel değerlendirme
  let story = '';

  if (data.overallScore >= 8) {
    story = `Your documentation is **excellent** - it's clear you understand that great code deserves great docs. Projects with documentation this good typically see ${data.details.codeBlocks >= 3 ? '3-5x more' : '2-3x more'} community engagement. ${data.details.badges >= 3 ? 'The status badges signal professionalism that attracts contributors.' : ''}`;
  } else if (data.overallScore >= 6) {
    story = `You have a **solid foundation** for your documentation. ${data.details.sections >= 4 ? 'Good structure is there,' : 'The basics are covered,'} but there's room to make it even more impactful. ${data.details.codeBlocks === 0 ? 'Adding code examples would be your highest ROI improvement - it cuts time-to-first-use by 80%.' : 'Focus on visual elements and more examples to boost engagement.'}`;
  } else if (data.overallScore >= 4) {
    story = `Your README covers the basics, but could be more **developer-friendly**. Think of it as your project's landing page - the first 30 seconds matter. ${data.details.codeBlocks === 0 ? 'Quick start code examples are critical.' : ''} ${!data.details.toc && data.details.length > 1500 ? 'A table of contents would help users navigate.' : ''} Strong docs can triple your project's reach.`;
  } else {
    story = `Let's level up your documentation! A strong README is often the difference between a project that gets adopted and one that gets overlooked. Start with: ${data.details.codeBlocks === 0 ? '1) Quick start code example, ' : ''}${data.details.sections < 3 ? '2) Clear sections (Install, Usage, Examples), ' : ''}${data.details.badges === 0 ? '3) Status badges for credibility' : '3) More context about why your project exists'}. Even 15 minutes of improvement can 10x your project's impact.`;
  }

  return {
    strengths: strengths.slice(0, 5), // Top 5
    improvements: improvements.slice(0, 5), // Top 5
    story,
  };
}

// ==========================================
// REPOSITORY HEALTH INSIGHTS
// ==========================================

export function generateRepoHealthInsights(data: {
  overallScore: number;
  metrics: {
    maintenance: {
      score: number;
      lastCommitDays: number;
      commitFrequency: number;
      activeDaysRatio: number;
    };
    issueManagement: {
      score: number;
      averageResolutionDays: number;
      totalIssues: number;
      closedIssues: number;
    };
    pullRequests: {
      score: number;
      mergeRate: number;
      totalPRs: number;
      mergedPRs: number;
    };
    activity: {
      score: number;
      contributorCount: number;
    };
  };
  trend: 'improving' | 'stable' | 'declining';
}): {
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  story: string;
} {
  const strengths: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];

  const { maintenance, issueManagement, pullRequests, activity } = data.metrics;

  // ✅ STRENGTHS
  if (maintenance.lastCommitDays <= 7) {
    strengths.push(
      `🚀 Active maintenance - commits within the last ${maintenance.lastCommitDays} day${maintenance.lastCommitDays !== 1 ? 's' : ''} show this project is alive and evolving`
    );
  }

  if (maintenance.commitFrequency >= 10) {
    strengths.push(
      `⚡ High velocity with ${maintenance.commitFrequency} commits/week - indicates active development and quick iterations`
    );
  }

  if (maintenance.activeDaysRatio >= 60) {
    strengths.push(
      `📅 Consistent activity on ${maintenance.activeDaysRatio}% of days - shows sustained commitment, not sporadic work`
    );
  }

  if (issueManagement.averageResolutionDays <= 7 && issueManagement.totalIssues > 5) {
    strengths.push(
      `⚡ Lightning-fast issue resolution (${issueManagement.averageResolutionDays} days avg) - users know they'll get help quickly`
    );
  }

  if (pullRequests.mergeRate >= 70 && pullRequests.totalPRs >= 5) {
    strengths.push(
      `🤝 ${pullRequests.mergeRate}% PR merge rate from ${pullRequests.totalPRs} PRs - welcoming to contributors and efficient code review`
    );
  }

  if (activity.contributorCount >= 5) {
    strengths.push(
      `👥 Community-driven with ${activity.contributorCount} contributors - shows the project resonates with others`
    );
  }

  if (data.trend === 'improving') {
    strengths.push(
      `📈 Positive trajectory - activity and engagement are growing over time`
    );
  }

  // ⚠️ CONCERNS
  if (maintenance.lastCommitDays > 90) {
    concerns.push(
      `⏰ Last commit was ${maintenance.lastCommitDays} days ago - users may question if the project is maintained`
    );
  } else if (maintenance.lastCommitDays > 30) {
    concerns.push(
      `📆 ${maintenance.lastCommitDays} days since last commit - consider a small update to show the project is alive`
    );
  }

  if (maintenance.commitFrequency < 2 && maintenance.lastCommitDays <= 90) {
    concerns.push(
      `🐌 Low commit frequency (${maintenance.commitFrequency}/week) - even small updates keep projects fresh in people's minds`
    );
  }

  if (issueManagement.averageResolutionDays > 30 && issueManagement.totalIssues > 3) {
    concerns.push(
      `⏳ Issues take ${issueManagement.averageResolutionDays} days to resolve - slow response times can discourage community engagement`
    );
  }

  if (pullRequests.mergeRate < 40 && pullRequests.totalPRs >= 5) {
    concerns.push(
      `❌ Only ${pullRequests.mergeRate}% of PRs get merged - this might discourage future contributors`
    );
  }

  if (activity.contributorCount === 1) {
    concerns.push(
      `👤 Solo project with no external contributors yet - consider making it easier for others to contribute`
    );
  }

  if (data.trend === 'declining') {
    concerns.push(
      `📉 Activity is declining - take action before momentum is lost`
    );
  }

  // 🎯 RECOMMENDATIONS
  if (maintenance.lastCommitDays > 60) {
    recommendations.push(
      `Make a small commit (docs, deps, or refactor) to signal active maintenance - even a 5-minute update shows you care`
    );
  }

  if (issueManagement.totalIssues > issueManagement.closedIssues * 2) {
    recommendations.push(
      `Triage open issues: close stale ones, label others. A clean issue tracker attracts more engagement`
    );
  }

  if (pullRequests.mergeRate < 50 && pullRequests.totalPRs >= 3) {
    recommendations.push(
      `Review open PRs promptly - even if you can't merge, feedback within 48 hours keeps contributors motivated`
    );
  }

  if (activity.contributorCount <= 2) {
    recommendations.push(
      `Add "Good First Issue" labels, create CONTRIBUTING.md, and make setup easy - this attracts new contributors`
    );
  }

  if (maintenance.activeDaysRatio < 30) {
    recommendations.push(
      `Build consistent habits: even 15 minutes daily is better than irregular bursts. Consistency signals reliability`
    );
  }

  // 📖 STORY
  let story = '';

  if (data.overallScore >= 8) {
    story = `Your repositories are **exceptionally well-maintained**. ${maintenance.lastCommitDays <= 7 ? 'Recent activity, ' : ''}${pullRequests.mergeRate >= 70 ? 'responsive PR reviews, ' : ''}${activity.contributorCount >= 5 ? 'and a thriving community ' : ''}make this project trustworthy and production-ready. This is the kind of repository health that makes people confident to build on your work.`;
  } else if (data.overallScore >= 6) {
    story = `You're doing **solid maintenance work**. ${maintenance.commitFrequency >= 5 ? 'Regular commits keep things moving,' : 'The basics are covered,'} but ${issueManagement.averageResolutionDays > 20 ? 'faster issue resolution' : activity.contributorCount === 1 ? 'attracting contributors' : 'more consistent activity'} would take this to the next level. Think of maintenance as continuous marketing - it keeps your project visible and trustworthy.`;
  } else if (data.overallScore >= 4) {
    story = `Your project has **potential but needs attention**. ${maintenance.lastCommitDays > 30 ? 'The gap since last commit is noticeable - ' : ''}${issueManagement.totalIssues > issueManagement.closedIssues * 2 ? 'Stale issues pile up. ' : ''}Good news: small improvements compound. Start with the most visible fixes: ${maintenance.lastCommitDays > 60 ? 'commit something today, ' : ''}${issueManagement.totalIssues > 10 ? 'close obsolete issues, ' : ''}respond to PRs. These signal "this project is alive."`;
  } else {
    story = `Let's revitalize your project! ${maintenance.lastCommitDays > 90 ? 'The inactivity is concerning to potential users. ' : ''}The good news: **momentum is easier to restart than you think**. Week 1: Make a small commit (update README, fix a typo). Week 2: Close 3 stale issues. Week 3: Respond to one PR. These micro-wins rebuild trust and often spark renewed interest from others. Every healthy project went through rough patches - what matters is showing you're back.`;
  }

  return {
    strengths: strengths.slice(0, 5),
    concerns: concerns.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    story,
  };
}

// ==========================================
// DEVELOPER PATTERNS INSIGHTS
// ==========================================

export function generateDevPatternsInsights(data: {
  overallScore: number;
  patterns: {
    commitPatterns: {
      peakHours: number[];
      peakDays: string[];
      consistency: number;
      commitMessageQuality: number;
    };
    codeQuality: {
      score: number;
      documentationHabits: number;
    };
    workLifeBalance: {
      burnoutRisk: number;
      weekendActivity: number;
      nightCoding: number;
    };
    collaboration: {
      score: number;
      soloVsTeam: number;
    };
    productivity: {
      deepWorkSessions: number;
      flowState: number;
    };
  };
  developerPersona: string;
}): {
  strengths: string[];
  patterns: string[];
  recommendations: string[];
  story: string;
} {
  const strengths: string[] = [];
  const patterns: string[] = [];
  const recommendations: string[] = [];

  const { commitPatterns, codeQuality, workLifeBalance, collaboration, productivity } = data.patterns;

  // ✅ STRENGTHS
  if (commitPatterns.consistency >= 70) {
    strengths.push(
      `📈 Remarkably consistent: ${commitPatterns.consistency}% of days active - this discipline compounds into expertise over time`
    );
  }

  if (commitPatterns.commitMessageQuality >= 75) {
    strengths.push(
      `💬 Professional commit messages - clear history makes code review easier and shows you think about future maintainers`
    );
  }

  if (productivity.deepWorkSessions >= 8) {
    strengths.push(
      `🎯 Deep work champion with ${productivity.deepWorkSessions} focused sessions - you achieve flow state, where the best code happens`
    );
  }

  if (productivity.flowState >= 80) {
    strengths.push(
      `⚡ ${productivity.flowState}% flow state productivity - you've mastered uninterrupted coding time`
    );
  }

  if (workLifeBalance.burnoutRisk < 30) {
    strengths.push(
      `🌟 Sustainable pace with low burnout risk (${workLifeBalance.burnoutRisk}%) - you're playing the long game smart`
    );
  }

  if (collaboration.score >= 7) {
    strengths.push(
      `🤝 Strong collaborator - you contribute to the community and engage with other developers effectively`
    );
  }

  if (codeQuality.documentationHabits >= 70) {
    strengths.push(
      `📚 Documentation-first mindset - rare and valuable trait that multiplies your impact`
    );
  }

  // 🔍 PATTERNS - Interesting insights
  const peakHour = commitPatterns.peakHours[0];
  let timePattern = '';

  if (peakHour >= 0 && peakHour < 6) {
    timePattern = `🌙 **Night Owl Coder**: Peak productivity between midnight-6am. You do your best work when the world sleeps.`;
    patterns.push(timePattern);
  } else if (peakHour >= 6 && peakHour < 9) {
    timePattern = `🌅 **Early Bird Engineer**: Most active 6-9am. You conquer code before most people wake up!`;
    patterns.push(timePattern);
  } else if (peakHour >= 9 && peakHour < 12) {
    timePattern = `☀️ **Morning Momentum Builder**: 9am-noon is your prime time - classic high-performer schedule`;
    patterns.push(timePattern);
  } else if (peakHour >= 12 && peakHour < 18) {
    timePattern = `🌤️ **Afternoon Architect**: Afternoons are when you hit your stride. Post-lunch focus!`;
    patterns.push(timePattern);
  } else {
    timePattern = `🌆 **Evening Engineer**: Most productive 6pm-midnight. You warm up as the day winds down`;
    patterns.push(timePattern);
  }

  patterns.push(
    `📅 **${commitPatterns.peakDays[0]} Warrior**: ${commitPatterns.peakDays[0]}s see your highest output`
  );

  if (workLifeBalance.weekendActivity > 40) {
    patterns.push(
      `🏗️ Weekend builder - ${workLifeBalance.weekendActivity}% activity on weekends. You love what you do! (But watch burnout)`
    );
  }

  if (collaboration.soloVsTeam >= 70) {
    patterns.push(
      `🎨 Solo creator - you build independently. Great for focused work, but collaboration multiplies impact`
    );
  } else if (collaboration.soloVsTeam <= 30) {
    patterns.push(
      `👥 Team player - you thrive in collaborative environments and contribute to shared projects`
    );
  }

  if (productivity.deepWorkSessions >= 10) {
    patterns.push(
      `⏰ Deep work master - ${productivity.deepWorkSessions} uninterrupted sessions monthly. That's where breakthrough code happens`
    );
  }

  // 🎯 RECOMMENDATIONS
  if (commitPatterns.consistency < 50) {
    recommendations.push(
      `Build a commit streak: even 10 minutes daily beats 5-hour weekend binges. GitHub's contribution graph is your accountability partner`
    );
  }

  if (commitPatterns.commitMessageQuality < 60) {
    recommendations.push(
      `Try conventional commits (feat:, fix:, docs:) - they make history scannable and show professional polish`
    );
  }

  if (workLifeBalance.burnoutRisk > 65) {
    recommendations.push(
      `🚨 Burnout alert (${workLifeBalance.burnoutRisk}% risk): ${workLifeBalance.weekendActivity > 50 ? 'Take weekends off' : workLifeBalance.nightCoding > 40 ? 'Shift work to daytime' : 'Reduce total hours'}. Sustainability > short-term hustle`
    );
  }

  if (collaboration.score < 5) {
    recommendations.push(
      `Engage with open source: comment on issues, review PRs, contribute docs. Visibility = opportunities`
    );
  }

  if (productivity.deepWorkSessions < 5) {
    recommendations.push(
      `Block 2-hour focus sessions: disable Slack, close email, just code. Deep work is where you build competitive advantage`
    );
  }

  if (codeQuality.documentationHabits < 50) {
    recommendations.push(
      `Document as you code: future-you (and teammates) will thank you. Even brief comments 10x code value`
    );
  }

  // 📖 STORY
  let story = '';

  if (data.overallScore >= 8) {
    story = `You've developed **elite coding patterns**. ${commitPatterns.consistency >= 70 ? 'Your consistency is rare - ' : ''}${productivity.deepWorkSessions >= 8 ? 'you achieve deep focus, ' : ''}${workLifeBalance.burnoutRisk < 30 ? 'maintain sustainability, ' : ''}and ${collaboration.score >= 7 ? 'collaborate effectively. ' : 'execute systematically. '}This combination - ${data.developerPersona} style with ${commitPatterns.consistency >= 70 ? 'unwavering discipline' : 'strong execution'} - is what separates good developers from great ones. ${workLifeBalance.burnoutRisk < 30 ? 'Best part: you can maintain this long-term.' : 'Your pace is your competitive moat.'}`;
  } else if (data.overallScore >= 6) {
    story = `You have **solid development habits** as a ${data.developerPersona}. ${commitPatterns.peakHours[0]}:00 is clearly your power hour! ${commitPatterns.consistency >= 60 ? 'Good consistency, ' : ''}${productivity.deepWorkSessions >= 5 ? 'decent focus time, ' : ''}but ${commitPatterns.consistency < 60 ? 'more consistency' : workLifeBalance.burnoutRisk > 60 ? 'better work-life balance' : 'deeper collaboration'} would level you up. The patterns are there - now it's about optimization.`;
  } else if (data.overallScore >= 4) {
    story = `Your ${data.developerPersona} style works for you, but **let's sharpen your edge**. ${commitPatterns.consistency < 40 ? 'Inconsistent activity is holding you back - ' : ''}${productivity.deepWorkSessions < 3 ? 'fragmented focus prevents breakthroughs. ' : ''}Good news: patterns are habits, and habits can change. Start small: ${commitPatterns.consistency < 40 ? 'commit daily for 2 weeks, ' : ''}${productivity.deepWorkSessions < 3 ? 'block one 2-hour focus session weekly. ' : ''}Compound this over months and you'll look back amazed at the growth.`;
  } else {
    story = `Time to build stronger **development rhythms**! You're coding, but ${commitPatterns.consistency < 30 ? 'sporadically. ' : 'without clear patterns. '}${data.developerPersona} is your natural style - let's optimize it. This week: ${commitPatterns.consistency < 30 ? '1) Commit something small daily (even docs), ' : '1) Set a specific coding hour, '}2) ${productivity.deepWorkSessions < 3 ? 'Try one 90-min focus block, ' : 'Review your best coding times, '}3) ${commitPatterns.commitMessageQuality < 50 ? 'Write clearer commit messages' : 'Document one thing you built'}. These micro-patterns compound into mastery faster than you think.`;
  }

  return {
    strengths: strengths.slice(0, 5),
    patterns: patterns.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    story,
  };
}

// ==========================================
// CAREER INSIGHTS
// ==========================================

export function generateCareerInsights(data: {
  experienceLevel: string;
  overallScore: number;
  skills: {
    technicalBreadth: number;
    documentation: number;
    collaboration: number;
    projectManagement: number;
    codeQuality: number;
    productivity: number;
  };
  professionalMetrics: {
    portfolioStrength: number;
    marketValue: string;
    visibility: number;
    consistency: number;
  };
  profileType: string;
}): {
  strengths: string[];
  recommendations: string[];
  story: string;
} {
  const strengths: string[] = [];
  const recommendations: string[] = [];

  const { skills, professionalMetrics, experienceLevel, profileType } = data;

  // ✅ STRENGTHS
  if (skills.technicalBreadth >= 8) {
    strengths.push(
      `🚀 Impressive technical breadth (${skills.technicalBreadth}/10) - you're a polyglot developer who adapts to any stack`
    );
  }

  if (skills.documentation >= 8) {
    strengths.push(
      `📚 Exceptional documentation skills (${skills.documentation}/10) - rare and highly valued in senior roles`
    );
  }

  if (skills.collaboration >= 8) {
    strengths.push(
      `🤝 Strong collaborator (${skills.collaboration}/10) - you multiply team effectiveness, not just your own output`
    );
  }

  if (skills.projectManagement >= 8) {
    strengths.push(
      `📊 Solid project management (${skills.projectManagement}/10) - you ship consistently and maintain codebases well`
    );
  }

  if (skills.codeQuality >= 8) {
    strengths.push(
      `✨ High code quality standards (${skills.codeQuality}/10) - your code is maintainable, not just functional`
    );
  }

  if (skills.productivity >= 8) {
    strengths.push(
      `⚡ Outstanding productivity (${skills.productivity}/10) - you get things done without burning out`
    );
  }

  if (professionalMetrics.portfolioStrength >= 80) {
    strengths.push(
      `💼 Portfolio strength ${professionalMetrics.portfolioStrength}% - your GitHub is a compelling resume`
    );
  }

  if (professionalMetrics.marketValue === 'Elite' || professionalMetrics.marketValue === 'High-Value') {
    strengths.push(
      `💎 ${professionalMetrics.marketValue} market positioning - you're in the top tier of developer talent`
    );
  }

  // 🎯 RECOMMENDATIONS
  const weakestSkill = Object.entries(skills).reduce((min, [key, val]) =>
    val < min[1] ? [key, val] : min
  , ['', 10])[0];

  const skillLabels: Record<string, string> = {
    technicalBreadth: 'technical breadth',
    documentation: 'documentation',
    collaboration: 'collaboration',
    projectManagement: 'project management',
    codeQuality: 'code quality',
    productivity: 'productivity',
  };

  recommendations.push(
    `Focus on **${skillLabels[weakestSkill]}** - it's your growth edge. Small improvements here compound into big career leaps`
  );

  if (skills.collaboration < 6) {
    recommendations.push(
      `Increase OSS engagement: 10 meaningful PR reviews this quarter will boost your collaboration score and visibility`
    );
  }

  if (skills.documentation < 6) {
    recommendations.push(
      `Document one complex project deeply: architecture docs, decision records, API guides. This signals senior-level thinking`
    );
  }

  if (professionalMetrics.visibility < 50) {
    recommendations.push(
      `Build visibility: start a tech blog, speak at meetups, or contribute to popular repos. Visibility = opportunity`
    );
  }

  if (experienceLevel === 'Junior' && data.overallScore >= 6) {
    recommendations.push(
      `You're ready for mid-level roles! Update your resume, highlight your ${skills.technicalBreadth >= 7 ? 'diverse tech stack' : skills.codeQuality >= 7 ? 'quality code practices' : 'consistent contributions'}`
    );
  }

  if (experienceLevel === 'Mid-Level' && data.overallScore >= 7.5) {
    recommendations.push(
      `Approaching senior level: focus on mentoring others, architectural decisions, and documenting your technical judgment`
    );
  }

  if (professionalMetrics.marketValue === 'Entry' && data.overallScore >= 5) {
    recommendations.push(
      `Build 2-3 production-quality projects end-to-end. Complete projects > many half-finished ones. This shifts you to "Competitive"`
    );
  }

  // 📖 STORY
  let story = '';

  if (data.overallScore >= 8) {
    story = `You're a **${experienceLevel} ${profileType}** with elite-level execution. Your profile shows ${skills.technicalBreadth >= 8 ? 'impressive technical range, ' : ''}${skills.collaboration >= 8 ? 'strong collaboration, ' : ''}${skills.codeQuality >= 8 ? 'quality-focused code, ' : ''}and ${professionalMetrics.consistency >= 70 ? 'remarkable consistency' : 'solid fundamentals'}. Market value: **${professionalMetrics.marketValue}** - companies actively seek developers with your profile. ${professionalMetrics.portfolioStrength >= 80 ? 'Your GitHub is interview-ready.' : ''} You're not just employable, you're **in-demand**. Keep this up and doors will open before you knock.`;
  } else if (data.overallScore >= 6) {
    story = `As a **${experienceLevel} ${profileType}**, you have a **solid professional foundation**. ${skills.technicalBreadth >= 7 ? 'Your tech stack is diverse, ' : ''}${skills.projectManagement >= 7 ? 'you ship consistently, ' : ''}and ${skills.collaboration >= 7 ? 'you work well with others' : 'you execute reliably'}. Market value: **${professionalMetrics.marketValue}** - you're competitive in the job market. To level up: ${skills[weakestSkill as keyof typeof skills] < 6 ? `strengthen your ${skillLabels[weakestSkill]} ` : ''}${professionalMetrics.visibility < 50 ? 'and increase visibility. ' : ''}${experienceLevel === 'Junior' && data.overallScore >= 6.5 ? 'You\'re actually ready for mid-level roles - don\'t undersell yourself!' : 'Focus on depth in one area rather than breadth everywhere.'}`;
  } else if (data.overallScore >= 4) {
    story = `You're a **${experienceLevel} ${profileType}** with **clear potential**. ${skills.technicalBreadth >= 5 ? 'Your technical foundation is there, ' : ''}but ${skills[weakestSkill as keyof typeof skills] < 5 ? `${skillLabels[weakestSkill]} needs work. ` : 'consistency is key. '}Market value: **${professionalMetrics.marketValue}** - you're employable but not yet standing out. Good news: the gap from "hireable" to "sought-after" is smaller than you think. ${professionalMetrics.portfolioStrength < 50 ? 'Focus on 2-3 showcase projects. ' : ''}${skills.documentation < 5 ? 'Document your work. ' : ''}${professionalMetrics.consistency < 50 ? 'Build daily coding habits. ' : ''}These compound over 6 months into dramatic career shifts.`;
  } else {
    story = `As a **${experienceLevel} ${profileType}**, you're **building your foundation**. Market value: **${professionalMetrics.marketValue}** - you're at the start of your journey, and that's okay! Every senior dev started here. Focus: ${skills.codeQuality < 5 ? '1) Code quality over speed, ' : '1) Consistent daily practice, '}${skills.documentation < 5 ? '2) Document everything you learn, ' : '2) Complete small projects end-to-end, '}${professionalMetrics.visibility < 30 ? '3) Share your work publicly' : '3) Contribute to open source'}. Don't compare yourself to seniors - compare yourself to last month's you. ${professionalMetrics.consistency < 30 ? 'Build the habit first, speed comes later.' : 'You\'re doing the work, keep going!'} In 12 months of consistent effort, you'll be amazed at your growth.`;
  }

  return {
    strengths: strengths.slice(0, 6),
    recommendations: recommendations.slice(0, 6),
    story,
  };
}

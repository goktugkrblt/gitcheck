# GitCheck

<div align="center">
  <img src="public/logo.svg" alt="GitCheck Logo" width="50" height="50">
  
  ### GitHub Quantified
  
  Transform your code contributions into quantifiable career metrics.
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=flat-square&logo=postgresql)](https://neon.tech/)
  [![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
  
  [Live Demo](https://gitcheck.me) · [Report Bug](https://github.com/goktugkrblt/gitcheck/issues) · [Request Feature](https://github.com/goktugkrblt/gitcheck/issues)
</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Scoring Algorithm](#-scoring-algorithm)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

GitCheck is a comprehensive GitHub profile analyzer that transforms your code contributions into quantifiable career metrics. Built for developers who want to showcase their impact, track their growth, and understand their coding patterns through advanced analytics and beautiful visualizations.

### Why GitCheck?

- **Quantifiable Metrics**: Convert abstract GitHub activity into concrete, career-relevant numbers
- **Developer Score**: Proprietary algorithm that evaluates your overall GitHub impact
- **Real-time Analysis**: Live tracking of commits, PRs, and contributions
- **Beautiful Dashboard**: Clean, minimal UI with smooth animations
- **Free Forever**: No credit card required, no hidden fees

---

## ✨ Key Features

### 🔍 Deep GitHub Analysis
- **Profile Scoring**: Advanced algorithm analyzing 15+ metrics
- **Repository Analysis**: Quality assessment based on stars, forks, and activity
- **Contribution Tracking**: Commits, PRs, issues, and code reviews
- **Language Breakdown**: Technical stack visualization
- **Activity Patterns**: Most active days, streaks, and consistency

### 📊 Comprehensive Metrics
- Total repositories and their impact
- Stars and forks received
- Pull requests created and merged
- Commit frequency and patterns
- Contribution streaks (current and longest)
- Community engagement (followers, organizations)
- Weekend vs weekday activity analysis

### 🎨 User Experience
- One-click GitHub OAuth authentication
- Real-time data synchronization
- Responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Dark mode optimized interface
- Shareable profile links

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with GitHub OAuth
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Neon)
- **ORM**: [Prisma](https://www.prisma.io/)

### External APIs
- **GitHub REST API**: Profile and repository data
- **GitHub GraphQL API**: Advanced queries and contributions

### DevOps & Tools
- **Deployment**: [Vercel](https://vercel.com/)
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- PostgreSQL database (or Neon account)
- GitHub OAuth App credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/goktugkrblt/gitcheck.git
   cd GitCheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   
   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database"
   
   # Optional
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

4. **Set up GitHub OAuth App**
   
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - **Homepage URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Client Secret to `.env.local`

5. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
GitCheck/
├── app/
│   ├── api/
│   │   ├── auth/              # NextAuth configuration
│   │   ├── github/            # GitHub API integration
│   │   └── profile/           # Profile management
│   ├── dashboard/             # Dashboard pages
│   ├── login/                 # Authentication pages
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── dashboard/             # Dashboard components
│   │   ├── language-chart.tsx
│   │   ├── score-display.tsx
│   │   ├── stats-card.tsx
│   │   └── top-repos.tsx
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── auth.ts                # Authentication utilities
│   ├── db.ts                  # Database client
│   └── github.ts              # GitHub API client
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env.local                 # Environment variables (not in repo)
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

---

## 🔌 API Documentation

### Authentication

**POST** `/api/auth/signin`
- Initiates GitHub OAuth flow
- Returns: Redirect to GitHub authorization

**GET** `/api/auth/callback/github`
- GitHub OAuth callback
- Creates/updates user in database
- Returns: Session token

### Profile

**GET** `/api/profile`
- Fetches user's profile data
- Requires: Authentication
- Returns: User profile with all metrics

**POST** `/api/github/analyze`
- Triggers full GitHub analysis
- Requires: Authentication
- Returns: Updated profile data

### GitHub Integration

**Internal**: GitHub API calls are handled server-side
- Rate limiting: 5000 requests/hour (authenticated)
- Caching: Profile data cached for 1 hour
- Error handling: Graceful fallbacks for API failures

---

## 📊 Scoring Algorithm

GitCheck uses a proprietary algorithm to calculate your Developer Score (0-100):

### Score Components

```typescript
Score = (
  repositoryScore * 0.25 +
  contributionScore * 0.30 +
  communityScore * 0.20 +
  consistencyScore * 0.15 +
  qualityScore * 0.10
)
```

### Breakdown

1. **Repository Score (25%)**
   - Number of public repositories
   - Stars received
   - Forks received
   - Repository freshness

2. **Contribution Score (30%)**
   - Total commits
   - Pull requests created
   - Pull requests merged
   - Issues opened/closed
   - Code reviews

3. **Community Score (20%)**
   - Followers count
   - Organizations membership
   - Collaborations
   - Public gists

4. **Consistency Score (15%)**
   - Current streak
   - Longest streak
   - Commit frequency
   - Active days percentage

5. **Quality Score (10%)**
   - Average commits per repository
   - PR merge rate
   - Language diversity
   - Documentation presence

### Percentile Ranking

Your score is compared against all GitCheck users to determine your percentile:
- **Top 1%**: Score 90-100
- **Top 5%**: Score 80-89
- **Top 10%**: Score 70-79
- **Top 25%**: Score 60-69
- **Top 50%**: Score 50-59

---

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXTAUTH_URL` | Application URL | Yes | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth encryption key | Yes | - |
| `GITHUB_CLIENT_ID` | GitHub OAuth App ID | Yes | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Secret | Yes | - |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NODE_TLS_REJECT_UNAUTHORIZED` | TLS certificate validation | No | `1` |

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production URL
   - Update GitHub OAuth callback URL

4. **Deploy**
   - Vercel will automatically build and deploy
   - Access your site at `your-project.vercel.app`

### Custom Domain

1. Add custom domain in Vercel dashboard
2. Update DNS records
3. Update `NEXTAUTH_URL` environment variable
4. Update GitHub OAuth App callback URL

---

## 🗄️ Database Schema

```prisma
model User {
  id                    String   @id @default(cuid())
  email                 String?  @unique
  name                  String?
  githubId              String   @unique
  githubUsername        String   @unique
  avatarUrl             String?
  
  // Metrics
  score                 Int      @default(0)
  percentile            Int      @default(0)
  totalRepos            Int      @default(0)
  totalStars            Int      @default(0)
  totalForks            Int      @default(0)
  totalCommits          Int      @default(0)
  totalPRs              Int      @default(0)
  mergedPRs             Int      @default(0)
  currentStreak         Int      @default(0)
  longestStreak         Int      @default(0)
  followersCount        Int      @default(0)
  organizationsCount    Int      @default(0)
  averageCommitsPerDay  Float    @default(0)
  mostActiveDay         String?
  weekendActivity       Float    @default(0)
  
  // JSON fields
  languages             Json     @default("{}")
  topRepos              Json     @default("[]")
  
  // Timestamps
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  lastAnalyzedAt        DateTime?
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update documentation if needed

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Contact

**Goktug** - [goktug.info](https://goktug.info)

Project Link: [https://github.com/goktugkrblt/gitcheck](https://github.com/goktugkrblt/gitcheck)

Live Demo: [https://gitcheck.me](https://gitcheck.me)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [GitHub API](https://docs.github.com/en/rest) - Data source
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Neon](https://neon.tech/) - Serverless PostgreSQL

---

<div align="center">
  
  **Built for developers by developers**
  
  Made with ❤️ by [Goktug](https://goktug.info)
  
  © 2025 gitcheck.me
  
</div>

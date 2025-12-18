import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        // Save or update user in database
        const githubProfile = profile as any;
        
        await prisma.user.upsert({
          where: { email: user.email! },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            githubId: githubProfile.id,
            githubUsername: githubProfile.login,
            githubToken: account.access_token,
          },
          update: {
            name: user.name,
            image: user.image,
            githubToken: account.access_token,
          },
        });
      }
      return true;
    },
    
    // ✅ DÜZELT: redirectTo'yu kullan
    async redirect({ url, baseUrl }) {
      // Eğer url baseUrl ile başlıyorsa (internal link), oraya git
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Eğer url sadece path ise (/, /dashboard), ekle ve git
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Yoksa homepage
      return baseUrl;
    },
  },
})
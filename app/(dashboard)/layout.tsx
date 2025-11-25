import { Code2, LayoutDashboard, User, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      {/* Fixed Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #919191 1px, transparent 1px),
              linear-gradient(to bottom, #919191 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,transparent_0%,#1f1f1f_100%)]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-[#2a2a2a] bg-[#1f1f1f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-[#252525] border border-[#2a2a2a] flex items-center justify-center group-hover:border-[#333] transition-colors duration-300">
                <Code2 className="h-5 w-5 text-[#919191] group-hover:text-[#b0b0b0] transition-colors duration-300" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#e0e0e0] tracking-tighter">GITTRACK</span>
                <span className="text-xl font-black text-[#666]">.ME</span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-mono text-[#919191] hover:text-[#e0e0e0] transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                DASHBOARD
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-mono text-[#919191] hover:text-[#e0e0e0] transition-colors"
              >
                <User className="h-4 w-4" />
                PROFILE
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 text-sm font-mono text-[#919191] hover:text-[#e0e0e0] transition-colors"
              >
                <Settings className="h-4 w-4" />
                SETTINGS
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  );
}
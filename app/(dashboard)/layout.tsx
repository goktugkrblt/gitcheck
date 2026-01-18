"use client";

import { Navbar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050307]">
      {/* Navbar - Not Sticky */}
      <Navbar maxWidth="max-w-7xl" sticky={false} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-12">
        {children}
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export function UserMenu() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dropdown position
  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // scrollY ekledik
        right: window.innerWidth - rect.right
      });
    }
  }, [dropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    const currentPath = window.location.pathname;
    
    // Eğer homepage'deysek, orada kal ve reload et
    if (currentPath === '/') {
      await signOut({ redirect: false });
      window.location.reload();
    } else {
      // Diğer sayfalardaysak homepage'e git
      await signOut({ callbackUrl: '/' });
    }
  };

  // If not authenticated, show Sign In button
  if (!isAuthenticated) {
    // ✅ Current path'i callbackUrl olarak gönder
    const loginUrl = mounted 
      ? `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
      : '/login';
      
    return (
      <Link href={loginUrl}>
        <button className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-[#050307] border border-[#131c26] text-[#919191] hover:text-[#e0e0e0] hover:border-[#333] transition-all duration-300">
          <User className="h-4 w-4" />
          <span className="text-sm font-mono tracking-wider">SIGN IN</span>
        </button>
      </Link>
    );
  }

  // Dropdown Menu Component
  const DropdownMenu = () => (
    <AnimatePresence>
      {dropdownOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
            zIndex: 999999,
          }}
          className="w-56 rounded-lg bg-[#050307] border border-[#131c26] shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-[#131c26]">
            <div className="flex items-center gap-3">
              <img 
                src={session.user?.image || `https://github.com/${session.user?.name}.png`}
                alt={session.user?.name || "User"}
                className="w-10 h-10 rounded-full border-2 border-[#131c26]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {session.user?.name}
                </p>
                <p className="text-xs text-[#919191] truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Dashboard Link */}
            <Link href="/dashboard">
              <button
                onClick={() => setDropdownOpen(false)}
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#919191] hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <span className="font-mono tracking-wider">DASHBOARD</span>
              </button>
            </Link>

            {/* Settings Link (Optional) */}
            <button
              className="cursor-not-allowed w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#919191] hover:text-white hover:bg-white/5 transition-all duration-200 opacity-50"
              disabled
            >
              <Settings className="h-4 w-4" />
              <span className="font-mono tracking-wider">SETTINGS</span>
              <span className="ml-auto text-[10px] text-[#919191]/50 font-mono">SOON</span>
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-[#131c26]" />

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-mono tracking-wider">SIGN OUT</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // If authenticated, show avatar dropdown
  return (
    <>
      {/* Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex cursor-pointer items-center gap-2 px-2 py-2 rounded-lg bg-[#050307] border border-[#131c26] hover:border-[#333] transition-all duration-300 group relative z-10"
      >
        {/* Avatar Image */}
        <div className="relative">
          <img 
            src={session.user?.image || `https://github.com/${session.user?.name}.png`}
            alt={session.user?.name || "User"}
            className="w-8 h-8 rounded-full border-2 border-[#131c26] group-hover:border-[#333] transition-colors"
          />
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#050307]" />
        </div>

        {/* Username - Hidden on mobile */}
        <span className="hidden md:block text-sm text-[#919191] group-hover:text-[#e0e0e0] font-mono tracking-wider max-w-[120px] truncate">
          {session.user?.name}
        </span>

        {/* Dropdown arrow */}
        <ChevronDown 
          className={`h-4 w-4 text-[#919191] group-hover:text-[#e0e0e0] transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Render dropdown in portal (directly to body) */}
      {mounted && createPortal(<DropdownMenu />, document.body)}
    </>
  );
}
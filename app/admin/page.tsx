"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { Search, Crown, Users, TrendingUp } from "lucide-react";

const ADMIN_EMAIL = 'goktugkarabulut97@gmail.com';

interface Profile {
  username: string;
  score: number;
  scannedAt: Date;
  aiAnalysisCache: any;
}

interface User {
  id: string;
  email: string | null;
  githubUsername: string;
  plan: 'FREE' | 'PRO';
  createdAt: Date;
  profile: Profile | null;
  score: number | null;
  lastScan: Date | null;
  hasAiAnalysis: boolean;
  isOrphaned: boolean;
}

interface Stats {
  total: number;
  registered: number;
  orphaned: number;
  pro: number;
  free: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, registered: 0, orphaned: 0, pro: 0, free: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    // Strict admin check - only your email
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      console.log('Unauthorized access attempt to admin panel');
      router.push('/');
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: 'FREE' | 'PRO') => {
    setUpdatingUserId(userId);
    try {
      const response = await fetch('/api/admin/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, plan: newPlan }),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      await fetchUsers();
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    user.githubUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050307] flex items-center justify-center">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050307]">
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mb-2">
            Admin Panel
          </h1>
          <p className="text-black/60 dark:text-white/60">
            Manage users and grant PRO access
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-semibold text-black/60 dark:text-white/60">
                Total Profiles
              </span>
            </div>
            <div className="text-3xl font-black text-black dark:text-white">
              {stats.total}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-black/60 dark:text-white/60">
                Registered
              </span>
            </div>
            <div className="text-3xl font-black text-black dark:text-white">
              {stats.registered}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-semibold text-black/60 dark:text-white/60">
                Guest
              </span>
            </div>
            <div className="text-3xl font-black text-black dark:text-white">
              {stats.orphaned}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-black/60 dark:text-white/60">
                PRO Users
              </span>
            </div>
            <div className="text-3xl font-black text-black dark:text-white">
              {stats.pro}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-black/60 dark:text-white/60">
                FREE Users
              </span>
            </div>
            <div className="text-3xl font-black text-black dark:text-white">
              {stats.free}
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search by email or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black dark:text-white">
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black dark:text-white">
                    Plan
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black dark:text-white">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black dark:text-white">
                    AI Analysis
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black dark:text-white">
                    Joined
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-black/10 dark:border-white/10 ${
                      index % 2 === 0 ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-black dark:text-white">
                            {user.githubUsername}
                          </span>
                          {user.isOrphaned && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-500/10 text-gray-600 dark:text-gray-400">
                              Guest
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-black/60 dark:text-white/60">
                          {user.email || 'No account'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.plan === 'PRO'
                            ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                            : 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                        }`}
                      >
                        {user.plan === 'PRO' && <Crown className="w-3 h-3" />}
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white">
                      {user.score ? user.score.toFixed(1) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm ${
                          user.hasAiAnalysis
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-black/40 dark:text-white/40'
                        }`}
                      >
                        {user.hasAiAnalysis ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black/60 dark:text-white/60">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.isOrphaned ? (
                        <span className="text-sm text-black/40 dark:text-white/40">
                          No account
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            updateUserPlan(user.id, user.plan === 'PRO' ? 'FREE' : 'PRO')
                          }
                          disabled={updatingUserId === user.id}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            user.plan === 'PRO'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {updatingUserId === user.id
                            ? 'Updating...'
                            : user.plan === 'PRO'
                            ? 'Revoke PRO'
                            : 'Grant PRO'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-black/60 dark:text-white/60">
              No users found
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

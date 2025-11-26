import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // ← auth.ts dosyanızdan import
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const session = await auth();
  
  // Email kontrolü - kendi email'inizi yazın
  if (!session || session.user?.email !== 'goktugsecen15@gmail.com') {
    redirect('/');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      githubUsername: true,
      createdAt: true,
      _count: {
        select: { profiles: true }
      }
    }
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Registered Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">GitHub Username</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Profiles</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.githubUsername}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user._count.profiles}</td>
                <td className="px-4 py-3">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
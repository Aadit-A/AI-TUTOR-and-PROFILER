'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code, Activity, BarChart2, Settings, LogOut, Award, Zap, Loader2, ExternalLink, List } from 'lucide-react'

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const user = session?.user as any
  const hasLinkedAccounts = user?.leetcode || user?.codeforces || user?.hackerrank

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    else if (status === 'authenticated') {
      if (!hasLinkedAccounts) { router.push('/student/profile'); return }
      fetch('/api/student/leetcode-stats').then(r => r.json()).then(d => { if (d.success) setStats(d.data) }).finally(() => setLoading(false))
    }
  }, [status, hasLinkedAccounts, router])

  if (status === 'loading') return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>
  if (status === 'unauthenticated') return null

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><Code size={16} /></div>
            AI Tutor
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem href="/student/dashboard" icon={<Activity size={16} />} label="Overview" active />
          <NavItem href="/student/problems" icon={<List size={16} />} label="Problems" />
          <NavItem href="/student/practice" icon={<Code size={16} />} label="Practice Lab" />
          <NavItem href="/student/profile" icon={<Settings size={16} />} label="Settings" />
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 rounded-lg">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {session?.user?.name || 'Student'}</h1>
        <p className="text-slate-400 mb-8">Track your coding progress and improve your skills.</p>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400"><Loader2 className="animate-spin" size={20} /> Loading stats...</div>
        ) : !hasLinkedAccounts ? (
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <p className="text-slate-400 mb-4">Link your coding accounts to see your stats.</p>
            <Link href="/student/profile" className="text-blue-400 hover:underline">Go to Settings →</Link>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Easy" value={stats?.easy || 0} color="text-green-400" icon={<Zap size={18} />} />
              <StatCard label="Medium" value={stats?.medium || 0} color="text-yellow-400" icon={<Activity size={18} />} />
              <StatCard label="Hard" value={stats?.hard || 0} color="text-red-400" icon={<Award size={18} />} />
              <StatCard label="Total Solved" value={stats?.total || 0} color="text-purple-400" icon={<Code size={18} />} />
            </div>

            {/* Linked Platforms */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
              <h3 className="font-bold text-white mb-4">Linked Accounts</h3>
              <div className="flex flex-wrap gap-3">
                {user?.leetcode && <PlatformBadge name="LeetCode" username={user.leetcode} color="bg-yellow-500/10 text-yellow-500" />}
                {user?.codeforces && <PlatformBadge name="Codeforces" username={user.codeforces} color="bg-blue-500/10 text-blue-500" />}
                {user?.hackerrank && <PlatformBadge name="HackerRank" username={user.hackerrank} color="bg-green-500/10 text-green-500" />}
              </div>
            </div>

            {/* Recent Submissions */}
            {stats?.recentSubmissions?.length > 0 && (
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="font-bold text-white mb-4">Recent Submissions</h3>
                <div className="space-y-2">
                  {stats.recentSubmissions.slice(0, 5).map((s: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                      <span className="text-sm">{s.title}</span>
                      <span className={`text-xs ${s.statusDisplay === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{s.statusDisplay}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return <Link href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${active ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800'}`}>{icon} {label}</Link>
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  )
}

function PlatformBadge({ name, username, color }: { name: string; username: string; color: string }) {
  return <div className={`px-3 py-1.5 rounded-lg text-sm ${color}`}>{name}: <span className="font-medium">{username}</span></div>
}

'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code, Activity, Award, Zap, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import StudentSidebar from '@/components/student/StudentSidebar'

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const user = session?.user as any
  const hasLinkedAccounts = user?.leetcode

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    else if (status === 'authenticated') {
      if (!hasLinkedAccounts) { router.push('/student/profile'); return }
      fetch('/api/student/leetcode-stats').then(r => r.json()).then(d => { if (d.success) setStats(d.data) }).finally(() => setLoading(false))
    }
  }, [status, hasLinkedAccounts, router])

  return (
    <div className="flex h-screen bg-[#f3f6f4] text-[#233337]">
      <StudentSidebar active="overview" />

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        {status === 'loading' ? (
           <div className="h-full flex items-center justify-center text-[#5a7275]"><Loader2 className="mr-2 animate-spin" size={20} /> Loading dashboard...</div>
        ) : status === 'unauthenticated' ? (
           <div className="h-full flex flex-col items-center justify-center text-[#5a7275]">
              <p className="mb-4">Please log in to view your dashboard.</p>
              <button onClick={() => router.push('/login')} className="rounded-lg bg-teal-700 px-4 py-2 text-white">Log In</button>
           </div>
        ) : (
          <>
        <h1 className="mb-2 text-2xl font-bold text-[#18292c]">Welcome back, {session?.user?.name || 'Student'}</h1>
        <p className="mb-8 text-[#5a7275]">Track your coding progress and improve your skills.</p>

        {loading ? (
          <div className="flex items-center gap-2 text-[#5a7275]"><Loader2 className="animate-spin" size={20} /> Loading stats...</div>
        ) : !hasLinkedAccounts ? (
          <div className="rounded-xl border border-[#d6e2de] bg-white p-6">
            <p className="mb-4 text-[#5a7275]">Link your coding accounts to see your stats.</p>
            <Link href="/student/profile" className="text-teal-700 hover:underline">Go to Settings →</Link>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatCard label="Easy" value={stats?.easy || 0} color="text-green-600" icon={<Zap size={18} />} delay={0.02} />
              <StatCard label="Medium" value={stats?.medium || 0} color="text-amber-600" icon={<Activity size={18} />} delay={0.06} />
              <StatCard label="Hard" value={stats?.hard || 0} color="text-rose-600" icon={<Award size={18} />} delay={0.1} />
              <StatCard label="Total Solved" value={stats?.total || 0} color="text-teal-700" icon={<Code size={18} />} delay={0.14} />
            </div>

            {/* Linked Platforms */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.3 }} className="mb-6 rounded-xl border border-[#d6e2de] bg-white p-6">
              <h3 className="mb-4 font-bold text-[#18292c]">Linked Accounts</h3>
              <div className="flex flex-wrap gap-3">
                {user?.leetcode && <PlatformBadge name="LeetCode" username={user.leetcode} color="border border-amber-200 bg-amber-50 text-amber-700" />}
              </div>
            </motion.div>

            {/* Recent Submissions */}
            {stats?.recentSubmissions?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: 0.06 }} className="rounded-xl border border-[#d6e2de] bg-white p-6">
                <h3 className="mb-4 font-bold text-[#18292c]">Recent Submissions</h3>
                <div className="space-y-2">
                  {stats.recentSubmissions.slice(0, 5).map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between border-b border-[#e2ece9] py-2 last:border-0">
                      <span className="text-sm">{s.title}</span>
                      <span className={`text-xs ${s.statusDisplay === 'Accepted' ? 'text-green-600' : 'text-rose-600'}`}>{s.statusDisplay}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
        </>
      )}
      </main>
    </div>
  )
}

function StatCard({ label, value, color, icon, delay }: { label: string; value: number; color: string; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.28, delay }} className="rounded-xl border border-[#d6e2de] bg-white p-5">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold text-[#18292c]">{value}</div>
      <div className="text-sm text-[#5a7275]">{label}</div>
    </motion.div>
  )
}

function PlatformBadge({ name, username, color }: { name: string; username: string; color: string }) {
  return <div className={`px-3 py-1.5 rounded-lg text-sm ${color}`}>{name}: <span className="font-medium">{username}</span></div>
}

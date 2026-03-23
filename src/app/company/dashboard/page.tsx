'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code, Users, Search, Building, LogOut } from 'lucide-react'

export default function CompanyDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>
  if (status === 'unauthenticated') { router.push('/login'); return null }

  const mockCandidates = [
    { name: 'Alice Chen', email: 'alice@example.com', leetcode: 'alice_lc', solved: 245, score: 92 },
    { name: 'Bob Smith', email: 'bob@example.com', leetcode: 'bob_codes', solved: 180, score: 85 },
    { name: 'Carol Davis', email: 'carol@example.com', leetcode: 'carol_dev', solved: 320, score: 96 },
  ]

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"><Building size={16} /></div>
            AI Tutor
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem icon={<Users size={16} />} label="Candidates" active />
          <NavItem icon={<Search size={16} />} label="Search" />
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 rounded-lg">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Company Dashboard</h1>
        <p className="text-slate-400 mb-8">Browse verified candidates with real coding stats.</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="text-2xl font-bold text-white">156</div>
            <div className="text-sm text-slate-400">Total Candidates</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="text-2xl font-bold text-white">42</div>
            <div className="text-sm text-slate-400">Verified Profiles</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="text-2xl font-bold text-white">89%</div>
            <div className="text-sm text-slate-400">Avg. Readiness</div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-white">Top Candidates</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                <th className="p-4">Name</th>
                <th className="p-4">LeetCode</th>
                <th className="p-4">Problems Solved</th>
                <th className="p-4">Readiness Score</th>
              </tr>
            </thead>
            <tbody>
              {mockCandidates.map((c, i) => (
                <tr key={i} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="font-medium text-white">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.email}</div>
                  </td>
                  <td className="p-4 text-yellow-500">{c.leetcode}</td>
                  <td className="p-4">{c.solved}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${c.score >= 90 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {c.score}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer ${active ? 'bg-purple-500/10 text-purple-400' : 'text-slate-400 hover:bg-slate-800'}`}>{icon} {label}</div>
}

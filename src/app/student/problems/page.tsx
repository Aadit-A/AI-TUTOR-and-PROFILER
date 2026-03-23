'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Code, Activity, BarChart2, Settings, LogOut, List } from 'lucide-react'

interface Problem { _id: string; problemId: number; title: string; difficulty: string; acceptanceRate: number; url: string }

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const params = new URLSearchParams({ limit: '30', page: page.toString() })
    if (search) params.set('search', search)
    if (difficulty) params.set('difficulty', difficulty)
    fetch(`/api/problems?${params}`).then(r => r.json()).then(d => {
      setProblems(d.problems || [])
      setTotalPages(d.pagination?.totalPages || 1)
    })
  }, [search, difficulty, page])

  useEffect(() => { setPage(1) }, [search, difficulty])

  const diffColor = (d: string) => d === 'Easy' ? 'text-green-400' : d === 'Hard' ? 'text-red-400' : 'text-yellow-400'

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <Link href="/student/dashboard" className="flex items-center gap-2 font-bold text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><Code size={16} /></div>
            AI Tutor
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem href="/student/dashboard" icon={<Activity size={16} />} label="Overview" />
          <NavItem href="/student/problems" icon={<List size={16} />} label="Problems" active />
          <NavItem href="/student/practice" icon={<Code size={16} />} label="Practice Lab" />
          <NavItem href="/student/profile" icon={<Settings size={16} />} label="Settings" />
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 rounded-lg">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-white mb-4">LeetCode Problems</h1>
        <div className="flex gap-3 mb-4">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1" />
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-3 py-2">
            <option value="">All</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
          </select>
        </div>
        <div className="space-y-2">
          {problems.map(p => (
            <div key={p._id} className="flex items-center gap-4 p-3 bg-slate-900 rounded hover:bg-slate-800">
              <span className="text-slate-500 w-12">{p.problemId}</span>
              <Link href={`/student/practice?problem=${p.problemId}`} className="flex-1 text-white hover:text-blue-400">{p.title}</Link>
              <span className={`text-sm ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
              <span className="text-sm text-slate-400 w-16">{p.acceptanceRate?.toFixed(0)}%</span>
              <a href={p.url} target="_blank" className="text-blue-400 text-sm">↗</a>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-slate-800 rounded disabled:opacity-50">← Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-slate-800 rounded disabled:opacity-50">Next →</button>
        </div>
      </div>
    </div>
  )
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return <Link href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${active ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800'}`}>{icon} {label}</Link>
}

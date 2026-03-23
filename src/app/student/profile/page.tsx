'use client'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code, Activity, BarChart2, Settings, LogOut, CheckCircle, User, Loader2, AlertCircle, List } from 'lucide-react'

export default function StudentProfile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  if (status === 'loading') return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>
  if (status === 'unauthenticated') { router.push('/login'); return null }

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
          <NavItem href="/student/dashboard" icon={<Activity size={16} />} label="Overview" />
          <NavItem href="/student/problems" icon={<List size={16} />} label="Problems" />
          <NavItem href="/student/practice" icon={<Code size={16} />} label="Practice Lab" />
          <NavItem href="/student/profile" icon={<Settings size={16} />} label="Settings" active />
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 rounded-lg">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-slate-400 mb-8">Link your coding profiles to sync your progress.</p>

        {/* User Info */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
            <User size={32} className="text-slate-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{session?.user?.name || 'Student'}</h2>
            <p className="text-slate-400 text-sm">{session?.user?.email}</p>
          </div>
        </div>

        {/* Connected Platforms */}
        <div className="space-y-4">
          <PlatformCard name="LeetCode" platform="leetcode" apiUrl="/api/leetcode/verify" connected={(session?.user as any)?.leetcode} color="text-yellow-500" onConnect={(u) => update({ leetcode: u })} onUnlink={() => update({ leetcode: null })} />
          <PlatformCard name="Codeforces" platform="codeforces" apiUrl="/api/codeforces/verify" connected={(session?.user as any)?.codeforces} color="text-blue-500" onConnect={(u) => update({ codeforces: u })} onUnlink={() => update({ codeforces: null })} />
          <PlatformCard name="HackerRank" platform="hackerrank" apiUrl="/api/hackerrank/verify" connected={(session?.user as any)?.hackerrank} color="text-green-500" onConnect={(u) => update({ hackerrank: u })} onUnlink={() => update({ hackerrank: null })} />
        </div>

        <div className="mt-8">
          <Link href="/student/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium">
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}

function NavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${active ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800'}`}>
      {icon} {label}
    </Link>
  )
}

function PlatformCard({ name, platform, apiUrl, connected, color, onConnect, onUnlink }: { name: string, platform: string, apiUrl: string, connected?: string, color: string, onConnect: (u: string) => void, onUnlink: () => void }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlinking, setUnlinking] = useState(false)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState<any>(null)

  const verify = async () => {
    if (!username) return
    setLoading(true); setError('')
    try {
      const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')
      setVerified(data.data)
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }

  const confirmLink = () => { onConnect(verified.username); setVerified(null); setUsername('') }

  const unlink = async () => {
    setUnlinking(true)
    await onUnlink()
    setUnlinking(false)
  }

  if (connected) return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-3"><Code size={20} className={color} /><span className="font-medium text-white">{name}</span></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-green-400 text-sm"><CheckCircle size={14} /> {connected}</div>
        <button onClick={unlink} disabled={unlinking} className="text-xs text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50">{unlinking ? 'Unlinking...' : 'Unlink'}</button>
      </div>
    </div>
  )

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <div className="flex items-center gap-3 mb-4"><Code size={20} className={color} /><span className="font-bold text-white">Connect {name}</span></div>
      {!verified ? (
        <div className="flex gap-3">
          <div className="flex-1">
            <input type="text" placeholder={`${name} Username`} value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:border-blue-500 outline-none" />
            {error && <div className="mt-2 flex items-center gap-1 text-red-400 text-xs"><AlertCircle size={12} /> {error}</div>}
          </div>
          <button onClick={verify} disabled={loading || !username} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><User size={16} /><span className="font-bold">{verified.username}</span></div>
            <CheckCircle className="text-green-500" size={16} />
          </div>
          <div className="flex gap-2">
            <button onClick={confirmLink} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium">Link Account</button>
            <button onClick={() => setVerified(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

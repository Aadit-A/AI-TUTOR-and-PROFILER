'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Activity, Code, List, LogOut, Settings, type LucideIcon } from 'lucide-react'

type ActiveTab = 'overview' | 'problems' | 'practice' | 'settings'

type NavItem = {
  key: ActiveTab
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { key: 'overview', href: '/student/dashboard', label: 'Overview', icon: Activity },
  { key: 'problems', href: '/student/problems', label: 'Problems', icon: List },
  { key: 'practice', href: '/student/practice', label: 'Practice Lab', icon: Code },
  { key: 'settings', href: '/student/profile', label: 'Settings', icon: Settings },
]

export default function StudentSidebar({ active }: { active: ActiveTab }) {
  return (
    <aside className="w-56 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <Link href="/student/dashboard" className="flex items-center gap-2 font-bold text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Code size={16} />
          </div>
          AI Tutor
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                active === item.key ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon size={16} /> {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 rounded-lg"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

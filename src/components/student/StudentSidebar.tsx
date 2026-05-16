'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Activity, Code, List, LogOut, Settings, FileSearch, type LucideIcon } from 'lucide-react'

type ActiveTab = 'overview' | 'problems' | 'practice' | 'resume' | 'settings'

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
  { key: 'resume', href: '/student/resume', label: 'Resume Analyzer', icon: FileSearch },
  { key: 'settings', href: '/student/profile', label: 'Settings', icon: Settings },
]

export default function StudentSidebar({ active }: { active: ActiveTab }) {
  return (
    <aside className="flex w-56 flex-col border-r border-[#d8e3df] bg-[#eef4f2]">
      <div className="border-b border-[#d8e3df] p-4">
        <Link href="/student/dashboard" className="flex items-center gap-2 font-bold text-[#18292c]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
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
                active === item.key ? 'bg-teal-700/10 text-teal-800' : 'text-[#5a7275] hover:bg-[#dfe9e5]'
              }`}
            >
              <Icon size={16} /> {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-[#d8e3df] p-3">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[#5a7275] transition-colors hover:text-red-500"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

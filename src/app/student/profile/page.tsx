'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Code, Loader2, User } from 'lucide-react'
import StudentSidebar from '@/components/student/StudentSidebar'
import AuthRequiredModal from '@/components/student/profile/AuthRequiredModal'
import GoogleAccountCard from '@/components/student/profile/GoogleAccountCard'
import PlatformCard from '@/components/student/profile/PlatformCard'

type SessionUser = {
  name?: string | null
  email?: string | null
  googleId?: string
  leetcode?: string
}

export default function StudentProfile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const hasRefreshed = useRef(false)
  const user = (session?.user || {}) as SessionUser

  useEffect(() => {
    if (status === 'authenticated' && !hasRefreshed.current) {
      hasRefreshed.current = true
      update({ action: 'refresh' })
    }
  }, [status, update])

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      <StudentSidebar active="settings" />

      <main className="flex-1 overflow-y-auto p-8">
        {status === 'loading' ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading profile...
          </div>
        ) : status === 'unauthenticated' ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <p className="mb-4">Please log in to view your profile.</p>
            <button onClick={() => router.push('/login')} className="px-4 py-2 bg-blue-600 rounded-lg text-white">
              Log In
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-slate-400 mb-8">Manage your account and connected platforms.</p>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                <User size={32} className="text-slate-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user.name || 'Student'}</h2>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>
            </div>

            <GoogleAccountCard
              googleConnected={Boolean(user.googleId)}
              onRefresh={async () => {
                await update({ action: 'refresh' })
              }}
            />

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Code size={18} /> Coding Platforms
            </h3>
            <div className="space-y-4">
              <PlatformCard
                name="LeetCode"
                apiUrl="/api/leetcode/verify"
                connected={user.leetcode}
                color="text-yellow-500"
                onConnect={async (username) => {
                  const res = await fetch('/api/student/leetcode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username }),
                  })
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    throw new Error(data.error || 'Failed to link LeetCode')
                  }
                  await update({ action: 'refresh' })
                }}
                onUnlink={async () => {
                  const res = await fetch('/api/student/leetcode', {
                    method: 'DELETE',
                  })
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    throw new Error(data.error || 'Failed to unlink LeetCode')
                  }
                  await update({ action: 'refresh' })
                }}
              />
            </div>
          </>
        )}
      </main>

      {status === 'authenticated' && !user.googleId && <AuthRequiredModal />}
    </div>
  )
}
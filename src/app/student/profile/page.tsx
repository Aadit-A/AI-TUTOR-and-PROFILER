'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Code, Loader2, User } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <div className="flex h-screen bg-[#f3f6f4] text-[#233337]">
      <StudentSidebar active="settings" />

      <main className="flex-1 overflow-y-auto p-8">
        {status === 'loading' ? (
          <div className="h-full flex items-center justify-center text-[#5a7275]">
            <Loader2 className="mr-2 animate-spin" size={20} /> Loading profile...
          </div>
        ) : status === 'unauthenticated' ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5a7275]">
            <p className="mb-4">Please log in to view your profile.</p>
            <button onClick={() => router.push('/login')} className="rounded-lg bg-teal-700 px-4 py-2 text-white">
              Log In
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-2 text-2xl font-bold text-[#18292c]">Profile Settings</h1>
            <p className="mb-8 text-[#5a7275]">Manage your account and connected platforms.</p>

            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.3 }} className="mb-6 flex items-center gap-4 rounded-xl border border-[#d6e2de] bg-white p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f1ef]">
                <User size={32} className="text-[#6f8587]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#18292c]">{user.name || 'Student'}</h2>
                <p className="text-sm text-[#5a7275]">{user.email}</p>
              </div>
            </motion.div>

            <GoogleAccountCard
              googleConnected={Boolean(user.googleId)}
              onRefresh={async () => {
                await update({ action: 'refresh' })
              }}
            />

            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#18292c]">
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
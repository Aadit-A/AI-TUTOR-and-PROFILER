'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2, Lock } from 'lucide-react'

export default function AuthRequiredModal() {
  const [loading, setLoading] = useState(false)

  const handleAuth = () => {
    setLoading(true)
    signIn('google', { callbackUrl: '/student/profile' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18373a]/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#d6e2de] bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#d5e3df] bg-[#eff5f3]">
          <Lock size={32} className="text-teal-700" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-[#18292c]">Access Restricted</h2>
        <p className="mb-8 text-[#5a7275]">
          To access AI Tutor features and track your progress, sign in with your Google account.
        </p>
        <button
          onClick={handleAuth}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-teal-600"
        >
          {loading ? <Loader2 className="animate-spin" /> : <span>Sign In with Google</span>}
        </button>
      </div>
    </div>
  )
}

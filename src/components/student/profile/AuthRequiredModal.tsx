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
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
          <Lock size={32} className="text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-slate-400 mb-8">
          To access AI Tutor features and track your progress, sign in with your Google account.
        </p>
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <span>Sign In with Google</span>}
        </button>
      </div>
    </div>
  )
}

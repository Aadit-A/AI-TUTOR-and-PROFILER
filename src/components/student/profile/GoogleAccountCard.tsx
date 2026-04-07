'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Lock } from 'lucide-react'

type GoogleAccountCardProps = {
  googleConnected: boolean
  onRefresh: () => Promise<void>
}

export default function GoogleAccountCard({ googleConnected, onRefresh }: GoogleAccountCardProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Lock size={18} /> Account Security
      </h3>
      <div className="bg-slate-900 rounded-xl border border-slate-800 divide-y divide-slate-800">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900">G</span>
            </div>
            <div>
              <div className="font-medium text-white">Google Account</div>
              <div className="text-sm text-slate-400">{googleConnected ? 'Connected' : 'Not connected'}</div>
            </div>
          </div>

          {googleConnected ? (
            <UnlinkGoogleButton onUnlink={onRefresh} />
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: '/student/profile' })}
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
            >
              Connect Google
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function UnlinkGoogleButton({ onUnlink }: { onUnlink: () => Promise<void> }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    if (!confirm('Are you sure you want to unlink your Google account?')) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/unlink-google', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to unlink Google account')
        return
      }

      await onUnlink()
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded transition-colors border border-red-500/20"
    >
      {loading ? 'Unlinking...' : 'Unlink'}
    </button>
  )
}

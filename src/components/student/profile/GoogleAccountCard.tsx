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
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#18292c]">
        <Lock size={18} /> Account Security
      </h3>
      <div className="divide-y divide-[#dce8e4] rounded-xl border border-[#d6e2de] bg-white">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d2dfdb] bg-[#f5f8f7]">
              <span className="text-sm font-bold text-[#18292c]">G</span>
            </div>
            <div>
              <div className="font-medium text-[#18292c]">Google Account</div>
              <div className="text-sm text-[#5a7275]">{googleConnected ? 'Connected' : 'Not connected'}</div>
            </div>
          </div>

          {googleConnected ? (
            <UnlinkGoogleButton onUnlink={onRefresh} />
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: '/student/profile' })}
              className="rounded bg-teal-700 px-3 py-1.5 text-sm text-white transition-colors hover:bg-teal-600"
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
      className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
    >
      {loading ? 'Unlinking...' : 'Unlink'}
    </button>
  )
}

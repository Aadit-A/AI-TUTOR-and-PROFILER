'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Code, Loader2, User } from 'lucide-react'

type VerifiedUser = {
  username: string
}

type PlatformCardProps = {
  name: string
  apiUrl: string
  connected?: string
  color: string
  onConnect: (username: string) => void | Promise<void>
  onUnlink: () => void | Promise<void>
}

export default function PlatformCard({
  name,
  apiUrl,
  connected,
  color,
  onConnect,
  onUnlink,
}: PlatformCardProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlinking, setUnlinking] = useState(false)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState<VerifiedUser | null>(null)

  const verify = async () => {
    if (!username) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Verification failed')
      setVerified(data.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const confirmLink = async () => {
    if (!verified?.username) return
    setError('')
    try {
      await onConnect(verified.username)
      setVerified(null)
      setUsername('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to link account')
    }
  }

  const unlink = async () => {
    setUnlinking(true)
    setError('')
    try {
      await onUnlink()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to unlink account')
    } finally {
      setUnlinking(false)
    }
  }

  if (connected) {
    return (
      <div className="rounded-xl border border-[#d6e2de] bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code size={20} className={color} />
            <span className="font-medium text-[#18292c]">{name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={14} /> {connected}
            </div>
            <button
              onClick={unlink}
              disabled={unlinking}
              className="text-xs text-[#6f8587] transition-colors hover:text-red-600 disabled:opacity-50"
            >
              {unlinking ? 'Unlinking...' : 'Unlink'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-1 text-red-400 text-xs">
            <AlertCircle size={12} /> {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#d6e2de] bg-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <Code size={20} className={color} />
        <span className="font-bold text-[#18292c]">Connect {name}</span>
      </div>

      {!verified ? (
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder={`${name} Username`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-[#cfdcd8] bg-white px-4 py-2 text-sm text-[#18292c] outline-none focus:border-teal-600"
            />
            {error && (
              <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle size={12} /> {error}
              </div>
            )}
          </div>
          <button
            onClick={verify}
            disabled={loading || !username}
            className="rounded-lg bg-[#e7efec] px-4 py-2 text-sm font-medium text-[#233337] transition-colors hover:bg-[#dce9e4] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify'}
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[#d5e2de] bg-[#f7fbfa] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="font-bold text-[#18292c]">{verified.username}</span>
            </div>
            <CheckCircle className="text-green-600" size={16} />
          </div>
          <div className="flex gap-2">
            <button onClick={confirmLink} className="flex-1 rounded-lg bg-teal-700 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600">
              Link Account
            </button>
            <button onClick={() => setVerified(null)} className="rounded-lg border border-[#cddbd7] px-4 py-2 text-sm text-[#274245] hover:bg-[#ecf3f1]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

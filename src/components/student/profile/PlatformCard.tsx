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
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code size={20} className={color} />
            <span className="font-medium text-white">{name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={14} /> {connected}
            </div>
            <button
              onClick={unlink}
              disabled={unlinking}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
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
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <div className="flex items-center gap-3 mb-4">
        <Code size={20} className={color} />
        <span className="font-bold text-white">Connect {name}</span>
      </div>

      {!verified ? (
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder={`${name} Username`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:border-blue-500 outline-none"
            />
            {error && (
              <div className="mt-2 flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle size={12} /> {error}
              </div>
            )}
          </div>
          <button
            onClick={verify}
            disabled={loading || !username}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="font-bold">{verified.username}</span>
            </div>
            <CheckCircle className="text-green-500" size={16} />
          </div>
          <div className="flex gap-2">
            <button onClick={confirmLink} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium">
              Link Account
            </button>
            <button onClick={() => setVerified(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

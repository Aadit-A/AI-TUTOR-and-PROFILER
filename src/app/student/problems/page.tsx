'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import StudentSidebar from '@/components/student/StudentSidebar'

interface Problem {
  _id: string
  problemId: number
  title: string
  difficulty: string
  acceptanceRate?: number
  url?: string
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [predictedTags, setPredictedTags] = useState<string[]>([])

  const loadProblems = () => {
    const params = new URLSearchParams({ limit: '30', page: page.toString() })
    if (difficulty) params.set('difficulty', difficulty)

    setLoading(true)
    setError('')

    fetch(`/api/problems?${params}`)
      .then(r => r.json())
      .then(d => {
        setProblems(d.problems || [])
        setTotalPages(d.pagination?.totalPages || 1)
      })
      .catch(() => setError('Failed to load problems.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!query) {
      setPredictedTags([])
      loadProblems()
    }
  }, [difficulty, page, query])

  useEffect(() => {
    setPage(1)
  }, [difficulty])

  const handleSearch = async () => {
    if (!query.trim()) {
      setPredictedTags([])
      loadProblems()
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      
      if (data.success) {
        setPredictedTags(data.predictedTags || [])
        setProblems(data.problems || [])
        setTotalPages(1) // AI results are returned in one page
      } else {
        setError(data.error || 'Failed to get recommendations.')
      }
    } catch {
      setError('An error occurred during search.')
    } finally {
      setLoading(false)
    }
  }

  const diffColor = (d: string) => d === 'Easy' ? 'text-green-600' : d === 'Hard' ? 'text-rose-600' : 'text-amber-600'

  return (
    <div className="flex h-screen bg-[#f3f6f4] text-[#233337]">
      <StudentSidebar active="problems" />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="mb-4 text-2xl font-bold text-[#18292c]">LeetCode Problems</h1>
        <div className="mb-4 flex gap-3">
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search problems or ask AI for recommendations..." 
            className="flex-1 rounded border border-[#cfdcd8] bg-white px-3 py-2 text-[#18292c] outline-none focus:border-teal-600" 
          />
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="rounded bg-teal-700 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
          >
            Search
          </button>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="rounded border border-[#cfdcd8] bg-white px-3 py-2 text-[#18292c] outline-none focus:border-teal-600">
            <option value="">All</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
          </select>
        </div>
        
        {predictedTags.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[#5a7275]">AI Suggested Topics:</span>
            {predictedTags.map(tag => (
              <span key={tag} className="rounded-full bg-[#edf3f1] px-2 py-0.5 text-xs text-[#597173]">{tag}</span>
            ))}
          </div>
        )}

        {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
        {loading && <p className="mb-3 text-sm text-[#5a7275]">Loading problems...</p>}
        <div className="space-y-2">
          {problems.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.28, delay: (i % 12) * 0.02 }} className="flex items-center gap-4 rounded border border-[#d8e3df] bg-white p-3 transition-colors hover:bg-[#f1f6f4]">
              <span className="w-12 text-[#768b8d]">{p.problemId}</span>
              <Link href={`/student/practice?problem=${p.problemId}`} className="flex-1 text-[#18292c] hover:text-teal-700">{p.title}</Link>
              <span className={`text-sm ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
              <span className="w-16 text-sm text-[#5a7275]">{typeof p.acceptanceRate === 'number' ? `${p.acceptanceRate.toFixed(0)}%` : '-'}</span>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-700">↗</a>
              ) : (
                <span className="w-3 text-center text-sm text-[#a6b5b2]">-</span>
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded border border-[#cedbd7] bg-white px-4 py-2 text-[#274245] disabled:opacity-50">← Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded border border-[#cedbd7] bg-white px-4 py-2 text-[#274245] disabled:opacity-50">Next →</button>
        </div>
      </div>
    </div>
  )
}

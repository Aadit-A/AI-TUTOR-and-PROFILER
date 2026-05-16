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

type SearchMode = 'default' | 'ai'

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchMode, setSearchMode] = useState<SearchMode>('default')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiTags, setAiTags] = useState<string[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (searchMode !== 'default') return

    const params = new URLSearchParams({ limit: '30', page: page.toString() })
    if (search) params.set('search', search)
    if (difficulty) params.set('difficulty', difficulty)

    setListLoading(true)
    setError('')

    fetch(`/api/problems?${params}`)
      .then(r => r.json())
      .then(d => {
        setProblems(d.problems || [])
        setTotalPages(d.pagination?.totalPages || 1)
      })
      .catch(() => setError('Failed to load problems.'))
      .finally(() => setListLoading(false))
  }, [search, difficulty, page, searchMode])

  useEffect(() => {
    if (searchMode === 'default') {
      setPage(1)
    }
  }, [search, difficulty, searchMode])

  const runAiSearch = async () => {
    const query = aiPrompt.trim()
    if (!query) return

    setAiLoading(true)
    setError('')

    try {
      const response = await fetch('/api/tag-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 30 })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to run AI search.')
      }

      const nextTags = Array.isArray(data.tags)
        ? data.tags.filter((tag: unknown): tag is string => typeof tag === 'string')
        : []

      setSearchMode('ai')
      setProblems(Array.isArray(data.questions) ? data.questions : [])
      setAiTags(nextTags)
      setTotalPages(1)
      setPage(1)
    } catch (searchError) {
      setSearchMode('ai')
      setProblems([])
      setAiTags([])
      setTotalPages(1)
      setPage(1)
      setError(searchError instanceof Error ? searchError.message : 'Failed to run AI search.')
    } finally {
      setAiLoading(false)
    }
  }

  const resetToDefaultMode = () => {
    setSearchMode('default')
    setAiTags([])
    setError('')
    setPage(1)
  }

  const diffColor = (d: string) => d === 'Easy' ? 'text-green-600' : d === 'Hard' ? 'text-rose-600' : 'text-amber-600'

  return (
    <div className="flex h-screen bg-[#f3f6f4] text-[#233337]">
      <StudentSidebar active="problems" />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="mb-4 text-2xl font-bold text-[#18292c]">LeetCode Problems</h1>
        <div className="mb-4 flex gap-3">
          <input value={search} onChange={e => { setSearch(e.target.value); setSearchMode('default') }} placeholder="Search..." className="flex-1 rounded border border-[#cfdcd8] bg-white px-3 py-2 text-[#18292c] outline-none focus:border-teal-600" />
          <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setSearchMode('default') }} className="rounded border border-[#cfdcd8] bg-white px-3 py-2 text-[#18292c] outline-none focus:border-teal-600">
            <option value="">All</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
          </select>
        </div>
        <div className="mb-4 rounded border border-[#d8e3df] bg-white p-3">
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Try: easy graph questions"
              className="flex-1 rounded border border-[#cfdcd8] bg-white px-3 py-2 text-[#18292c] outline-none focus:border-teal-600"
            />
            <button
              onClick={runAiSearch}
              disabled={!aiPrompt.trim() || aiLoading}
              className="rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
            >
              {aiLoading ? 'Finding...' : 'Find with AI'}
            </button>
            {searchMode === 'ai' && (
              <button
                onClick={resetToDefaultMode}
                className="rounded border border-[#cfdcd8] bg-white px-4 py-2 text-sm font-medium text-[#274245] transition-colors hover:bg-[#f1f6f4]"
              >
                Back to filters
              </button>
            )}
          </div>
          {searchMode === 'ai' && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-[#2f474a]">Predicted tags:</span>
              {aiTags.length > 0 ? (
                aiTags.map(tag => (
                  <span key={tag} className="rounded-full bg-[#edf3f1] px-2 py-0.5 text-xs text-[#597173]">{tag}</span>
                ))
              ) : (
                <span className="text-[#728688]">No tags detected</span>
              )}
            </div>
          )}
        </div>
        {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
        {listLoading && searchMode === 'default' && <p className="mb-3 text-sm text-[#5a7275]">Loading problems...</p>}
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
        {searchMode === 'default' && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded border border-[#cedbd7] bg-white px-4 py-2 text-[#274245] disabled:opacity-50">← Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded border border-[#cedbd7] bg-white px-4 py-2 text-[#274245] disabled:opacity-50">Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}

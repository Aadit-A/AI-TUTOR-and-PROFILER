'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Editor from '@monaco-editor/react'
import Link from 'next/link'
import { Send, Play, Zap, Bot, ExternalLink, ArrowLeft, Loader2, List } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import StudentSidebar from '@/components/student/StudentSidebar'

interface Problem {
  problemId: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  url: string
  acceptanceRate: number
  companies: string[]
  relatedTopics: string[]
  starterCode?: Record<string, string>
}

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-50 text-green-700',
  Medium: 'bg-amber-50 text-amber-700',
  Hard: 'bg-rose-50 text-rose-700',
}

const CPP_TEMPLATE = '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}'

function PracticeLabContent() {
  const searchParams = useSearchParams()
  const problemId = searchParams.get('problem')
  
  const [problem, setProblem] = useState<Problem | null>(null)
  const [problemLoading, setProblemLoading] = useState(false)
  const [code, setCode] = useState(CPP_TEMPLATE)
  const [output, setOutput] = useState('')
  const [chat, setChat] = useState<{role: 'user' | 'ai', text: string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (problemId) {
      setProblemLoading(true)
      fetch(`/api/problems/${problemId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setProblem(data)
            if (data.starterCode?.cpp) {
              setCode(data.starterCode.cpp)
            }
          }
        })
        .catch(console.error)
        .finally(() => setProblemLoading(false))
    }
  }, [problemId])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat])

  const runCode = async () => {
    setLoading(true); setOutput('Compiling...')
    try {
      const res = await fetch('/api/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
      const data = await res.json()
      setOutput(data.output || data.error || 'No output')
    } catch { setOutput('Execution failed') }
    setLoading(false)
  }

  const askAI = async () => {
    if (!chatInput.trim()) return
    const msg = chatInput; setChatInput(''); setChat(p => [...p, { role: 'user', text: msg }]); setAiLoading(true)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)
    try {
      const res = await fetch('/api/ai-tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: msg, code }), signal: controller.signal })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      const reply = typeof data?.message === 'string' && data.message.trim() ? data.message : 'No response from AI'
      setChat(p => [...p, { role: 'ai', text: reply }])
    } catch (error) {
      const text = error instanceof Error && error.name === 'AbortError' ? 'AI request timed out. Try again.' : 'Failed to connect'
      setChat(p => [...p, { role: 'ai', text }])
    } finally {
      clearTimeout(timeoutId)
      setAiLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#f3f6f4] text-[#233337]">
      <StudentSidebar active="practice" />

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-[#d7e2de] bg-[#f6faf8] p-3">
          <div className="flex items-center gap-3">
            {problem && (
              <Link href="/student/problems" className="rounded-lg p-2 text-[#5a7275] hover:bg-[#e7efec]">
                <ArrowLeft size={16} />
              </Link>
            )}
            <h2 className="font-bold text-[#18292c]">
              {problem ? `${problem.problemId}. ${problem.title}` : 'Practice Lab'}
            </h2>
            {problem && (
              <>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
                {problem.url && (
                  <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-[#5a7275] hover:text-teal-700">
                    <ExternalLink size={14} />
                  </a>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/student/problems" className="flex items-center gap-2 px-3 py-2 text-sm text-[#5a7275] hover:text-[#18292c]">
              <List size={14} /> Problems
            </Link>
            <span className="rounded-lg border border-[#cedbd7] bg-white px-3 py-2 text-sm font-medium text-[#334b4e]">C++</span>
            <button onClick={runCode} disabled={loading} className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:opacity-50">
              <Play size={14} /> {loading ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
        <div className="flex-1 flex">
          {/* Problem Description Panel */}
          {problem && (
            <div className="flex w-96 flex-col overflow-hidden border-r border-[#d7e2de] bg-white">
              <div className="border-b border-[#e1ebe8] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#5a7275]">Acceptance: {problem.acceptanceRate?.toFixed(1)}%</span>
                </div>
                {problem.relatedTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {problem.relatedTopics.map(topic => (
                      <span key={topic} className="rounded-full bg-[#edf3f1] px-2 py-0.5 text-xs text-[#597173]">{topic}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="prose prose-sm max-w-none prose-headings:text-[#18292c] prose-p:text-[#314649]">
                  <div className="text-sm whitespace-pre-wrap">{problem.description}</div>
                </div>
              </div>
              {problem.companies.length > 0 && (
                <div className="border-t border-[#e1ebe8] p-4">
                  <div className="mb-2 text-xs text-[#728688]">Companies</div>
                  <div className="flex flex-wrap gap-1">
                    {problem.companies.slice(0, 10).map(company => (
                      <span key={company} className="rounded bg-teal-50 px-2 py-0.5 text-xs text-teal-700">{company}</span>
                    ))}
                    {problem.companies.length > 10 && (
                      <span className="px-2 py-0.5 text-xs text-[#728688]">+{problem.companies.length - 10} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {problemLoading && (
            <div className="flex w-96 items-center justify-center border-r border-[#d7e2de] bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-teal-700" />
            </div>
          )}
          <div className="flex-1 flex flex-col">
            <Editor height="60%" language="cpp" theme="vs-dark" value={code} onChange={(v) => setCode(v || '')} options={{ minimap: { enabled: false }, fontSize: 14 }} />
            <div className="h-[40%] overflow-auto border-t border-[#d7e2de] bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-teal-700"><Zap size={14} /> Output</div>
              <pre className="text-sm font-mono whitespace-pre-wrap">{output || 'Run your code to see output'}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <div className="flex w-80 flex-col border-l border-[#d7e2de] bg-white">
        <div className="flex items-center gap-2 border-b border-[#e1ebe8] p-4">
          <Bot size={18} className="text-teal-700" /><span className="font-bold text-[#18292c]">AI Tutor</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.length === 0 && <p className="mt-8 text-center text-sm text-[#728688]">Ask me anything about your code!</p>}
          {chat.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100"><Bot size={12} className="text-teal-700" /></div>}
              <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.role === 'user' ? 'bg-teal-700 text-white' : 'border border-[#d6e2de] bg-[#f5f9f8] text-[#233337]'}`}>
                {m.role === 'ai' ? (
                  <ReactMarkdown
                    components={{
                      code: ({ children, className }) => {
                        const isBlock = className?.includes('language-')
                        return isBlock ? (
                          <pre className="my-2 overflow-x-auto rounded-md bg-[#eaf2ef] p-3"><code className="text-xs font-mono text-teal-800">{children}</code></pre>
                        ) : (
                          <code className="rounded bg-[#eaf2ef] px-1.5 py-0.5 text-xs font-mono text-teal-800">{children}</code>
                        )
                      },
                      pre: ({ children }) => <>{children}</>,
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      h1: ({ children }) => <h1 className="text-base font-bold mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                      strong: ({ children }) => <strong className="font-semibold text-[#18292c]">{children}</strong>,
                    }}
                  >{m.text}</ReactMarkdown>
                ) : m.text}
              </div>
            </div>
          ))}
          {aiLoading && <div className="flex gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100"><Bot size={12} className="text-teal-700" /></div><div className="rounded-lg border border-[#d6e2de] bg-[#f5f9f8] p-3 text-sm text-[#233337]">Thinking...</div></div>}
          <div ref={chatEndRef} />
        </div>
        <div className="border-t border-[#e1ebe8] p-4">
          <div className="flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && askAI()} placeholder="Ask a question..." className="flex-1 rounded-lg border border-[#cfdcd8] bg-white px-3 py-2 text-sm text-[#18292c] outline-none focus:border-teal-600" />
            <button onClick={askAI} disabled={aiLoading} className="rounded-lg bg-teal-700 p-2 text-white transition-colors hover:bg-teal-600 disabled:opacity-50"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PracticeLab() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#f3f6f4] text-[#18292c]"><Loader2 className="animate-spin" /></div>}>
      <PracticeLabContent />
    </Suspense>
  )
}

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
  Easy: 'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard: 'text-red-400 bg-red-400/10',
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
    <div className="flex h-screen bg-slate-950 text-slate-300">
      <StudentSidebar active="practice" />

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {problem && (
              <Link href="/student/problems" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                <ArrowLeft size={16} />
              </Link>
            )}
            <h2 className="font-bold text-white">
              {problem ? `${problem.problemId}. ${problem.title}` : 'Practice Lab'}
            </h2>
            {problem && (
              <>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
                {problem.url && (
                  <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400">
                    <ExternalLink size={14} />
                  </a>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/student/problems" className="px-3 py-2 text-sm text-slate-400 hover:text-white flex items-center gap-2">
              <List size={14} /> Problems
            </Link>
            <span className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200">C++</span>
            <button onClick={runCode} disabled={loading} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
              <Play size={14} /> {loading ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
        <div className="flex-1 flex">
          {/* Problem Description Panel */}
          {problem && (
            <div className="w-96 border-r border-slate-800 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Acceptance: {problem.acceptanceRate?.toFixed(1)}%</span>
                </div>
                {problem.relatedTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {problem.relatedTopics.map(topic => (
                      <span key={topic} className="px-2 py-0.5 text-xs bg-slate-800 rounded-full text-slate-400">{topic}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-sm whitespace-pre-wrap">{problem.description}</div>
                </div>
              </div>
              {problem.companies.length > 0 && (
                <div className="p-4 border-t border-slate-800">
                  <div className="text-xs text-slate-500 mb-2">Companies</div>
                  <div className="flex flex-wrap gap-1">
                    {problem.companies.slice(0, 10).map(company => (
                      <span key={company} className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 rounded">{company}</span>
                    ))}
                    {problem.companies.length > 10 && (
                      <span className="px-2 py-0.5 text-xs text-slate-500">+{problem.companies.length - 10} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {problemLoading && (
            <div className="w-96 border-r border-slate-800 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          )}
          <div className="flex-1 flex flex-col">
            <Editor height="60%" language="cpp" theme="vs-dark" value={code} onChange={(v) => setCode(v || '')} options={{ minimap: { enabled: false }, fontSize: 14 }} />
            <div className="h-[40%] bg-slate-900 border-t border-slate-800 p-4 overflow-auto">
              <div className="flex items-center gap-2 text-green-400 text-sm mb-2"><Zap size={14} /> Output</div>
              <pre className="text-sm font-mono whitespace-pre-wrap">{output || 'Run your code to see output'}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <div className="w-80 border-l border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <Bot size={18} className="text-blue-400" /><span className="font-bold text-white">AI Tutor</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.length === 0 && <p className="text-slate-500 text-sm text-center mt-8">Ask me anything about your code!</p>}
          {chat.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><Bot size={12} className="text-blue-400" /></div>}
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>
                {m.role === 'ai' ? (
                  <ReactMarkdown
                    components={{
                      code: ({ children, className }) => {
                        const isBlock = className?.includes('language-')
                        return isBlock ? (
                          <pre className="bg-slate-900 rounded-md p-3 my-2 overflow-x-auto"><code className="text-xs font-mono text-green-400">{children}</code></pre>
                        ) : (
                          <code className="bg-slate-900 px-1.5 py-0.5 rounded text-xs font-mono text-green-400">{children}</code>
                        )
                      },
                      pre: ({ children }) => <>{children}</>,
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      h1: ({ children }) => <h1 className="text-base font-bold mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    }}
                  >{m.text}</ReactMarkdown>
                ) : m.text}
              </div>
            </div>
          ))}
          {aiLoading && <div className="flex gap-2"><div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><Bot size={12} className="text-blue-400" /></div><div className="bg-slate-800 p-3 rounded-lg text-sm">Thinking...</div></div>}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-slate-800">
          <div className="flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && askAI()} placeholder="Ask a question..." className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
            <button onClick={askAI} disabled={aiLoading} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PracticeLab() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin" /></div>}>
      <PracticeLabContent />
    </Suspense>
  )
}

'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Loader2, Award, Zap, Activity, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StudentSidebar from '@/components/student/StudentSidebar'

interface AnalysisResult {
  name: string;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendedTopics: string[];
  atsScore: number;
  summary: string;
}

export default function ResumeAnalyzerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.')
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setAnalysis(null)

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await fetch('/api/resume-analyzer', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume')
      }

      setAnalysis(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#f3f6f4] text-[#233337]">
      <StudentSidebar active="resume" />

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-[#18292c]">AI Resume Analyzer</h1>
        <p className="mb-8 text-[#5a7275]">Upload your resume to get an AI-powered analysis and interview recommendations.</p>

        <div className="mx-auto max-w-4xl">
          {/* Upload Section */}
          <div className="mb-8 rounded-xl border border-[#d6e2de] bg-white p-6 md:p-10">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-700 ${file ? 'bg-green-50 text-green-700' : ''}`}>
                {file ? <FileText size={40} /> : <Upload size={40} />}
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-[#18292c]">
                  {file ? file.name : 'Upload your resume (PDF)'}
                </p>
                <p className="text-sm text-[#5a7275]">Maximum size: 5MB</p>
              </div>

              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              
              <div className="flex gap-4">
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer rounded-lg border border-[#d6e2de] bg-[#f8faf9] px-6 py-2 text-sm font-medium text-[#18292c] transition-colors hover:bg-[#eef2f1]"
                >
                  {file ? 'Change File' : 'Select PDF'}
                </label>
                
                {file && (
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex items-center rounded-lg bg-teal-700 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={16} />
                        Analyzing...
                      </>
                    ) : (
                      'Start Analysis'
                    )}
                  </button>
                )}
              </div>

              {error && (
                <div className="flex items-center text-sm text-rose-600">
                  <AlertCircle size={16} className="mr-1" />
                  {error}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 pb-12"
              >
                {/* Header Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-4 rounded-xl border border-[#d6e2de] bg-white p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                      <Zap size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-[#5a7275]">ATS Score</p>
                      <p className="text-2xl font-bold text-[#18292c]">{analysis.atsScore}/100</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-xl border border-[#d6e2de] bg-white p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-[#5a7275]">Candidate Name</p>
                      <p className="text-2xl font-bold text-[#18292c]">{analysis.name || 'Extracted'}</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-[#d6e2de] bg-white p-6">
                  <h3 className="mb-4 flex items-center font-bold text-[#18292c]">
                    <FileText size={18} className="mr-2 text-teal-700" />
                    Professional Summary
                  </h3>
                  <p className="text-[#5a7275] leading-relaxed italic">
                    "{analysis.summary}"
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Skills */}
                  <div className="rounded-xl border border-[#d6e2de] bg-white p-6">
                    <h3 className="mb-4 font-bold text-[#18292c]">Detected Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.map((skill, i) => (
                        <span key={i} className="rounded-full bg-[#f0f4f2] px-3 py-1 text-xs font-medium text-[#4a5f62]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="rounded-xl border border-[#d6e2de] bg-white p-6">
                    <h3 className="mb-4 font-bold text-[#18292c]">Suggested to Add</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map((skill, i) => (
                        <span key={i} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 border border-rose-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Strengths */}
                  <div className="rounded-xl border border-[#d1e7dd] bg-[#fafffd] p-6">
                    <h3 className="mb-4 flex items-center font-bold text-[#18292c]">
                      <CheckCircle2 size={18} className="mr-2 text-green-600" />
                      Key Strengths
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-sm text-[#5a7275]">
                      {analysis.strengths.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="rounded-xl border border-[#f8d7da] bg-[#fffcfc] p-6">
                    <h3 className="mb-4 flex items-center font-bold text-[#18292c]">
                      <AlertCircle size={18} className="mr-2 text-rose-600" />
                      Areas for Improvement
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-sm text-[#5a7275]">
                      {analysis.weaknesses.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="rounded-xl border border-[#d6e2de] bg-white p-6">
                  <h3 className="mb-4 flex items-center font-bold text-[#18292c]">
                    <Award size={18} className="mr-2 text-teal-700" />
                    Recommended Preparation Topics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.recommendedTopics.map((topic, i) => (
                      <div key={i} className="flex items-center p-3 rounded-lg border border-[#e2ece9] bg-[#f8faf9] text-sm text-[#5a7275]">
                        <Zap size={14} className="mr-2 text-teal-600" />
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

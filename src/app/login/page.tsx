'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Brain, Lock, Mail, Chrome, Loader2 } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [role, setRole] = useState<'student' | 'company'>('student')
  const [loading, setLoading] = useState(false)

  const handleGoogle = () => { setLoading(true); signIn('google', { callbackUrl: '/student/profile' }) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const result = await signIn('credentials', { redirect: false, email: form.email.value, password: form.password.value, role })
    setLoading(false)
    if (result?.error) alert('Sign in failed')
    else router.push(role === 'student' ? '/student/dashboard' : '/company/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="relative z-10 max-w-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-8"><Brain size={32} className="text-white" /></div>
          <h2 className="text-4xl font-bold text-white mb-6">Welcome Back</h2>
          <p className="text-slate-400 text-lg">Practice coding with AI-powered guidance and track your progress.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="text-sm text-gray-500 mt-2">Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:text-blue-500">Sign up</Link></p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button onClick={() => setRole('student')} className={`flex-1 py-2 text-sm font-medium rounded-md ${role === 'student' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Student</button>
            <button onClick={() => setRole('company')} className={`flex-1 py-2 text-sm font-medium rounded-md ${role === 'company' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Company</button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input name="email" type="email" required placeholder="you@example.com" className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input name="password" type="password" required placeholder="••••••••" className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center"><div className="flex-1 border-t border-gray-200" /><span className="px-4 text-sm text-gray-500">or</span><div className="flex-1 border-t border-gray-200" /></div>

          <button onClick={handleGoogle} disabled={loading} className="w-full py-3 border border-gray-300 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50">
            <Chrome size={20} /> Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}

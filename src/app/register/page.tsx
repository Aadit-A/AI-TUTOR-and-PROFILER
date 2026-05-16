'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Brain, Lock, Mail, User, Chrome, Loader2 } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const result = await signIn('credentials', { redirect: false, email: form.email.value, password: form.password.value, role: 'student' })
    setLoading(false)
    if (result?.error) alert('Registration failed')
    else router.push('/student/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-[#f3f6f4] text-[#18292c]">
      {/* Right - Branding */}
      <div className="relative order-2 hidden w-1/2 items-center justify-center bg-[#18292c] p-12 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-teal-500/20" />
        <div className="relative z-10 max-w-lg text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600"><Brain size={32} className="text-white" /></div>
          <h2 className="text-4xl font-bold text-white mb-6">Join the Future</h2>
          <p className="text-lg text-[#b9cecd]">Start your journey to becoming a better programmer today.</p>
        </div>
      </div>

      {/* Left - Form */}
      <div className="order-1 flex w-full items-center justify-center bg-[#edf3f0] p-8 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-[#d6e2de] bg-white p-10 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#18292c]">Create your account</h2>
            <p className="mt-2 text-sm text-[#5a7275]">Already have an account? <Link href="/login" className="text-teal-700 hover:text-teal-600">Sign in</Link></p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#314649]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6f8587]" />
                <input name="name" type="text" required placeholder="John Doe" className="w-full rounded-lg border border-[#cfdcd8] px-3 py-2.5 pl-10 text-[#18292c] outline-none focus:border-teal-600" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#314649]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6f8587]" />
                <input name="email" type="email" required placeholder="you@example.com" className="w-full rounded-lg border border-[#cfdcd8] px-3 py-2.5 pl-10 text-[#18292c] outline-none focus:border-teal-600" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#314649]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6f8587]" />
                <input name="password" type="password" required placeholder="••••••••" className="w-full rounded-lg border border-[#cfdcd8] px-3 py-2.5 pl-10 text-[#18292c] outline-none focus:border-teal-600" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 py-3 font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
            </button>
          </form>

          <div className="my-6 flex items-center"><div className="flex-1 border-t border-[#d6e2de]" /><span className="px-4 text-sm text-[#5a7275]">or</span><div className="flex-1 border-t border-[#d6e2de]" /></div>

          <button onClick={() => signIn('google', { callbackUrl: '/student/profile' })} className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#cfdcd8] py-3 font-medium transition-colors hover:bg-[#edf3f0]">
            <Chrome size={20} /> Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}

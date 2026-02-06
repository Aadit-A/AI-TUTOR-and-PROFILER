'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { Brain, Lock, Mail, Github, Chrome, Loader2 } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [role, setRole] = useState<'student' | 'company'>('student')
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/student/profile' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Get form data
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      role
    });

    setLoading(false);

    if (result?.error) {
       alert("Sign in failed. For this demo, use any email/password.");
    } else {
       if (role === 'student') {
          router.push('/student/dashboard');
       } else {
          router.push('/company/dashboard');
       }
    }
  }

  const EmailForm = () => (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={role === 'student' ? "student@example.com" : "recruiter@company.com"}
            className="pl-10 block w-full border-gray-300 rounded-lg border px-3 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="pl-10 block w-full border-gray-300 rounded-lg border px-3 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Hero/Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-lg text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
              <Brain size={32} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Welcome Back to AI Tutor</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              &quot;The only way to do great work is to love what you do. If you haven&apos;t found it yet, keep looking. Don&apos;t settle.&quot;
            </p>
            <p className="mt-4 text-slate-500 font-medium">- Steve Jobs</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="text-sm text-gray-500 mt-2">
              Don&apos;t have an account? <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">Sign up for free</Link>
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'student' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('company')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'company' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Company
            </button>
          </div>

          {role === 'student' ? (
             <div className="space-y-6 py-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm">
                   <div className="flex gap-3 mb-2">
                      <div className="shrink-0 text-blue-600 mt-0.5"><Brain size={18}/></div>
                      <h3 className="font-semibold text-blue-900 text-sm">Student Access</h3>
                   </div>
                   <p className="text-blue-800 text-sm leading-relaxed pl-8">
                      Sign in with Google to access your dashboard. You will need to verify your LeetCode account on the next step.
                   </p>
                </div>
                
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                   {loading ? <Loader2 className="animate-spin text-gray-400" size={20} /> : <Chrome size={20} className="text-gray-900" />}
                   <span className="text-gray-600">Continue with Google</span>
                </button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
                  </div>
                </div>

                <EmailForm />
                
                <div className="text-center text-xs text-gray-400 mt-4">
                   Secured by NextAuth.js
                </div>
             </div>
          ) : (
            <EmailForm />
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Brain, Lock, Mail, User, Building, Github, Chrome } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [role, setRole] = useState<'student' | 'company'>('student')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Navigate to respective dashboard or role selection
       if (role === 'student') {
        router.push('/student/dashboard')
       } else {
        router.push('/company/dashboard')
       }
    }, 1500)
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Right Panel - Hero/Branding (Swapped for variety) */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12 order-2">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-lg text-center">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20">
              <Brain size={32} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Join the Future of Hiring</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              &quot;We don&apos;t need accurate code. We need accurate thinking. Join the platform that values your potential over your syntax.&quot;
            </p>
        </div>
      </div>

      {/* Left Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 order-1">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
           <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500 mt-2">
              Already have an account? <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {role === 'student' ? 'Full Name' : 'Company Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {role === 'student' ? <User className="h-5 w-5 text-gray-400" /> : <Building className="h-5 w-5 text-gray-400" />}
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={role === 'student' ? "John Doe" : "Acme Corp"}
                  className="pl-10 block w-full border-gray-300 rounded-lg border px-3 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="pl-10 block w-full border-gray-300 rounded-lg border px-3 py-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
              </div>
               <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div className="flex items-start">
               <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a></label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

            <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                 <Github className="w-5 h-5" />
                 <span className="sr-only">Sign up with GitHub</span>
              </button>
              <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                 <Chrome className="w-5 h-5 text-red-500" />
                 <span className="sr-only">Sign up with Google</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

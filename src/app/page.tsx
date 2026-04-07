'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Code, Zap, Shield, Users, Briefcase, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><Brain size={18} /></div>
            AI Tutor
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#companies" className="hover:text-white">For Companies</a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white">Log in</Link>
            <Link href="/login"><button className="px-4 py-2 bg-white text-slate-950 rounded-lg text-sm font-semibold hover:bg-slate-200">Get Started</button></Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 relative">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm mb-8">
            <Sparkles size={14} className="text-yellow-400" /> AI-Powered Learning Platform
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master DSA with<br /><span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI-Powered Guidance</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Practice coding, get instant AI feedback, and track your progress on LeetCode.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login"><button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90">Start Learning <ArrowRight size={18} /></button></Link>
            <Link href="#features"><button className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-xl font-semibold hover:bg-slate-800">See Features</button></Link>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to <span className="text-blue-400">Excel</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive tools designed to accelerate your coding journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Code, title: 'Built-in IDE', desc: 'Write, compile, and test code with our powerful integrated editor' },
              { icon: Zap, title: 'AI Tutor Chat', desc: 'Get instant help and explanations from our AI assistant' },
              { icon: Shield, title: 'Platform Sync', desc: 'Connect your LeetCode account' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6"><f.icon className="text-blue-400" size={24} /></div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section id="companies" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm mb-6"><Briefcase size={14} /> For Recruiters</div>
              <h2 className="text-4xl font-bold mb-6">Find Verified Talent</h2>
              <p className="text-slate-400 mb-8">Access candidates with verified coding profiles and AI-analyzed skill assessments.</p>
              <Link href="/login"><button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold flex items-center gap-2">Company Login <ArrowRight size={16} /></button></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ icon: Users, label: '10K+ Students' }, { icon: Code, label: '50K+ Problems' }, { icon: Briefcase, label: '500+ Companies' }, { icon: Zap, label: 'Real-time Stats' }].map((s, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                  <s.icon className="mx-auto mb-3 text-purple-400" size={24} />
                  <div className="font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold"><div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><Brain size={12} /></div>AI Tutor</div>
          <p className="text-slate-500 text-sm">© 2024 AI Tutor. Built for learners.</p>
        </div>
      </footer>
    </div>
  )
}

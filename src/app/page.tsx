'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Code, Zap, Shield, Users, Briefcase, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f3f6f4] text-[#18292c]">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-[#dbe5e2] bg-[#f3f6f4]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-cyan-600 text-white"><Brain size={18} /></div>
            AI Tutor
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden items-center gap-8 text-sm text-[#5a7275] md:flex">
            <a href="#features" className="transition-colors hover:text-[#18292c]">Features</a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#4f686b] transition-colors hover:text-[#18292c]">Log in</Link>
            <Link href="/login"><button className="rounded-lg bg-[#18292c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#24393d]">Get Started</button></Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden pb-20 pt-32">
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 9, repeat: Infinity }} className="absolute left-14 top-16 h-72 w-72 rounded-full bg-teal-500/15 blur-[100px]" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.16, 0.08] }} transition={{ duration: 11, repeat: Infinity }} className="absolute bottom-12 right-16 h-96 w-96 rounded-full bg-cyan-500/10 blur-[110px]" />
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d6e2de] bg-white/90 px-3 py-1 text-sm text-[#5a7275]">
            <Sparkles size={14} className="text-teal-600" /> AI-Powered Learning Platform
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Master DSA with<br /><span className="bg-gradient-to-r from-[#1f373a] via-[#1b5455] to-[#0f766e] bg-clip-text text-transparent">AI-Powered Guidance</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-10 max-w-2xl text-xl text-[#5a7275]">
            Practice coding, get instant AI feedback, and track your progress on LeetCode.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center gap-4 sm:flex-row">
            <Link href="/login"><button className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-8 py-4 font-semibold text-white transition-colors hover:bg-teal-600">Start Learning <ArrowRight size={18} /></button></Link>
            <Link href="#features"><button className="rounded-xl border border-[#cfdbd7] bg-white px-8 py-4 font-semibold text-[#1b2f32] transition-colors hover:bg-[#ecf2f0]">See Features</button></Link>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.35 }} className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Everything You Need to <span className="text-teal-700">Excel</span></h2>
            <p className="mx-auto max-w-2xl text-[#5a7275]">Comprehensive tools designed to accelerate your coding journey</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Code, title: 'Built-in IDE', desc: 'Write, compile, and test code with our powerful integrated editor' },
              { icon: Zap, title: 'AI Tutor Chat', desc: 'Get instant help and explanations from our AI assistant' },
              { icon: Shield, title: 'Platform Sync', desc: 'Connect your LeetCode account' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.35, delay: i * 0.08 }} className="rounded-2xl border border-[#d6e2df] bg-white/90 p-8 transition hover:-translate-y-0.5 hover:border-teal-500/40">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10"><f.icon className="text-teal-700" size={24} /></div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-[#5a7275]">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d7e2de] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold"><div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-teal-600 to-cyan-600 text-white"><Brain size={12} /></div>AI Tutor</div>
          <p className="text-sm text-[#708587]">© 2024 AI Tutor. Built for learners.</p>
        </div>
      </footer>
    </div>
  )
}

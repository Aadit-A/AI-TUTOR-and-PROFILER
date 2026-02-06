'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain,
  Terminal,
  Code,
  Zap,
  ChevronRight,
  Shield,
  Globe,
  Ghost,
  Sparkles,
  Bug,
  Coffee,
  Briefcase,
  Users,
  Search,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [fixed, setFixed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <span>AI Tutor</span>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400"
          >
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#companies" className="hover:text-white transition-colors">For Companies</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/login">
              <button className="px-4 py-2 bg-white text-slate-950 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                Get Started
              </button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]"
          />
          <motion.div 
             animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm font-medium mb-8 hover:border-slate-700 transition-colors cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v2.0 Now Available for Students
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight"
          >
            Master the Code.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">Own Your Future.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Your personal AI mentor that doesn&apos;t just fix bugs—it teaches you how to crush them. 
            Level up your skills, track your cognitive growth, and have fun doing it.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
              >
                <Terminal className="w-5 h-5" /> Start Coding Now
              </motion.button>
            </Link>
          </motion.div>

          {/* Fun Interactive Element: The Bug Squasher */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 max-w-2xl mx-auto"
          >
             <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-950 border-b border-slate-800">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                   <div className="text-xs text-slate-500 ml-2 font-mono">bug_squasher.py</div>
                </div>
                <div className="p-6 text-left font-mono text-sm relative min-h-[160px] flex flex-col justify-center">
                   <AnimatePresence mode='wait'>
                    {!fixed ? (
                      <motion.div 
                        key="buggy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-slate-300 space-y-2"
                      >
                         <div className="text-red-400">def calculate_total(prices):</div>
                         <div>&nbsp;&nbsp;total = 0</div>
                         <div className="flex items-center gap-2">
                           <span>&nbsp;&nbsp;for price in prices</span>
                           {/* The Bug */}
                           <motion.button
                             animate={{ x: [0, 5, -5, 0], rotate: [0, 10, -10, 0] }}
                             transition={{ repeat: Infinity, duration: 2 }}
                             onClick={() => setFixed(true)}
                             className="bg-red-500/20 text-red-400 p-1 rounded hover:bg-red-500 hover:text-white transition-colors cursor-pointer border border-red-500/50"
                           >
                              <Bug size={14} />
                           </motion.button>
                           <span className="text-slate-500 text-xs font-sans ml-2">&lt;- Click the bug!</span>
                         </div>
                         <div className="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;# Missing colon and indentation error!</div>
                         <div>&nbsp;&nbsp;return total</div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="fixed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-slate-300 space-y-2 relative"
                      >
                         <motion.div 
                           initial={{ scale: 0 }} 
                           animate={{ scale: [1.5, 0] }} 
                           className="absolute -top-4 left-1/2 text-yellow-400"
                         >
                            <Sparkles size={40} />
                         </motion.div>
                         <div className="text-blue-400">def calculate_total(prices):</div>
                         <div>&nbsp;&nbsp;total = 0</div>
                         <div className="text-green-400">&nbsp;&nbsp;for price in prices:</div>
                         <div className="text-green-400">&nbsp;&nbsp;&nbsp;&nbsp;total += price</div>
                         <div>&nbsp;&nbsp;return total</div>
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.5 }}
                           className="mt-4 text-xs text-green-400 font-sans flex items-center gap-1"
                         >
                            <CheckCircle size={12} /> Nice catch! Code customized for readability.
                            <button onClick={() => setFixed(false)} className="ml-auto text-slate-500 hover:text-white underline">Reset</button>
                         </motion.div>
                      </motion.div>
                    )}
                   </AnimatePresence>
                </div>
             </div>
          </motion.div>

        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Code Like a Pro, Play Like a Gamer
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400"
            >
              Learning shouldn&apos;t be boring. We&apos;ve gamified the entire engineering journey.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              delay={0.1}
              icon={<Brain className="w-8 h-8 text-purple-400" />}
              title="Cognitive Profiling"
              description="We track your problem-solving velocity and conceptual grasp to build a mental model of your unique learning style."
            />
            <FeatureCard 
              delay={0.2}
              icon={<Code className="w-8 h-8 text-blue-400" />}
              title="Real-time Mentor"
              description="An AI companion that guides you without giving the answer. It asks the right questions to unblock your logic."
            />
            <FeatureCard 
              delay={0.3}
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Gamified Mastery"
              description="Earn XP, maintain streaks, and unlock achievements as you conquer complex algorithms and data structures."
            />
          </div>
        </div>
      </section>

      {/* Fun Section: The "Late Night" Vibe */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5 -skew-y-3 transform origin-top-left scale-110"></div>
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
               <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
                  <Coffee className="text-amber-400" size={32} />
                  3 AM Debugging Buddy
               </h2>
               <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  We&apos;ve all been there. It&apos;s late, the coffee is cold, and the console is red. 
                  AI Tutor is that friend who stays up with you, spotting the missing semicolon 
                  before you lose your mind.
               </p>
               <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                  <div className="flex gap-4 mb-4">
                     <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <Ghost size={20} className="text-slate-400" />
                     </div>
                     <div className="bg-slate-800 py-3 px-4 rounded-lg rounded-tl-none text-slate-300 text-sm">
                        I see you&apos;re tired. You missed the indentation on line 42. <br/>
                        Want to take a 5-minute break? 🐸
                     </div>
                  </div>
                   <div className="flex gap-4 justify-end">
                     <div className="bg-blue-600 py-3 px-4 rounded-lg rounded-tr-none text-white text-sm">
                        You&apos;re a lifesaver. Let&apos;s fix line 42 first.
                     </div>
                     <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="font-bold text-blue-400">Me</span>
                     </div>
                  </div>
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-[80px] opacity-20"></div>
               <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-8 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                     <div className="font-bold text-lg">My Stats</div>
                     <div className="text-xs text-slate-500">Last 7 Days</div>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-red-500/10 text-red-400 rounded-lg"><Bug size={16}/></div>
                           <span>Bugs Squashed</span>
                        </div>
                        <span className="font-bold text-xl">142</span>
                     </div>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg"><Zap size={16}/></div>
                           <span>Current Streak</span>
                        </div>
                        <span className="font-bold text-xl">12 Days</span>
                     </div>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><Brain size={16}/></div>
                           <span>Logic Level</span>
                        </div>
                        <span className="font-bold text-xl">Lvl 5</span>
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Company Insights Section */}
      <section id="companies" className="py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                   <Briefcase size={14} /> For Hiring Teams
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                   Find Talent That Actually <br/>
                   <span className="text-blue-400">Understands the Core.</span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                   Stop hiring based on LeetCode memorization. Our AI analyzes the <i>cognitive process</i> of every student, giving you deep insights into their problem-solving capability, code quality, and learning velocity.
                </p>
                
                <div className="space-y-6 mb-10">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <Search className="text-blue-400" size={24} />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg mb-1">Deep Skill Analytics</h3>
                         <p className="text-slate-400 text-sm">View not just if they solved it, but <i>how</i>—time complexity, readability, and edge-case handling.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <Users className="text-purple-400" size={24} />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg mb-1">Culture-Fit Matches</h3>
                         <p className="text-slate-400 text-sm">Filter candidates by their coding style—whether you need rapid prototypers or detailed architects.</p>
                      </div>
                   </div>
                </div>

                <Link href="/login">
                   <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-all group">
                      Access Company Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </Link>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
             >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px]"></div>
                
                <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
                   <div className="font-bold text-slate-200">Candidate Insight #842</div>
                   <div className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Recommended</div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Problem Solving</span>
                      <div className="flex gap-1">
                         <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-[92%] h-full bg-blue-500"></div>
                         </div>
                         <span className="font-mono text-blue-400">92%</span>
                      </div>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Code Efficiency</span>
                      <div className="flex gap-1">
                         <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-[88%] h-full bg-purple-500"></div>
                         </div>
                         <span className="font-mono text-purple-400">88%</span>
                      </div>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Debugging Speed</span>
                      <div className="flex gap-1">
                         <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-[95%] h-full bg-green-500"></div>
                         </div>
                         <span className="font-mono text-green-400">95%</span>
                      </div>
                   </div>
                </div>

                <div className="mt-8 bg-slate-900 rounded-xl p-4 border border-slate-800">
                   <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">AI Analysis</div>
                   <p className="text-sm text-slate-300 italic">
                      &quot;Candidate demonstrates exceptional ability to optimize generic algorithms. Consistently refactors for readability after initial solution. Best suited for backend architecture roles.&quot;
                   </p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6"
          >
            Ready to code smarter?
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-slate-400 mb-10 text-lg"
          >
            Join thousands of students mastering their craft with AI.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4"
          >
             <Link href="/login">
               <button className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                 Get Started for Free
               </button>
             </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-lg mb-4">
               <Brain size={18} className="text-blue-500" /> AI Tutor
            </div>
            <p>Empowering students to code with confidence.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Learn</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">Features</a></li>
              <li><a href="#" className="hover:text-blue-400">Curriculum</a></li>
              <li><a href="#" className="hover:text-blue-400">Practice</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
             <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400">Community</a></li>
              <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
             <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-400">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center pt-8 border-t border-slate-900">
          &copy; {new Date().getFullYear()} AI Tutor Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }: { icon: React.ReactNode, title: string, description: string, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors group cursor-default"
    >
      <div className="bg-slate-950 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

function CheckCircle({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}

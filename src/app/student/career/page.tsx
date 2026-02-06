'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Lock, BarChart2, Code, Activity, Settings, LogOut, Award } from 'lucide-react';

export default function CareerReadiness() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: '/student/dashboard', icon: Activity, label: 'Overview' },
    { href: '/student/career', icon: BarChart2, label: 'Career Audit' },
    { href: '/student/practice', icon: Code, label: 'Practice Lab' },
    { href: '/student/profile', icon: Award, label: 'Achievements' },
  ];

  // Mock data - in real app would come from /api/analysis
  const analysis = {
      readinessScore: 68,
      weaknesses: [
          { topic: 'Dynamic Programming', severity: 'High', solved: 2, total: 50 },
          { topic: 'Graph Theory', severity: 'Medium', solved: 5, total: 40 },
      ],
      strengths: [
          { topic: 'Arrays & Hashing', level: 'Expert', solved: 45 },
          { topic: 'Two Pointers', level: 'Advanced', solved: 28 },
      ],
      platforms: {
          leetcode: { connected: !!session?.user?.leetcode, score: '1450', color: 'text-yellow-500' },
          codeforces: { connected: !!session?.user?.codeforces, score: 'Unrated', color: 'text-blue-500' },
          hackerrank: { connected: !!session?.user?.hackerrank, score: '3 Stars', color: 'text-green-500' },
      }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex-col hidden md:flex bg-slate-950">
        <div className="p-6 border-b border-slate-800">
           <Link href="/student/dashboard" className="flex items-center gap-2 font-bold text-white text-lg">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                   <Code size={18} className="text-white" />
               </div>
               AI Tutor
           </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link href="/student/profile" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
             <Settings size={18} />
             <span>Settings</span>
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
             <LogOut size={18} />
             <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Career Readiness Audit</h1>
            <p className="text-slate-400">Based on your activity across all linked platforms and our internal compiler.</p>
        </header>

        {/* Score Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="relative z-10">
                    <div className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">Placement Probability</div>
                    <div className="text-6xl font-bold text-white mb-2">{analysis.readinessScore}%</div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium">
                        <AlertTriangle size={12} /> Needs Improvement in DP
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <PlatformCard 
                    name="LeetCode" 
                    status={analysis.platforms.leetcode.connected ? 'Connected' : 'Not Linked'} 
                    score={analysis.platforms.leetcode.score}
                    color="text-yellow-500"
                />
                <PlatformCard 
                    name="Codeforces" 
                    status={analysis.platforms.codeforces.connected ? 'Connected' : 'Not Linked'}
                    score={analysis.platforms.codeforces.score} 
                    color="text-blue-500"
                />
                <PlatformCard 
                    name="HackerRank" 
                    status={analysis.platforms.hackerrank.connected ? 'Connected' : 'Not Linked'}
                    score={analysis.platforms.hackerrank.score} 
                    color="text-green-500"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weaknesses */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6 text-red-400 font-semibold">
                    <TrendingUp className="rotate-180" size={20} /> Critical Weaknesses
                </div>
                <div className="space-y-4">
                    {analysis.weaknesses.map((w, idx) => (
                        <div key={idx} className="bg-slate-950 p-4 rounded-lg flex items-center justify-between group cursor-pointer hover:border-red-500/50 border border-transparent transition-all">
                            <div>
                                <div className="font-bold text-slate-200">{w.topic}</div>
                                <div className="text-xs text-slate-500">Solved {w.solved}/{w.total} problems</div>
                            </div>
                            <button className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-bold rounded hover:bg-red-500 hover:text-white transition-colors">
                                Practice Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6 text-green-400 font-semibold">
                    <CheckCircle size={20} /> Core Strengths
                </div>
                <div className="space-y-4">
                    {analysis.strengths.map((s, idx) => (
                         <div key={idx} className="bg-slate-950 p-4 rounded-lg flex items-center justify-between border border-transparent">
                            <div>
                                <div className="font-bold text-slate-200">{s.topic}</div>
                                <div className="text-xs text-slate-500">{s.level} Proficiency</div>
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-green-500/20 flex items-center justify-center text-green-500 font-bold text-sm">
                                {s.solved}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ name, status, score, color }: { name: string, status: string, score: string, color: string }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <span className={`font-bold ${color}`}>{name}</span>
                {status === 'Connected' ? <CheckCircle size={16} className="text-green-500" /> : <Lock size={16} className="text-slate-600" />}
            </div>
            <div className="mt-4">
                <div className="text-xs text-slate-500">Current Rating</div>
                <div className="text-xl font-bold text-white">{score}</div>
            </div>
        </div>
    )
}

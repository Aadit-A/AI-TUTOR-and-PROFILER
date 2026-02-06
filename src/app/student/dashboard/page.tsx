'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Activity,
  Zap,
  BookOpen,
  Code,
  Award,
  Clock,
  ChevronRight,
  Play,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  BarChart2
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [leetcodeData, setLeetcodeData] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (!session?.user?.leetcode) {
        router.push('/onboarding/leetcode');
      } else {
        // Fetch LeetCode Stats
        fetch('/api/student/leetcode-stats')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setLeetcodeData(data.data);
            }
          })
          .catch(err => console.error(err));
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading profile...</div>;
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex-col hidden md:flex bg-slate-950">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-2 font-bold text-white text-lg">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                   <Code size={18} className="text-white" />
               </div>
               AI Tutor
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<Activity size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => router.push('/student/dashboard')} />
          <SidebarItem icon={<BarChart2 size={18} />} label="Career Audit" active={activeTab === 'career'} onClick={() => router.push('/student/career')} />
          <SidebarItem icon={<Code size={18} />} label="Practice Lab" active={activeTab === 'practice'} onClick={() => router.push('/student/practice')} />
          <SidebarItem icon={<Award size={18} />} label="Achievements" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link href="/student/profile">
             <SidebarItem icon={<Settings size={18} />} label="Settings" />
          </Link>
          <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
             <LogOut size={18} />
             <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-sm z-10">
           <h2 className="text-white font-semibold">Welcome back, {session?.user?.name || leetcodeData?.username || 'Student'}</h2>
           <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input type="text" placeholder="Search topics..." className="bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors w-64" />
              </div>
              <button className="relative w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors">
                <Bell size={16} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-[1px]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      {leetcodeData?.avatar ? (
                          <img src={leetcodeData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                          <User size={16} className="text-slate-300" />
                      )}
                  </div>
              </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
              label="Easy Problems" 
              value={leetcodeData?.solvedStats?.find((s: any) => s.difficulty === 'Easy')?.count || '0'} 
              sub="LeetCode" 
              icon={<Activity className="text-green-400" />} 
              trend="Keep it up"
            />
            <StatCard 
              label="Medium Problems" 
              value={leetcodeData?.solvedStats?.find((s: any) => s.difficulty === 'Medium')?.count || '0'} 
              sub="LeetCode" 
              icon={<Zap className="text-yellow-400" />} 
            />
            <StatCard 
              label="Hard Problems" 
              value={leetcodeData?.solvedStats?.find((s: any) => s.difficulty === 'Hard')?.count || '0'} 
              sub="LeetCode" 
              icon={<Award className="text-red-400" />} 
            />
            <StatCard 
              label="Total Solved" 
              value={leetcodeData?.solvedStats?.find((s: any) => s.difficulty === 'All')?.count || '0'} 
              sub="Global Rank: N/A" 
              icon={<CheckSquare className="text-purple-400" />} 
              trend="All Time" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Learning Path */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-white">Current Learning Path</h3>
              
              {/* Active Course Card */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Code size={120} />
                 </div>
                 <div className="relative z-10">
                    <span className="inline-block px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded mb-4">DATA STRUCTURES</span>
                    <h2 className="text-2xl font-bold text-white mb-2">Advanced Graph Algorithms</h2>
                    <p className="text-slate-400 mb-6 max-w-md">Mastering BFS, DFS, Dijkstra&apos;s algorithm and their applications in real-world networking problems.</p>
                    
                    <div className="mb-6">
                       <div className="flex justify-between text-xs mb-2">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">65%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[65%] rounded-full"></div>
                       </div>
                    </div>

                    <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-all">
                       <Play size={16} fill="currentColor" /> Continue Lesson
                    </button>
                 </div>
              </div>

              {/* Recent Activity / Submissions */}
              <div>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Recent Submissions</h3>
                    <a href={`https://leetcode.com/${leetcodeData?.username}`} target="_blank" className="text-sm text-blue-400 hover:text-blue-300">View on LeetCode</a>
                 </div>
                 <div className="space-y-3">
                    {leetcodeData?.recentSubmissions?.length > 0 ? (
                        leetcodeData.recentSubmissions.map((sub: any, idx: number) => (
                           <ChallengeRow 
                                key={idx}
                                title={sub.title} 
                                difficulty="Accepted" 
                                time={new Date(parseInt(sub.timestamp) * 1000).toLocaleDateString()}
                                type="Algorithm" 
                                onClick={() => window.open(`https://leetcode.com/problems/${sub.titleSlug}`, '_blank')}
                           />
                        ))
                    ) : (
                        <div className="text-slate-500 text-sm italic">No recent submissions found.</div>
                    )}
                 </div>
              </div>

            </div>

            {/* Right Side Stats / Metrics */}
            <div className="space-y-6">
               <h3 className="text-lg font-semibold text-white">Cognitive Metrics</h3>
               
               <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-6">
                  <MetricBar label="Logic Consistency" value={85} color="bg-green-500" />
                  <MetricBar label="Code Efficiency" value={72} color="bg-blue-500" />
                  <MetricBar label="Debugging Speed" value={60} color="bg-yellow-500" />
                  <MetricBar label="Syntax Accuracy" value={95} color="bg-purple-500" />
                  
                  <div className="pt-4 border-t border-slate-800">
                     <p className="text-xs text-slate-400 italic">
                        &quot;You&apos;ve shown a 15% improvement in debugging speed this week. Try focusing on code efficiency in your next session.&quot;
                     </p>
                  </div>
               </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-5 border border-blue-800/30">
                   <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2"><Award size={16}/> Daily Goal</h4>
                   <p className="text-sm text-slate-300 mb-3">Solve 2 medium problems to maintain your streak.</p>
                   <div className="text-2xl font-bold text-white">1/2</div>
                </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
  )
}

function StatCard({ label, value, sub, icon, trend }: { label: string, value: string, sub: string, icon: React.ReactNode, trend?: string }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
       <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
          {trend && <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{trend}</span>}
       </div>
       <div className="text-2xl font-bold text-white mb-1">{value}</div>
       <div className="text-xs text-slate-500 font-medium">{label}</div>
       <div className="text-[10px] text-slate-600 mt-1">{sub}</div>
    </div>
  )
}

function ChallengeRow({ title, difficulty, time, type, onClick }: { title: string, difficulty: string, time: string, type: string, onClick?: () => void }) {
   const diffColor = difficulty === 'Easy' ? 'text-green-400' : difficulty === 'Medium' ? 'text-yellow-400' : difficulty === 'Hard' ? 'text-red-400' : 'text-blue-400';
   
   return (
      <div onClick={onClick} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer group">
         <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${difficulty === 'Easy' ? 'bg-green-500' : difficulty === 'Medium' ? 'bg-yellow-500' : difficulty === 'Hard' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div>
               <div className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{title}</div>
               <div className="text-xs text-slate-500">{type} • {time}</div>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <span className={`text-xs font-medium ${diffColor} bg-slate-950 px-2 py-1 rounded border border-slate-800`}>{difficulty}</span>
             <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400" />
         </div>
      </div>
   )
}

function MetricBar({ label, value, color }: { label: string, value: number, color: string }) {
   return (
      <div>
         <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-200 font-medium">{value}%</span>
         </div>
         <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
         </div>
      </div>
   )
}

// Missing CheckSquare import
import { CheckSquare } from 'lucide-react';

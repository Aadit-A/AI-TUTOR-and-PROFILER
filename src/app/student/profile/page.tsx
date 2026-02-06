'use client'

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Code,
  Activity,
  BookOpen,
  Award,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function StudentProfile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading profile...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar - Copied for consistency, should be refactored to layout */}
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
          <Link href="/student/dashboard">
            <SidebarItem icon={<Activity size={18} />} label="Overview" />
          </Link>
          <Link href="/student/dashboard">
            <SidebarItem icon={<BookOpen size={18} />} label="My Courses" />
          </Link>
          <Link href="/student/dashboard">
             <SidebarItem icon={<Code size={18} />} label="Practice Lab" />
          </Link>
          <Link href="/student/dashboard">
             <SidebarItem icon={<Award size={18} />} label="Achievements" />
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <SidebarItem icon={<Settings size={18} />} label="Profile Settings" active={true} />
          <button 
             onClick={() => signOut({ callbackUrl: '/login' })}
             className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          >
             <LogOut size={18} />
             <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-sm z-10">
           <h2 className="text-white font-semibold">Profile Settings</h2>
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-[1px]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      <User size={16} className="text-slate-300" />
                  </div>
              </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
           <div className="max-w-4xl mx-auto space-y-8">
              
              <div className="mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">Connect Your Coding Profiles</h1>
                  <p className="text-slate-400">Link your competitive programming accounts to sync your progress and get personalized AI recommendations.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 {/* LeetCode */}
                 <ConnectCard 
                    platform="LeetCode" 
                    icon={<div className="w-10 h-10 rounded-lg bg-[#FFA116]/20 text-[#FFA116] flex items-center justify-center"><Code size={20} /></div>}
                    connectedUser={(session?.user as any)?.leetcode} 
                    apiUrl="/api/leetcode/verify"
                    onConnect={async (username) => { await update({ leetcode: username }) }}
                 />

                 {/* Codeforces */}
                 <ConnectCard 
                    platform="Codeforces" 
                    icon={<div className="w-10 h-10 rounded-lg bg-[#1f8dd6]/20 text-[#1f8dd6] flex items-center justify-center"><Activity size={20} /></div>}
                    connectedUser={(session?.user as any)?.codeforces} 
                    apiUrl="/api/codeforces/verify"
                    onConnect={async (username) => { await update({ codeforces: username }) }}
                 />

                 {/* HackerRank */}
                 <ConnectCard 
                    platform="HackerRank" 
                    icon={<div className="w-10 h-10 rounded-lg bg-[#2EC866]/20 text-[#2EC866] flex items-center justify-center"><Code size={20} /></div>}
                    connectedUser={(session?.user as any)?.hackerrank} 
                    apiUrl="/api/hackerrank/verify"
                    onConnect={async (username) => { await update({ hackerrank: username }) }}
                 />
              </div>

              <div className="flex justify-end mt-8">
                  <Link href="/student/dashboard">
                      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
                          Go to Dashboard
                      </button>
                  </Link>
              </div>

           </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
       onClick={onClick}
       className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
    >
       {icon}
       <span className="font-medium text-sm">{label}</span>
    </div>
  )
}

function ConnectCard({ platform, icon, connectedUser, apiUrl, onConnect }: { 
    platform: string, 
    icon: React.ReactNode, 
    connectedUser?: string,
    apiUrl: string,
    onConnect: (username: string) => Promise<void>
}) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verifiedData, setVerifiedData] = useState<any>(null);

    const handleVerify = async () => {
        if (!username) return;
        setLoading(true);
        setError('');
        setVerifiedData(null);

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Verification failed');
            setVerifiedData(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
           await onConnect(verifiedData.username);
           setVerifiedData(null); 
           setUsername('');
           // Force page refresh or session usage might need it to show connected state immediately if session update is slow locally
           // But `onConnect` calls `update` so it should trigger re-render
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (connectedUser) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {icon}
                    <div>
                        <h3 className="font-bold text-white">{platform}</h3>
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle size={14} />
                            <span>Connected as <strong>{connectedUser}</strong></span>
                        </div>
                    </div>
                </div>
                <button className="text-slate-500 text-sm hover:text-slate-300">Unlink</button>
            </div>
        )
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <div className="flex items-center gap-4 mb-4">
                {icon}
                <h3 className="font-bold text-white">Connect {platform}</h3>
             </div>
             
             {!verifiedData ? (
                 <div className="flex gap-3">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            placeholder={`${platform} Username`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                         {error && (
                            <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
                                <AlertCircle size={12} /> {error}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleVerify}
                        disabled={loading || !username}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 h-fit"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify'}
                    </button>
                 </div>
             ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                                 {verifiedData.avatar ? <img src={verifiedData.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={14} className="text-slate-400" />}
                             </div>
                             <div>
                                 <div className="text-sm font-bold text-white">{verifiedData.username}</div>
                                 <div className="text-xs text-slate-500">Account verified</div>
                             </div>
                        </div>
                        <CheckCircle className="text-green-500" size={18} />
                    </div>

                    {platform === 'LeetCode' && verifiedData.submitStats && (
                        <div className="mb-3">
                            <div className="grid grid-cols-3 gap-2 text-center bg-slate-900 rounded p-2 text-xs mb-2">
                                <div>
                                    <div className="text-green-400 font-bold">{verifiedData.submitStats.acSubmissionNum.find((s:any) => s.difficulty === 'Easy')?.count || 0}</div>
                                    <div className="text-slate-500">Easy</div>
                                </div>
                                <div>
                                    <div className="text-yellow-400 font-bold">{verifiedData.submitStats.acSubmissionNum.find((s:any) => s.difficulty === 'Medium')?.count || 0}</div>
                                    <div className="text-slate-500">Med</div>
                                </div>
                                <div>
                                    <div className="text-red-400 font-bold">{verifiedData.submitStats.acSubmissionNum.find((s:any) => s.difficulty === 'Hard')?.count || 0}</div>
                                    <div className="text-slate-500">Hard</div>
                                </div>
                            </div>
                            
                            {verifiedData.recentSubmissions && verifiedData.recentSubmissions.length > 0 && (
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Recent Solved</div>
                                    {verifiedData.recentSubmissions.map((sub: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-xs bg-slate-900/50 p-1.5 rounded border border-slate-800/50">
                                            <span className="truncate max-w-[150px]">{sub.title}</span>
                                            <span className="text-slate-500 text-[10px] whitespace-nowrap">
                                                {new Date(parseInt(sub.timestamp) * 1000).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {platform === 'Codeforces' && verifiedData.rating && (
                        <div className="mb-3 flex items-center gap-4 text-xs bg-slate-900 rounded p-2">
                             <div className="flex-1">
                                <span className="text-slate-500">Rating: </span>
                                <span className="text-yellow-500 font-bold">{verifiedData.rating}</span>
                             </div>
                             <div className="flex-1">
                                <span className="text-slate-500">Rank: </span>
                                <span className="text-white font-bold capitalize">{verifiedData.rank}</span>
                             </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button 
                            onClick={handleConfirm}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {loading ? 'Linking...' : 'Confirm & Link'}
                        </button>
                         <button 
                            onClick={() => setVerifiedData(null)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
             )}
        </div>
    )
}

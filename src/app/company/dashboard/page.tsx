'use client'

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  PieChart,
  Settings,
  LogOut,
  Bell,
  Search,
  Building,
  Filter,
  Download,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar - Dark for contrast */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-2 font-bold text-white text-lg">
               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                   <Users size={18} className="text-white" />
               </div>
               AI Recruiter
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<Users size={18} />} label="Candidates" active={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')} />
          <SidebarItem icon={<Briefcase size={18} />} label="Jobs" active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} />
          <SidebarItem icon={<PieChart size={18} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
          <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
             <LogOut size={18} />
             <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
           <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Talent Dashboard</h2>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">Enterprise</span>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
                  <Briefcase size={16} /> Post Job
              </button>
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                      TC
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
              </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                     <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                     <p className="text-gray-500">Track your recruitment pipeline and candidate insights.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <KpiCard label="Active Jobs" value="12" change="+2" />
                    <KpiCard label="Total Candidates" value="843" change="+12% this month" positive />
                    <KpiCard label="Avg. Capability Score" value="8.4" change="Top 15% of industry" positive />
                    <KpiCard label="Time to Hire" value="14 Days" change="-3 days vs L30" positive />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Candidate Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-semibold text-gray-800">Recent High-Potential Matches</h3>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded border border-transparent hover:border-gray-200 transition-all"><Filter size={16} /></button>
                                <button className="p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded border border-transparent hover:border-gray-200 transition-all"><Download size={16} /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Candidate</th>
                                        <th className="px-6 py-3 font-medium">Role</th>
                                        <th className="px-6 py-3 font-medium">Capability Score</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <CandidateRow name="Sarah Miller" role="Senior Backend" score={94} status="Interview" />
                                    <CandidateRow name="James Chen" role="Full Stack" score={89} status="Screening" />
                                    <CandidateRow name="Anita Patel" role="DevOps Lead" score={92} status="Offer" />
                                    <CandidateRow name="Mike Ross" role="Frontend" score={88} status="Screening" />
                                    <CandidateRow name="David Kim" role="Senior Backend" score={85} status="Review" />
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50/50 text-center">
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all candidates</a>
                        </div>
                    </div>

                    {/* Activity / Insights */}
                    <div className="space-y-6">
                        
                        {/* Behavioral Insights */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Pipeline Health</h3>
                            <div className="space-y-4">
                                <PipelineStage stage="Applied" count={142} color="bg-gray-200" width="100%" />
                                <PipelineStage stage="Screening" count={45} color="bg-blue-200" width="40%" />
                                <PipelineStage stage="Technical Assessment" count={18} color="bg-purple-200" width="15%" />
                                <PipelineStage stage="On-site Interview" count={6} color="bg-yellow-200" width="5%" />
                                <PipelineStage stage="Offer" count={2} color="bg-green-200" width="2%" />
                            </div>
                        </div>

                         {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <ActivityItem text="Sarah M. completed 'Graph Algorithms' assessment with 98% accuracy." time="2h ago" />
                                <ActivityItem text="New application for 'Product Manager' from J. Doe." time="4h ago" />
                                <ActivityItem text="Technical Interview scheduled with M. Ross." time="5h ago" />
                            </div>
                        </div>

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
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>}
    </div>
  )
}

function KpiCard({ label, value, change, positive }: { label: string, value: string, change: string, positive?: boolean }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
            <p className={`text-xs font-medium ${positive ? 'text-green-600' : 'text-gray-500'}`}>{change}</p>
        </div>
    )
}

function CandidateRow({ name, role, score, status }: { name: string, role: string, score: number, status: string }) {
    let statusClass = "bg-gray-100 text-gray-700";
    if (status === 'Offer') statusClass = "bg-green-100 text-green-700";
    if (status === 'Interview') statusClass = "bg-purple-100 text-purple-700";
    if (status === 'Screening') statusClass = "bg-blue-100 text-blue-700";

    return (
        <tr className="hover:bg-gray-50/80 transition-colors cursor-pointer group">
            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
                {name}
            </td>
            <td className="px-6 py-4 text-gray-600">{role}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 w-16">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${score}%` }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{score}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border border-black/5 ${statusClass}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-gray-400">
                <button className="p-1 hover:bg-gray-200 rounded transition-colors group-hover:text-gray-600"><MoreHorizontal size={16} /></button>
            </td>
        </tr>
    )
}

function PipelineStage({ stage, count, color, width }: { stage: string, count: number, color: string, width: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
                <span>{stage}</span>
                <span className="font-semibold">{count}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width }}></div>
            </div>
        </div>
    )
}

function ActivityItem({ text, time }: { text: string, time: string }) {
    return (
        <div className="flex gap-3 text-sm">
            <div className="mt-1 min-w-[6px] h-1.5 rounded-full bg-blue-500"></div>
            <div>
                <p className="text-gray-800 leading-snug">{text}</p>
                <p className="text-xs text-gray-400 mt-1">{time}</p>
            </div>
        </div>
    )
}

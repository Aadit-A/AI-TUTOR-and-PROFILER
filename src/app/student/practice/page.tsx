'use client';

import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Send, Bug, Play, Zap, Terminal, Sparkles, Bot, User, Code2, RotateCcw, ChevronRight, ChevronLeft, LayoutDashboard, Briefcase, UserCircle, Code, LogOut, Settings, Activity, Award } from 'lucide-react';

export default function PracticeLab() {
  const [code, setCode] = useState('#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [bugsCrushed, setBugsCrushed] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/student/dashboard', icon: Activity, label: 'Overview', color: 'from-blue-500 to-purple-600' },
    { href: '/student/practice', icon: Code, label: 'Practice Lab', color: 'from-blue-500 to-purple-600' },
    { href: '/student/career', icon: Briefcase, label: 'Career Audit', color: 'from-blue-500 to-purple-600' },
    { href: '/student/profile', icon: Settings, label: 'Settings', color: 'from-blue-500 to-purple-600' },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, aiLoading]);

  const runCode = async () => {
    setLoading(true);
    setOutput('🔨 Compiling and hunting bugs...');
    
    try {
        const res = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                code,
                language: 'cpp' 
            }),
        });
        const data = await res.json();
        setOutput(data.output);
        
        // Fun success animation
        if (!data.output?.toLowerCase().includes('error')) {
          setBugsCrushed(prev => prev + 1);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
    } catch (err: any) {
        setOutput(`❌ Execution Error: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };

  const askAI = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, code }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', text: data.message }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't connect to the server." }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Subtle animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Success overlay animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl shadow-blue-500/30 flex items-center gap-3">
              <Zap size={20} />
              <span className="font-semibold">Code executed successfully!</span>
            </div>
          </div>
        </div>
      )}

      {/* Minimizable Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex-col hidden md:flex bg-slate-950 border-r border-slate-800 relative z-20`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/student/dashboard" className={`flex items-center gap-2 font-bold text-white text-lg ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Code size={18} className="text-white" />
            </div>
            {sidebarOpen && <span>AI Tutor</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                } ${!sidebarOpen && 'justify-center'}`}
              >
                <item.icon 
                  size={18} 
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                  }`} 
                />
                {sidebarOpen && (
                  <span className={`text-sm transition-colors duration-200 ${
                    isActive ? 'text-blue-400' : ''
                  }`}>
                    {item.label}
                  </span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-16 px-3 py-2 bg-slate-800 rounded-lg text-sm text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link 
            href="/student/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <Award size={18} />
            {sidebarOpen && <span>Achievements</span>}
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg group"
        >
          <ChevronLeft 
            size={14} 
            className={`text-slate-400 group-hover:text-white transition-all duration-300 ${!sidebarOpen && 'rotate-180'}`} 
          />
        </button>
      </aside>

      {/* Editor Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Code2 size={16} className="text-blue-400" />
                  <span className="text-blue-400 font-semibold text-sm">Practice Lab</span>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">C++</span>
                  <span className="text-slate-500 text-sm">• main.cpp</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                  <Zap size={14} className="text-yellow-500" />
                  <span className="text-slate-300 text-sm">{bugsCrushed} runs</span>
                </div>
                <button 
                    onClick={runCode}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    <Play size={14} className={loading ? 'animate-spin' : ''} /> 
                    {loading ? 'Running...' : 'Run Code'}
                </button>
            </div>
        </header>
        
        {/* Editor */}
        <div className="flex-1 relative">
            <Editor 
                height="100%" 
                defaultLanguage="cpp" 
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontLigatures: true,
                    padding: { top: 16 },
                    lineHeight: 1.6,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                }}
            />
        </div>
        
        {/* Output Console */}
        <div className="h-52 bg-slate-900 border-t border-slate-800 flex flex-col">
            <div className="h-10 bg-slate-900 px-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-xs font-semibold text-slate-400 tracking-wider">TERMINAL</span>
              </div>
              <button 
                onClick={() => setOutput('')}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors group"
              >
                <RotateCcw size={12} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                {output ? (
                  <div className="text-slate-300 whitespace-pre-wrap animate-fade-in">
                    {output.split('\n').map((line, i) => (
                      <div key={i} className="flex gap-2">
                        <ChevronRight size={12} className="text-blue-400 mt-1 flex-shrink-0" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-600 italic">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Ready to crush some bugs...</span>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* AI Tutor Section */}
      <div className="w-[380px] flex flex-col bg-slate-950 border-l border-slate-800 relative z-10">
         {/* Header */}
         <div className="h-16 border-b border-slate-800 flex items-center px-4 gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-semibold text-white">AI Tutor</h2>
              <p className="text-xs text-slate-500">Powered by Gemini</p>
            </div>
         </div>

         {/* Chat Messages */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {chatHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                      <Bot size={32} className="text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-2">Need help debugging?</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Ask me anything about your code! I can help explain errors, suggest fixes, or teach concepts.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-2 w-full">
                      {['Explain this code', 'Find bugs in my code', 'How can I optimize this?'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setChatInput(suggestion)}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-sm text-slate-400 hover:text-white transition-all duration-200 border border-slate-800 hover:border-slate-700 text-left flex items-center gap-2 group"
                        >
                          <Sparkles size={14} className="text-blue-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                </div>
            )}
            
            {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                      msg.role === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    
                    {/* Message bubble */}
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                </div>
            ))}
            
            {/* Typing indicator */}
            {aiLoading && (
                <div className="flex gap-3 animate-slide-up">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot size={12} />
                    </div>
                    <div className="bg-slate-900 rounded-xl px-4 py-3 border border-slate-800">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
         </div>

         {/* Input area */}
         <div className="p-4 border-t border-slate-800">
            <div className="relative">
                <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && askAI()}
                    placeholder="Ask about your code..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                />
                <button 
                    onClick={askAI}
                    disabled={aiLoading || !chatInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Send size={16} />
                </button>
            </div>
            <p className="mt-2 text-xs text-slate-600 text-center">
              Press Enter to send • AI reads your code automatically
            </p>
         </div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.5);
        }
      `}</style>
    </div>
  );
}

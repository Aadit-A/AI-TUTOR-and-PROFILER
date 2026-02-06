'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Brain, Code, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeetCodeOnboarding() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedData, setVerifiedData] = useState<any>(null);

  const verifyLeetCode = async () => {
    setLoading(true);
    setError('');
    setVerifiedData(null);

    try {
      const res = await fetch('/api/leetcode/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Server returned an invalid response. Check server logs.");
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify');
      }

      setVerifiedData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
      // Update the session with the leetcode username
      // In a real app, this would also save to the database via an API call
      await update({ leetcode: verifiedData.username });
      router.push('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-md">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
        >
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-6">
                <Code className="text-yellow-500" size={32} />
             </div>
             <h1 className="text-3xl font-bold mb-2">Connect LeetCode</h1>
             <p className="text-slate-400">
                To build your AI profile, we need to analyze your problem-solving history.
             </p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl"
        >
            {!verifiedData ? (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">LeetCode Username</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. neetcode123"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none transition-all"
                            />
                        </div>
                        {error && (
                            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={verifyLeetCode}
                        disabled={loading || !username}
                        className="w-full bg-white text-slate-950 font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Account'}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                     <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-lg uppercase">
                            {verifiedData.username.substring(0, 2)}
                        </div>
                        <div>
                            <div className="font-bold text-white flex items-center gap-2">
                                {verifiedData.username} <CheckCircle className="text-green-500" size={16} />
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                Solved: <span className="text-green-400 font-mono">{verifiedData.submitStats.acSubmissionNum[0].count}</span> Problems
                            </div>
                        </div>
                     </div>

                     <button 
                        onClick={handleContinue}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                    >
                        Continue to Dashboard <ArrowRight size={18} />
                    </button>
                     <button 
                        onClick={() => setVerifiedData(null)}
                        className="w-full text-slate-500 text-sm hover:text-white transition-colors"
                    >
                        Not you? Try a different username
                    </button>
                </div>
            )}
        </motion.div>
      </div>
    </div>
  );
}

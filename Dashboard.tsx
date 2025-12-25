import React, { useState, useEffect } from 'react';
import { useRunStore } from '../store/runStore';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { RunnerLogs } from '../components/RunnerLogs';
import { AdminModal } from '../components/AdminModal';
import { AdminPanel } from '../components/AdminPanel';
import { Shield, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { runners, logs, isAdmin, lastUpdated, calculateTotals } = useRunStore();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Ensure totals are calculated on mount
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // Sort runners by total KM descending
  const sortedRunners = [...runners].sort((a, b) => b.totalKm - a.totalKm);
  
  // Top 3
  const topRunners = sortedRunners.slice(0, 3);
  
  // Top Woman
  const topWoman = sortedRunners.find(r => r.gender === 'Female');
  
  // Women Leaderboard
  const womenRunners = sortedRunners.filter(r => r.gender === 'Female');

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-provost-red selection:text-black pb-20">
      {/* Header */}
      <header className="bg-provost-red text-black py-6 px-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">
              Provost Marshal <span className="block text-sm md:text-lg font-bold opacity-80">Run Challenge 2026</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsAdminModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
              isAdmin 
                ? 'bg-black text-provost-red border-2 border-black' 
                : 'bg-black/10 hover:bg-black/20 text-black border-2 border-black/20'
            }`}
          >
            <Shield size={20} />
            <span className="hidden md:inline">{isAdmin ? 'Admin Mode' : 'Admin'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Challenge Info Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 rounded-xl p-4 mb-8 border border-gray-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-provost-red/20 p-2 rounded-lg">
              <Clock className="text-provost-red" />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold">Challenge Period</p>
              <p className="text-white font-bold">6 Jan 2026 — 31 Jan 2026</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs uppercase font-bold">Last Updated</p>
            <p className="text-provost-red font-mono">{formatDate(lastUpdated)}</p>
          </div>
        </div>

        {/* Admin Panel (Conditional) */}
        {isAdmin && <AdminPanel />}

        {/* Top Rankings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Top 3 Overall */}
          {topRunners.map((runner, index) => (
            <LeaderboardCard 
              key={runner.id} 
              runner={runner} 
              rank={index + 1} 
            />
          ))}
          
          {/* Top Woman Card */}
          {topWoman && (
            <LeaderboardCard 
              runner={topWoman} 
              rank={0} 
              isWomanCategory={true} 
            />
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Leaderboards */}
          <div className="lg:col-span-2 space-y-8">
            <LeaderboardTable runners={sortedRunners} title="All Runners Leaderboard" />
            <LeaderboardTable runners={womenRunners} title="Women's Leaderboard" />
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-1">
            <RunnerLogs logs={logs} runners={runners} />
          </div>
        </div>
      </main>

      {/* Admin Login Modal */}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  );
};

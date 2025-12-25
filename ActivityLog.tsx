import React, { useState } from 'react';
import { useRunStore } from '../store/runStore';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ActivityLog: React.FC = () => {
  const { runners, logs } = useRunStore();
  const navigate = useNavigate();
  const [selectedRunnerId, setSelectedRunnerId] = useState<string>('');

  // Generate dates from Jan 6 to Jan 31, 2026
  const startDate = new Date('2026-01-06');
  const endDate = new Date('2026-01-31');
  const dates: string[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  const getLogForDate = (runnerId: string, date: string) => {
    const log = logs.find(l => l.runnerId === runnerId && l.date === date);
    if (!log) return null;
    return log;
  };

  const getRunnerRank = (id: string) => {
    const sortedRunners = [...runners].sort((a, b) => b.totalKm - a.totalKm);
    return sortedRunners.findIndex(r => r.id === id) + 1;
  };

  const selectedRunner = runners.find(r => r.id === selectedRunnerId);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 pb-20">
      <header className="mb-6 flex items-center gap-4 sticky top-0 bg-black z-10 py-4 border-b border-gray-800">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold uppercase tracking-wider text-provost-red">Runner Activity Log</h1>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Runner Selection */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Select Runner</label>
          <div className="relative">
            <select
              value={selectedRunnerId}
              onChange={(e) => setSelectedRunnerId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white appearance-none focus:border-provost-red outline-none transition-colors cursor-pointer"
            >
              <option value="">-- Choose a Runner --</option>
              {runners.map(runner => (
                <option key={runner.id} value={runner.id}>
                  {runner.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <User size={20} />
            </div>
          </div>
        </div>

        {/* Details View */}
        {selectedRunner ? (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden animate-fade-in">
            <div className="bg-gray-800/50 p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-1">{selectedRunner.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-400 uppercase">{selectedRunner.gender}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 uppercase">Rank: <span className="text-white font-bold text-lg">#{getRunnerRank(selectedRunner.id)}</span></span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 uppercase">Total Distance: <span className="text-green-500 font-bold text-lg">{selectedRunner.totalKm.toFixed(1)} km</span></span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {dates.map(date => {
                  const log = getLogForDate(selectedRunner.id, date);
                  const dateObj = new Date(date);
                  const dateDisplay = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', weekday: 'short' });
                  
                  let displayValue = '-';
                  let colorClass = 'text-gray-700';
                  let bgClass = 'bg-gray-900 border-gray-800 opacity-60';
                  let shadowClass = '';

                  if (log) {
                    if (log.distance === 0) {
                      displayValue = 'No Run';
                      colorClass = 'text-provost-red';
                      bgClass = 'bg-red-900/10 border-red-900/30';
                      shadowClass = 'shadow-[0_0_10px_rgba(220,38,38,0.1)]';
                    } else {
                      displayValue = `${log.distance}`;
                      colorClass = 'text-green-500';
                      bgClass = 'bg-green-900/10 border-green-900/30';
                      shadowClass = 'shadow-[0_0_10px_rgba(34,197,94,0.1)]';
                    }
                  }
                  
                  return (
                    <div key={date} className={`flex flex-col p-3 rounded-lg border transition-all hover:scale-[1.02] ${bgClass} ${shadowClass}`}>
                      <span className="text-gray-500 text-xs font-mono uppercase mb-1">{dateDisplay}</span>
                      <span className={`text-lg font-bold ${colorClass}`}>
                        {displayValue} <span className="text-xs font-normal opacity-70">{log && log.distance > 0 ? 'km' : ''}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600 bg-gray-900/20 rounded-xl border border-gray-800/50 border-dashed">
            <p>Select a runner above to view their daily activity details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { RunLog, Runner } from '../types';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RunnerLogsProps {
  logs: RunLog[];
  runners: Runner[];
}

export const RunnerLogs: React.FC<RunnerLogsProps> = ({ logs, runners }) => {
  const navigate = useNavigate();

  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
  );

  const getRunnerName = (id: string) => runners.find(r => r.id === id)?.name || 'Unknown';

  return (
    <div className="w-full bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden mt-8">
      <div className="bg-gray-800/50 p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Recent Activity</h3>
        <button 
          onClick={() => navigate('/activity')}
          className="text-xs font-bold text-white hover:text-provost-red flex items-center gap-1 transition-colors"
        >
          VIEW ALL <ArrowRight size={14} />
        </button>
      </div>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="text-gray-400 text-xs uppercase">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Runner</th>
              <th className="p-4 font-semibold">Distance</th>
              <th className="p-4 font-semibold text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-400 text-sm">{log.date}</td>
                <td className="p-4 font-medium text-white">{getRunnerName(log.runnerId)}</td>
                <td className="p-4 font-bold text-green-500">{log.distance} km</td>
                <td className="p-4 text-right text-gray-500 text-sm">{log.time}</td>
              </tr>
            ))}
            {sortedLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No activity logs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

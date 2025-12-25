import React, { useState } from 'react';
import { Runner } from '../types';
import { useRunStore } from '../store/runStore';
import { Edit, ArrowRight, ChevronUp } from 'lucide-react';

interface LeaderboardTableProps {
  runners: Runner[];
  title: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ runners, title }) => {
  const { isAdmin } = useRunStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedRunners = isExpanded ? runners : runners.slice(0, 5);
  const hasMore = runners.length > 5;

  return (
    <div className="w-full bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      <div className="bg-provost-red/10 p-4 border-b border-provost-red/20 flex justify-between items-center">
        <h3 className="text-lg font-bold text-provost-red uppercase tracking-wider">{title}</h3>
        {hasMore && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-white hover:text-provost-red flex items-center gap-1 transition-colors"
          >
            {isExpanded ? 'VIEW LESS' : 'VIEW ALL'} 
            {isExpanded ? <ChevronUp size={14} /> : <ArrowRight size={14} />}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/40 text-gray-400 text-xs uppercase">
              <th className="p-4 font-semibold">Rank</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold text-right">Total KM</th>
              {isAdmin && <th className="p-4 font-semibold text-right">Edit</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {displayedRunners.map((runner, index) => (
              <tr key={runner.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-400 font-mono">#{index + 1}</td>
                <td className="p-4 font-medium text-white">
                  {runner.name}
                </td>
                <td className="p-4 text-right font-bold text-green-500 text-lg">
                  {runner.totalKm.toFixed(1)}
                </td>
                {isAdmin && (
                  <td className="p-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors" title="Edit Runner">
                      <Edit size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {runners.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="p-8 text-center text-gray-500">
                  No runners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

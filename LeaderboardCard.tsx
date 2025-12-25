import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { Runner } from '../types';

interface LeaderboardCardProps {
  runner: Runner;
  rank: number;
  title?: string;
  isWomanCategory?: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ runner, rank, title, isWomanCategory }) => {
  const getIcon = () => {
    if (isWomanCategory) return <Medal className="w-8 h-8 text-pink-500" />;
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-8 h-8 text-amber-700" />;
    return <Medal className="w-8 h-8 text-provost-red" />;
  };

  const getBgColor = () => {
    if (isWomanCategory) return 'bg-pink-50/10 border-pink-500/50';
    if (rank === 1) return 'bg-yellow-500/10 border-yellow-500';
    if (rank === 2) return 'bg-gray-400/10 border-gray-400';
    if (rank === 3) return 'bg-amber-700/10 border-amber-700';
    return 'bg-gray-800 border-gray-700';
  };

  const getTitle = () => {
    if (title) return title;
    if (isWomanCategory) return 'Fittest Provost Women';
    if (rank === 1) return 'Fittest Provost 1';
    if (rank === 2) return 'Fittest Provost 2';
    if (rank === 3) return 'Fittest Provost 3';
    return `Rank #${rank}`;
  };

  return (
    <div className={`relative flex flex-col items-center p-4 rounded-xl border-2 ${getBgColor()} shadow-lg transition-transform hover:scale-105`}>
      <div className="absolute -top-4 bg-provost-black border border-gray-700 rounded-full p-2 shadow-md">
        {getIcon()}
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
          {getTitle()}
        </h3>
        <h2 className="text-xl font-bold text-white truncate max-w-[150px]">{runner.name}</h2>
        <p className="text-3xl font-black text-green-500 mt-2">
          {runner.totalKm.toFixed(1)} <span className="text-sm font-normal text-gray-400">KM</span>
        </p>
      </div>
    </div>
  );
};

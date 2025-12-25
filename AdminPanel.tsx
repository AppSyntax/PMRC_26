import React, { useState } from 'react';
import { useRunStore } from '../store/runStore';
import { Plus, Trash2, UserPlus, Activity, X } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { runners, logs, addRunner, deleteRunner, addLog, deleteLog, logoutAdmin } = useRunStore();
  const [activeTab, setActiveTab] = useState<'logs' | 'runners'>('logs');

  // Form states
  const [newRunnerName, setNewRunnerName] = useState('');
  const [newRunnerGender, setNewRunnerGender] = useState<'Male' | 'Female'>('Male');
  
  const [logRunnerId, setLogRunnerId] = useState('');
  const [logDistance, setLogDistance] = useState('');
  const [isNoRun, setIsNoRun] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logTime, setLogTime] = useState('06:00');

  const handleAddRunner = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRunnerName.trim()) {
      addRunner({
        id: '', // Will be generated
        name: newRunnerName,
        gender: newRunnerGender,
        password: 'password123', // Default password
      });
      setNewRunnerName('');
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (logRunnerId && (logDistance || isNoRun)) {
      addLog({
        runnerId: logRunnerId,
        distance: isNoRun ? 0 : parseFloat(logDistance),
        date: logDate,
        time: logTime,
      });
      setLogDistance('');
      setIsNoRun(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-white font-bold">Admin Control Panel</h2>
        </div>
        <button 
          onClick={logoutAdmin}
          className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 bg-red-900/20 px-3 py-1 rounded-full transition-colors"
        >
          Exit Admin Mode
        </button>
      </div>

      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'logs' ? 'bg-gray-800 text-provost-red border-b-2 border-provost-red' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Activity size={16} /> Manage Logs
        </button>
        <button
          onClick={() => setActiveTab('runners')}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'runners' ? 'bg-gray-800 text-provost-red border-b-2 border-provost-red' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <UserPlus size={16} /> Manage Runners
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'logs' ? (
          <div className="space-y-8">
            {/* Add Log Form */}
            <form onSubmit={handleAddLog} className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Add New Run Log</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Runner</label>
                  <select
                    value={logRunnerId}
                    onChange={(e) => setLogRunnerId(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-provost-red outline-none"
                    required
                  >
                    <option value="">Select Runner</option>
                    {runners.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Distance (KM)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logDistance}
                    onChange={(e) => setLogDistance(e.target.value)}
                    className={`w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-provost-red outline-none ${isNoRun ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="0.0"
                    required={!isNoRun}
                    disabled={isNoRun}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="noRun" 
                      checked={isNoRun} 
                      onChange={(e) => {
                        setIsNoRun(e.target.checked);
                        if (e.target.checked) setLogDistance('');
                      }}
                      className="accent-provost-red w-4 h-4"
                    />
                    <label htmlFor="noRun" className="text-xs text-gray-400 cursor-pointer select-none">No Run</label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-provost-red outline-none"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-provost-red text-black font-bold p-2 rounded hover:bg-red-400 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Log
                  </button>
                </div>
              </div>
            </form>

            {/* Recent Logs List (Admin View) */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Recent Logs (Admin View)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-800 text-gray-400">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Runner</th>
                      <th className="p-3">Distance</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {logs.slice().reverse().slice(0, 10).map(log => (
                      <tr key={log.id} className="hover:bg-white/5">
                        <td className="p-3 text-gray-400">{log.date}</td>
                        <td className="p-3 text-white">{runners.find(r => r.id === log.runnerId)?.name}</td>
                        <td className={`p-3 font-bold ${log.distance === 0 ? 'text-provost-red' : 'text-green-500'}`}>
                          {log.distance === 0 ? 'No Run' : `${log.distance} km`}
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => deleteLog(log.id)}
                            className="text-red-500 hover:text-red-400 p-1 hover:bg-red-900/20 rounded"
                            title="Delete Log"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Add Runner Form */}
            <form onSubmit={handleAddRunner} className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Add New Runner</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newRunnerName}
                    onChange={(e) => setNewRunnerName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-provost-red outline-none"
                    placeholder="Rank Name Surname"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Gender</label>
                  <select
                    value={newRunnerGender}
                    onChange={(e) => setNewRunnerGender(e.target.value as 'Male' | 'Female')}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-provost-red outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-provost-red text-black font-bold p-2 rounded hover:bg-red-400 transition-colors flex items-center justify-center gap-2">
                    <UserPlus size={16} /> Add Member
                  </button>
                </div>
              </div>
            </form>

            {/* Runners List */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">All Runners</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-800 text-gray-400">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Total KM</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {runners.map(runner => (
                      <tr key={runner.id} className="hover:bg-white/5">
                        <td className="p-3 text-white font-medium">{runner.name}</td>
                        <td className="p-3 text-gray-400">{runner.gender}</td>
                        <td className="p-3 text-green-500 font-bold">{runner.totalKm.toFixed(1)}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure? This will delete the runner and all their logs.')) {
                                deleteRunner(runner.id);
                              }
                            }}
                            className="text-red-500 hover:text-red-400 p-1 hover:bg-red-900/20 rounded"
                            title="Delete Runner"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
